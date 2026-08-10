const omdbService = require("../services/omdb.service");
const asyncHandler = require("../utils/asyncHandler");

module.exports.search = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.status(400).json({ error: "Query parameter q is required" });
  if (q.length > 100) {
    return res.status(400).json({ error: "Search query is too long" });
  }
  const results = await omdbService.searchMovies(q);
  res.json({ results });
});

module.exports.getDetails = asyncHandler(async (req, res) => {
  const { imdbID } = req.params;
  if (!/^tt\d{7,10}$/.test(imdbID)) {
    return res.status(400).json({ error: "Invalid IMDb ID" });
  }
  const movie = await omdbService.getMovieDetails(imdbID);
  res.json(movie);
});
