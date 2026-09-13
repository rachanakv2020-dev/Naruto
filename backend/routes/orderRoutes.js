const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  createOrder,
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", authenticate, createOrder);
router.post("/checkout", authenticate, createPaymentOrder);
router.post("/verify-payment", authenticate, verifyPayment);
router.get("/my", authenticate, getOrders);
router.get("/all", authenticate, authorize("admin"), getAllOrders);
router.put("/:id/status", authenticate, authorize("admin"), updateOrderStatus);

module.exports = router;
