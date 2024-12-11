// Simple admin-only controller to manage a "featured" movie list in memory
let featuredMovie = null;

module.exports.getFeatured = (req, res) => {
  res.json({ featuredMovie });
};

module.exports.setFeatured = (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });
  const { imdbID } = req.body;
  featuredMovie = imdbID;
  res.json({ featuredMovie });
};
