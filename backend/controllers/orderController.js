const crypto = require("crypto");
const Razorpay = require("razorpay");
const pool = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const calculateOrderDetails = async (items, restaurant_id) => {
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const foodResult = await pool.query("SELECT id, price FROM foods WHERE id = $1", [item.food_id]);

    if (foodResult.rows.length === 0) {
      throw new Error(`Food not found: ${item.food_id}`);
    }

    const productPrice = Number(foodResult.rows[0].price);
    const quantity = Number(item.quantity || 1);
    totalAmount += productPrice * quantity;

    orderItems.push({
      food_id: item.food_id,
      quantity,
      price: productPrice,
    });
  }

  return {
    totalAmount: Number(totalAmount.toFixed(2)),
    orderItems,
  };
};

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { restaurant_id, address_id, address, items, notes } = req.body;

    if (!restaurant_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Restaurant and at least one item are required." });
    }

    let finalAddressId = address_id || null;

    if (!finalAddressId && address && address.street && address.city) {
      const addressResult = await pool.query(
        `INSERT INTO addresses (user_id, label, street, city, state, postal_code, is_default)
         VALUES ($1, 'Delivery', $2, $3, $4, $5, true)
         RETURNING id`,
        [
          userId,
          address.street,
          address.city,
          address.state || null,
          address.postal_code || null,
        ]
      );
      finalAddressId = addressResult.rows[0].id;
    }

    const { totalAmount, orderItems } = await calculateOrderDetails(items, restaurant_id);

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, restaurant_id, address_id, total_amount, status, payment_status, notes)
       VALUES ($1, $2, $3, $4, 'pending', 'pending', $5)
       RETURNING *`,
      [userId, restaurant_id, finalAddressId, totalAmount, notes || null]
    );

    const order = orderResult.rows[0];

    for (const item of orderItems) {
      await pool.query(
        `INSERT INTO order_items (order_id, food_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.food_id, item.quantity, item.price]
      );
    }

    res.status(201).json({
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const createPaymentOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { restaurant_id, address_id, address, items, notes } = req.body;

    if (!restaurant_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Restaurant and at least one item are required." });
    }

    let finalAddressId = address_id || null;

    if (!finalAddressId && address && address.street && address.city) {
      const addressResult = await pool.query(
        `INSERT INTO addresses (user_id, label, street, city, state, postal_code, is_default)
         VALUES ($1, 'Delivery', $2, $3, $4, $5, true)
         RETURNING id`,
        [
          userId,
          address.street,
          address.city,
          address.state || null,
          address.postal_code || null,
        ]
      );
      finalAddressId = addressResult.rows[0].id;
    }

    const { totalAmount, orderItems } = await calculateOrderDetails(items, restaurant_id);
    const amountInPaise = Math.round((Number(totalAmount) + 30) * 100);

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, restaurant_id, address_id, total_amount, status, payment_status, notes)
       VALUES ($1, $2, $3, $4, 'pending', 'pending', $5)
       RETURNING *`,
      [userId, restaurant_id, finalAddressId, totalAmount + 30, notes || null]
    );

    const order = orderResult.rows[0];

    for (const item of orderItems) {
      await pool.query(
        `INSERT INTO order_items (order_id, food_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.food_id, item.quantity, item.price]
      );
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${order.id}`,
      notes: {
        userId: String(userId),
        orderId: String(order.id),
      },
    });

    res.status(201).json({
      message: "Razorpay payment order created.",
      order,
      razorpay: {
        key: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: razorpayOrder.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Incomplete payment verification payload." });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed." });
    }

    const orderResult = await pool.query(
      `UPDATE orders
       SET payment_status = 'paid', status = 'confirmed'
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [order_id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      message: "Payment verified successfully.",
      order: orderResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT o.*, r.name AS restaurant_name
      FROM orders o
      LEFT JOIN restaurants r ON r.id = o.restaurant_id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name AS user_name, r.name AS restaurant_name
       FROM orders o
       JOIN users u ON u.id = o.user_id
       JOIN restaurants r ON r.id = o.restaurant_id
       ORDER BY o.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const result = await pool.query(
      `UPDATE orders
       SET status = COALESCE($1, status), payment_status = COALESCE($2, payment_status)
       WHERE id = $3
       RETURNING *`,
      [status || null, payment_status || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getAllOrders,
  updateOrderStatus,
};
