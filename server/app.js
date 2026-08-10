const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const reviewRoutes = require("./routes/review.routes");
const featuredRoutes = require("./routes/featured.routes");
const movieRoutes = require("./routes/movie.routes");

function createCorsOptions(allowedOrigins) {
  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      const error = new Error("Origin is not allowed by CORS");
      error.status = 403;
      return callback(error);
    },
  };
}

function createApp({
  allowedOrigins = [],
  nodeEnv = process.env.NODE_ENV || "development",
  dbReadyState = () => mongoose.connection.readyState,
} = {}) {
  const app = express();

  app.disable("x-powered-by");
  if (nodeEnv === "production") app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "img-src": ["'self'", "data:", "https:"],
        },
      },
    })
  );
  if (allowedOrigins.length) app.use(cors(createCorsOptions(allowedOrigins)));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", (req, res) => {
    const databaseConnected = dbReadyState() === 1;
    res.status(databaseConnected ? 200 : 503).json({
      status: databaseConnected ? "ok" : "unavailable",
      database: databaseConnected ? "connected" : "disconnected",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/featured", featuredRoutes);
  app.use("/api/movies", movieRoutes);

  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  const clientDist = path.join(__dirname, "../client/dist");
  const clientIndex = path.join(clientDist, "index.html");
  if (fs.existsSync(clientIndex)) {
    app.use(express.static(clientDist));
    app.get("*", (req, res) => res.sendFile(clientIndex));
  }

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((err, req, res, next) => {
    console.error(err);

    if (err.code === 11000) {
      return res.status(409).json({ error: "Username or email is already in use" });
    }
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const status = err.status || 500;
    const message =
      status < 500 || nodeEnv !== "production"
        ? err.message || "Server error"
        : "Server error";
    return res.status(status).json({ error: message });
  });

  return app;
}

module.exports = { createApp, createCorsOptions };
