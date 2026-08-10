const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");

module.exports.getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  // Hide sensitive info if not same user
  if (!req.user || req.user.userId.toString() !== id) {
    user.email = undefined;
  }
  res.json(user);
});

module.exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { bio, email } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.bio = bio || user.bio;
  user.email = email || user.email;
  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;
  res.json(safeUser);
});

module.exports.follow = asyncHandler(async (req, res) => {
  const { id } = req.params; // the user to follow
  const userId = req.user.userId;
  if (id === userId.toString()) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }
  const user = await User.findById(userId);
  const target = await User.findById(id);
  if (!target)
    return res.status(404).json({ error: "User to follow not found" });
  if (!user.following.includes(id)) {
    user.following.push(id);
    await user.save();
  }
  if (!target.followers.includes(userId)) {
    target.followers.push(userId);
    await target.save();
  }
  res.json({ message: "Followed" });
});

module.exports.bookmark = asyncHandler(async (req, res) => {
  const { imdbID } = req.params;
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!user.bookmarks.includes(imdbID)) {
    user.bookmarks.push(imdbID);
    await user.save();
  }
  res.json({ message: "Bookmarked" });
});
