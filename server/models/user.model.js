const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    bio: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [String], // store imdbIDs
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", UserSchema);
