const Review = require("../models/review.model");

module.exports.createReview = async (req, res) => {
  const userId = req.user.userId;
  const { movieId, text, rating } = req.body;
  const review = await Review.create({ movieId, userId, text, rating });
  res.json(review);
};

module.exports.getReviews = async (req, res) => {
  const { movieId } = req.query;
  let filter = {};
  if (movieId) filter.movieId = movieId;
  const reviews = await Review.find(filter).populate("userId", "username");
  res.json(reviews);
};
