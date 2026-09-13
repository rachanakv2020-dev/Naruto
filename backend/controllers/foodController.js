const pool = require("../config/db");
const { buildPagination } = require("../utils/helpers");

const getFoods = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, restaurant_id, category_id, featured } = req.query;
    const { offset, limit: pageSize } = buildPagination(page, limit);

    let query = `
      SELECT DISTINCT ON (f.restaurant_id, LOWER(f.name))
        f.*, r.name AS restaurant_name, c.name AS category_name
      FROM foods f
      LEFT JOIN restaurants r ON r.id = f.restaurant_id
      LEFT JOIN categories c ON c.id = f.category_id
      WHERE 1 = 1
    `;
    const values = [];

    if (restaurant_id) {
      values.push(restaurant_id);
      query += ` AND f.restaurant_id = $${values.length}`;
    }

    if (category_id) {
      values.push(category_id);
      query += ` AND f.category_id = $${values.length}`;
    }

    if (featured !== undefined) {
      values.push(featured === "true");
      query += ` AND f.featured = $${values.length}`;
    }

    query += ` ORDER BY f.restaurant_id, LOWER(f.name), f.id ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(pageSize, offset);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT f.*, r.name AS restaurant_name, c.name AS category_name
       FROM foods f
       LEFT JOIN restaurants r ON r.id = f.restaurant_id
       LEFT JOIN categories c ON c.id = f.category_id
       WHERE f.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Food item not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createFood = async (req, res, next) => {
  try {
    const { restaurant_id, category_id, name, description, price, stock_quantity = 0, image, is_available, spicy, featured } = req.body;

    if (!restaurant_id || !name || !price) {
      return res.status(400).json({ message: "Restaurant ID, name and price are required." });
    }

    const result = await pool.query(
      `INSERT INTO foods (restaurant_id, category_id, name, description, price, stock_quantity, image, is_available, spicy, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [restaurant_id, category_id || null, name, description || null, price, stock_quantity, image || null, is_available !== false, spicy || false, featured || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return res.status(400).json({ message: "No fields provided for update." });
    }

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE foods SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Food item not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM foods WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Food item not found." });
    }

    res.json({ message: "Food item deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
