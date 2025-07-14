const express = require("express");
const router = express.Router();

const {
  sendFriendRequest,
  getFriendRequest,
} = require("../controllers/friendController");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/", authenticateUser, sendFriendRequest);
router.get("/:userId", authenticateUser, getFriendRequest);

module.exports = router;
