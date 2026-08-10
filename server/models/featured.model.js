const mongoose = require("mongoose");

// Single-document collection holding the current featured movie.
const FeaturedSchema = new mongoose.Schema(
  {
    imdbID: { type: String, default: null },
  },
  { collection: "featured" }
);

module.exports = mongoose.model("Featured", FeaturedSchema);
