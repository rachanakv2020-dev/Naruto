const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFoodById);
router.post("/", authenticate, authorize("admin"), createFood);
router.put("/:id", authenticate, authorize("admin"), updateFood);
router.delete("/:id", authenticate, authorize("admin"), deleteFood);

module.exports = router;
