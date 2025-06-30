const express = require("express");
const router = express.Router();

const {
  getMessage,
  createMessage,
} = require("../controllers/messagesController");
const authenticateUser = require("../middleware/authMiddleware");

router.get("/", authenticateUser, createMessage);
router.get("/:chatId", authenticateUser, getMessage);

module.exports = router;
