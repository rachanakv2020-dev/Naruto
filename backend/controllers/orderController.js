const pool = require("../config/db");

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { restaurant_id, address_id, items, notes } = req.body;

    if (!restaurant_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Restaurant and at least one item are required." });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const foodResult = await pool.query("SELECT id, price FROM foods WHERE id = $1", [item.food_id]);

      if (foodResult.rows.length === 0) {
        return res.status(404).json({ message: `Food not found: ${item.food_id}` });
      }

      const productPrice = Number(foodResult.rows[0].price);
      const quantity = Number(item.quantity || 1);
      const lineTotal = productPrice * quantity;
      totalAmount += lineTotal;

      orderItems.push({
        food_id: item.food_id,
        quantity,
        price: productPrice,
      });
    }

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, restaurant_id, address_id, total_amount, status, payment_status, notes)
       VALUES ($1, $2, $3, $4, 'pending', 'pending', $5)
       RETURNING *`,
      [userId, restaurant_id, address_id || null, totalAmount, notes || null]
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
  getOrders,
  getAllOrders,
  updateOrderStatus,
};
