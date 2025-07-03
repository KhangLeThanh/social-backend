const pool = require("../db");
const { getIO } = require("../socket");

const createMessage = async (req, res) => {
  const { content, userId, chatId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO messages (content, sender_id, chat_id) VALUES ($1, $2, $3) RETURNING *",
      [content, userId, chatId]
    );
    getIO().emit("message_status", result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessage = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await pool.query(
      'SELECT messages.id, messages.chat_id as "chatId", messages.sender_id as "senderId", messages.content, messages.created_at AS "createdAt", users.username FROM messages JOIN users ON messages.sender_id = users.id WHERE chat_id = $1 ORDER BY created_at ASC;',
      [chatId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getMessage, createMessage };
