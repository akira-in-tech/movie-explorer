const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") }); // Must be before requiring db
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("./config/db"); // now environment variables are loaded before db connection

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const reviewRoutes = require("./routes/review.routes");
const featuredRoutes = require("./routes/featured.routes");
const movieRoutes = require("./routes/movie.routes");

const app = express();

const PORT = process.env.PORT || 5500;
app.use(cors({ origin: process.env.NETLIFY_URL || "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/featured", featuredRoutes);
app.use("/api/movies", movieRoutes);

// centralized error handler — catches errors passed via next(err) from asyncHandler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
