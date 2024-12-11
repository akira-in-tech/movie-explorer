const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "reviews" }
);

module.exports = mongoose.model("Review", ReviewSchema);
