const express = require("express");
const router = express.Router();

const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPersonalPost,
} = require("../controllers/postsController");
const authenticateUser = require("../middleware/authMiddleware");

router.get("/", authenticateUser, getPosts);
router.post("/", authenticateUser, createPost);
router.get("/personal", getPersonalPost);
router.patch("/:postId", authenticateUser, updatePost);
router.delete("/:postId", authenticateUser, deletePost);
router.get("/:postId", authenticateUser, getPost);

module.exports = router;
