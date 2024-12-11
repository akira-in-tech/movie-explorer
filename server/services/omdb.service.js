const axios = require("axios");
const OMDB_API_KEY = "a0f0fad7"; // Replace with a valid OMDB key

module.exports.searchMovies = async (criteria) => {
  const resp = await axios.get(
    `http://www.omdbapi.com/?s=${encodeURIComponent(
      criteria
    )}&apikey=${OMDB_API_KEY}`
  );
  return resp.data.Search || [];
};

module.exports.getMovieDetails = async (imdbID) => {
  const resp = await axios.get(
    `http://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`
  );
  return resp.data;
};
