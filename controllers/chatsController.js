const pool = require("../db");

const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const existing = await pool.query(
      "SELECT * FROM chats WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)",
      [senderId, receiverId]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json(existing.rows[0]);
    }

    const result = await pool.query(
      "INSERT INTO chats (sender_id, receiver_id) VALUES ($1, $2) RETURNING *",
      [senderId, receiverId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { createChat };
