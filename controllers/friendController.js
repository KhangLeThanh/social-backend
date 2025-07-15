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

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("getPersonalPost error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
const sendFriendRequest = async (req, res) => {
  const { senderId, receiverId, status } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO friend_request ( receiver_id, requester_id, status) VALUES ($1, $2, $3) RETURNING *",
      [receiverId, senderId, status]
    );
    getIO().emit("friend_reqeust_status", result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const acceptfriendRequest = async (req, res) => {
  const { status } = req.body;

  const { requestId } = req.params;

  try {
    const result = await pool.query(
      "UPDATE friend_request SET status = $1 where id = $2 RETURNING *",
      [status, requestId]
    );
    getIO().emit("friend_reqeust_status", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const cancelfriendRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM friend_request where id = $1 RETURNING *",
      [requestId]
    );
    getIO().emit("friend_reqeust_status", result.rows[0]);
    res.status(200).json({
      message: "Request canceled succesfully",
      cancelriendRequest: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getFriendShip = async (req, res) => {
  const { userId, profileId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, status, requester_id, receiver_id FROM friend_request WHERE (requester_id = $1 AND receiver_id = $2) OR (requester_id = $2 AND receiver_id = $1) LIMIT 1`,
      [userId, profileId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  sendFriendRequest,
  getFriendRequest,
  getFriendShip,
  cancelfriendRequest,
  acceptfriendRequest,
};
