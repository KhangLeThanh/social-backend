const express = require("express");
const router = express.Router();

const {
  getMessage,
  createMessage,
} = require("../controllers/messagesController");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/", authenticateUser, createMessage);
router.get("/:chatId", authenticateUser, getMessage);

module.exports = router;
