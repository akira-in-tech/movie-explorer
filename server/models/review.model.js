const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      required: true,
      match: /^tt\d{7,10}$/,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, required: true, min: 0, max: 10 },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "reviews" }
);

ReviewSchema.index({ movieId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", ReviewSchema);
