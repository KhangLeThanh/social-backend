const pool = require("../db");
const { getIO } = require("../socket");

const getPosts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT posts.id, posts.user_id AS "userId", posts.content, posts.created_at AS "createdAt", users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, content FROM posts WHERE id = $1",
      [postId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const createPost = async (req, res) => {
  const { content, userId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *",
      [content, userId]
    );
    getIO().emit("post_status", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  try {
    const result = await pool.query(
      "UPDATE posts SET content = $1 WHERE id = $2 RETURNING *",
      [content, postId]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [postId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    getIO().emit("post_status", result.rows[0]);
    res.status(200).json({
      message: "Post deleted successfully",
      deletedPost: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getPosts, createPost, updatePost, deletePost, getPost };
