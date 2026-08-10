const mongoose = require("mongoose");

// Single-document collection holding the current featured movie.
const FeaturedSchema = new mongoose.Schema(
  {
    imdbID: { type: String, default: null, match: /^tt\d{7,10}$/ },
  },
  { collection: "featured" }
);

module.exports = mongoose.model("Featured", FeaturedSchema);
