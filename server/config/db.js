const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGO_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/movie-explorer";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
