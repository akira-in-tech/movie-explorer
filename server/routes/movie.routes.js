const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");

router.get("/search", movieController.search);
router.get("/:imdbID", movieController.getDetails);

module.exports = router;
