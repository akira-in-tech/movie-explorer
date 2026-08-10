const axios = require("axios");
const OMDB_URL = "https://www.omdbapi.com/";

async function requestOmdb(params) {
  const resp = await axios.get(OMDB_URL, {
    params: { ...params, apikey: process.env.OMDB_API_KEY },
    timeout: 8000,
  });
  return resp.data;
}

module.exports.searchMovies = async (criteria) => {
  const data = await requestOmdb({ s: criteria });
  if (data.Response === "False") return [];
  return data.Search || [];
};

module.exports.getMovieDetails = async (imdbID) => {
  const data = await requestOmdb({ i: imdbID });
  if (data.Response === "False") {
    const error = new Error(data.Error || "Movie not found");
    error.status = /not found/i.test(data.Error || "") ? 404 : 502;
    throw error;
  }
  return data;
};
