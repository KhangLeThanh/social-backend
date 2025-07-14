const pool = require("../db");
const { getIO } = require("../socket");

const getFriendRequest = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT u.id, u.username, fr.status, fr.created_at
      FROM friend_request fr
      JOIN users u 
        ON (u.id = fr.requester_id AND fr.receiver_id = $1)
        OR (u.id = fr.receiver_id AND fr.requester_id = $1)
      WHERE fr.status = 'accepted'
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getPersonalPost error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
const sendFriendRequest = async (req, res) => {
  const { userId, receiverId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO friend_request ( receiver_id, requester_id) VALUES ($1, $2) RETURNING *",
      [receiverId, userId]
    );
    getIO().emit("friend_reqeust_status", result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { sendFriendRequest, getFriendRequest };
