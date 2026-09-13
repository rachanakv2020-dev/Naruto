const pool = require("../config/db");

const getCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (LOWER(name)) *
       FROM categories
       ORDER BY LOWER(name), id ASC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const result = await pool.query(
      "INSERT INTO categories (name, image) VALUES ($1, $2) RETURNING *",
      [name, image || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const result = await pool.query(
      "UPDATE categories SET name = COALESCE($1, name), image = COALESCE($2, image) WHERE id = $3 RETURNING *",
      [name || null, image || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.json({ message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
