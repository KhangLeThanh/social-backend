const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      userName,
    ]);

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        userName: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 10 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ message: "Login successful", userId: user.id });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  loginUser,
};
