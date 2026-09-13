const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", authenticate, authorize("admin"), createRestaurant);
router.put("/:id", authenticate, authorize("admin"), updateRestaurant);
router.delete("/:id", authenticate, authorize("admin"), deleteRestaurant);

module.exports = router;
