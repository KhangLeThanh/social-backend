const express = require("express");
const http = require("http");
const { initSocket } = require("./socket");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
initSocket(server);
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Import routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const logoutRoutes = require("./routes/logout");

// Mount routes BEFORE catch-all OPTIONS
app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
