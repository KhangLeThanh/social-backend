const express = require("express");
const router = express.Router();

const {
  sendFriendRequest,
  getAcceptedFriend,
  getFriendShip,
  acceptfriendRequest,
  cancelfriendRequest,
} = require("../controllers/friendController");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/", authenticateUser, sendFriendRequest);
router.get("/friend-ship/:userId/:profileId", authenticateUser, getFriendShip);
router.get("/:userId", authenticateUser, getAcceptedFriend);
router.patch("/:requestId", authenticateUser, acceptfriendRequest);
router.delete("/:requestId", authenticateUser, cancelfriendRequest);

module.exports = router;
