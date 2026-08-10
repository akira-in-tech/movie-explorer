const omdbService = require("../services/omdb.service");
const asyncHandler = require("../utils/asyncHandler");

module.exports.search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter q is required" });
  const results = await omdbService.searchMovies(q);
  res.json({ results });
});

module.exports.getDetails = asyncHandler(async (req, res) => {
  const { imdbID } = req.params;
  const movie = await omdbService.getMovieDetails(imdbID);
  res.json(movie);
});
