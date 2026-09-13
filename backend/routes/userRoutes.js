const express = require("express");
const { authenticate } = require("../middleware/auth");
const { getProfile, updateProfile, getUsers } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.get("/", authenticate, getUsers);

module.exports = router;
