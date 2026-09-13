const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/my", authenticate, getOrders);
router.get("/all", authenticate, authorize("admin"), getAllOrders);
router.put("/:id/status", authenticate, authorize("admin"), updateOrderStatus);

module.exports = router;
