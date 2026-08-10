const Review = require("../models/review.model");
const asyncHandler = require("../utils/asyncHandler");

module.exports.createReview = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { movieId, text, rating } = req.body;
  if (!movieId || !text) {
    return res.status(400).json({ error: "movieId and text are required" });
  }
  const review = await Review.create({ movieId, userId, text, rating });
  res.json(review);
});

module.exports.getReviews = asyncHandler(async (req, res) => {
  const { movieId } = req.query;
  let filter = {};
  if (movieId) filter.movieId = movieId;
  const reviews = await Review.find(filter).populate("userId", "username");
  res.json(reviews);
});
