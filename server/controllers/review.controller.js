const Review = require("../models/review.model");
const asyncHandler = require("../utils/asyncHandler");

module.exports.createReview = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const movieId = req.body.movieId?.trim();
  const text = req.body.text?.trim();
  const rating = Number(req.body.rating);
  if (!movieId || !text || req.body.rating === "" || req.body.rating == null) {
    return res.status(400).json({ error: "movieId, text and rating are required" });
  }
  if (!/^tt\d{7,10}$/.test(movieId)) {
    return res.status(400).json({ error: "Invalid IMDb ID" });
  }
  if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
    return res.status(400).json({ error: "Rating must be between 0 and 10" });
  }
  const review = await Review.create({ movieId, userId, text, rating });
  res.status(201).json(review);
});

module.exports.getReviews = asyncHandler(async (req, res) => {
  const { movieId } = req.query;
  let filter = {};
  if (movieId) filter.movieId = movieId;
  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("userId", "username");
  res.json(reviews);
});
