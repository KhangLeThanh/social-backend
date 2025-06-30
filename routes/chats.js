const express = require("express");
const router = express.Router();

const { createChat } = require("../controllers/chatsController");
const authenticateUser = require("../middleware/authMiddleware");

router.get("/", authenticateUser, createChat);

module.exports = router;
