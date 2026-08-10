const Featured = require("../models/featured.model");
const asyncHandler = require("../utils/asyncHandler");

async function getSingleton() {
  let doc = await Featured.findOne();
  if (!doc) doc = await Featured.create({});
  return doc;
}

module.exports.getFeatured = asyncHandler(async (req, res) => {
  const doc = await getSingleton();
  res.json({ featuredMovie: doc.imdbID });
});

module.exports.setFeatured = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });
  const { imdbID } = req.body;
  const doc = await getSingleton();
  doc.imdbID = imdbID;
  await doc.save();
  res.json({ featuredMovie: doc.imdbID });
});
