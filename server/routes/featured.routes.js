const express = require("express");
const router = express.Router();
const featuredController = require("../controllers/featured.controller");
const authMiddleware = require("../config/auth.middleware");

router.get("/", featuredController.getFeatured);
router.post("/", authMiddleware, featuredController.setFeatured);

module.exports = router;
