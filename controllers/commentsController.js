const pool = require("../db");
const { getIO } = require("../socket");

const createComment = async (req, res) => {
  const { content, userId, postId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3) RETURNING *",
      [content, userId, postId]
    );
    getIO().emit("comment_status", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getComment = async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query(
      'SELECT comments.id, comments.content, comments.created_at AS "createdAt", comments.user_id AS "userId", comments.post_id AS "postId", users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = $1 ORDER BY comments.created_at DESC',
      [postId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateComment = async (req, res) => {
  const { content } = req.body;

  const { commentId } = req.params;
  try {
    const result = await pool.query(
      "UPDATE comments SET content = $1 where id = $2 RETURNING *",
      [content, commentId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    getIO().emit("comment_status", result.rows[0]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM comments where id = $1 RETURNING *",
      [commentId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    getIO().emit("comment_status", result.rows[0]);

    res.status(200).json({
      message: "Comment deleted succesfully",
      deleteComment: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { createComment, getComment, updateComment, deleteComment };
