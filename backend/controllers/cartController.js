const pool = require("../config/db");

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cartResult = await pool.query(
      `SELECT c.id AS cart_id, ci.id AS cart_item_id, ci.quantity, f.*
       FROM cart c
       LEFT JOIN cart_items ci ON ci.cart_id = c.id
       LEFT JOIN foods f ON f.id = ci.food_id
       WHERE c.user_id = $1
       ORDER BY ci.created_at DESC`,
      [userId]
    );

    res.json(cartResult.rows);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { food_id, quantity = 1 } = req.body;

    if (!food_id) {
      return res.status(400).json({ message: "Food ID is required." });
    }

    let cart = await pool.query("SELECT * FROM cart WHERE user_id = $1", [userId]);

    if (cart.rows.length === 0) {
      cart = await pool.query(
        "INSERT INTO cart (user_id) VALUES ($1) RETURNING *",
        [userId]
      );
    }

    const cartId = cart.rows[0].id;

    const existing = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND food_id = $2",
      [cartId, food_id]
    );

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + $1
         WHERE cart_id = $2 AND food_id = $3
         RETURNING *`,
        [quantity, cartId, food_id]
      );

      return res.status(200).json(updated.rows[0]);
    }

    const result = await pool.query(
      "INSERT INTO cart_items (cart_id, food_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [cartId, food_id, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *",
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM cart_items WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    res.json({ message: "Cart item removed." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
