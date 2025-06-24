const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
} = require("../controllers/usersController");
const authenticateUser = require("../middleware/authMiddleware");

router.get("/", authenticateUser, getUsers);
router.get("/:userId", authenticateUser, getUser);
router.post("/", createUser);

module.exports = router;
