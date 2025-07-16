const pool = require("../db");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [userName, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchUser = async (req, res) => {
  const { userName } = req.query;
  if (!userName) {
    return res.status(400).json({ error: "Missing query parameter" });
  }
  try {
    const result = await pool.query(
      "SELECT id, username FROM users WHERE username ILIKE $1",
      [`${userName}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getUsers, createUser, getUser, searchUser };
