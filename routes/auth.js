const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/authController");

// Routes
router.post("/", loginUser);

module.exports = router;
