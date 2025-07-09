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
const getPersonalPost = async (req, res) => {
  console.log("test userId");

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query params" });
  }

  const userIdNum = Number(userId);
  if (isNaN(userIdNum)) {
    return res.status(400).json({ error: "Invalid userId" });
  }
  try {
    const result = await pool.query(
      `SELECT 
         posts.id, 
         posts.user_id AS "userId",
         posts.post_user_id AS "postUserId", 
         posts.content, 
         posts.created_at AS "createdAt", 
         author.username AS "authorUsername",
         receiver.username AS "receiverUsername"
       FROM posts
       JOIN users AS author ON posts.user_id = author.id
       JOIN users AS receiver ON posts.post_user_id = receiver.id
       WHERE posts.user_id = $1 OR posts.post_user_id = $1
       ORDER BY posts.created_at DESC`,
      [userIdNum]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ getPersonalPost error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  const { content, userId, postUserId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO posts (content, user_id, post_user_id) VALUES ($1, $2, $3) RETURNING *",
      [content, userId, postUserId]
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
    getIO().emit("post_status", result.rows[0]);
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
module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPersonalPost,
};
