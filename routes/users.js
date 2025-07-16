const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  searchUser,
} = require("../controllers/usersController");
const authenticateUser = require("../middleware/authMiddleware");

router.get("/", authenticateUser, getUsers);
router.get("/search", authenticateUser, searchUser);
router.get("/:userId", authenticateUser, getUser);
router.post("/", createUser);

module.exports = router;
