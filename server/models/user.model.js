const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
      match: /^[a-zA-Z0-9_-]+$/,
    },
    password: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    bio: { type: String, trim: true, maxlength: 500 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [String], // store imdbIDs
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", UserSchema);
