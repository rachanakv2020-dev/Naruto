const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", authenticate, getCart);
router.post("/add", authenticate, addToCart);
router.put("/item/:id", authenticate, updateCartItem);
router.delete("/item/:id", authenticate, removeCartItem);

module.exports = router;
