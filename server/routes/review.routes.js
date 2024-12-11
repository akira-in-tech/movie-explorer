const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../config/auth.middleware");

router.post("/", authMiddleware, reviewController.createReview);
router.get("/", reviewController.getReviews);

module.exports = router;
