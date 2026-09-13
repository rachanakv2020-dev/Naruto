const pool = require("../config/db");
const { buildPagination } = require("../utils/helpers");

const getRestaurants = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, include_inactive } = req.query;
    const activeClause = include_inactive === "true" ? "" : "WHERE is_active = true";
    const { offset, page: pageNo, limit: pageSize } = buildPagination(page, limit);

    const [restaurantsResult, countResult] = await Promise.all([
      pool.query(
        `SELECT *
         FROM restaurants
         ${activeClause}
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [pageSize, offset]
      ),
      pool.query(`SELECT COUNT(*) AS total FROM restaurants ${activeClause}`)
    ]);

    res.json({
      page: pageNo,
      totalPages: Math.ceil(Number(countResult.rows[0].total) / pageSize),
      totalItems: Number(countResult.rows[0].total),
      items: restaurantsResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM restaurants WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createRestaurant = async (req, res, next) => {
  try {
    const { name, slug, description, cuisine, delivery_time, delivery_fee, image } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Restaurant name and slug are required." });
    }

    const result = await pool.query(
      `INSERT INTO restaurants (name, slug, description, cuisine, delivery_time, delivery_fee, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, slug, description, cuisine, delivery_time, delivery_fee || 0, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      "name",
      "slug",
      "description",
      "cuisine",
      "rating",
      "delivery_time",
      "delivery_fee",
      "image",
      "is_active",
    ];
    const fields = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return res.status(400).json({ message: "No fields provided for update." });
    }

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const result = await pool.query(
      `UPDATE restaurants SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM restaurants WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.json({ message: "Restaurant deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
