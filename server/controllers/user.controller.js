const User = require("../models/user.model");

module.exports.getProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  // Hide sensitive info if not same user
  if (!req.user || req.user.userId.toString() !== id) {
    user.email = undefined;
  }
  res.json(user);
};

module.exports.updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { bio, email } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.bio = bio || user.bio;
  user.email = email || user.email;
  await user.save();
  res.json(user);
};

module.exports.follow = async (req, res) => {
  const { id } = req.params; // the user to follow
  const userId = req.user.userId;
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
};

module.exports.bookmark = async (req, res) => {
  const { imdbID } = req.params;
  const user = await User.findById(req.user.userId);
  if (!user.bookmarks.includes(imdbID)) {
    user.bookmarks.push(imdbID);
    await user.save();
  }
  res.json({ message: "Bookmarked" });
};
