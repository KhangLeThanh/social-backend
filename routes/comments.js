const express = require("express");
const router = express.Router();

const {
  getComment,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/", authenticateUser, createComment);
router.patch("/:commentId", authenticateUser, updateComment);
router.get("/:postId", authenticateUser, getComment);
router.delete("/:commentId", authenticateUser, deleteComment);

module.exports = router;
