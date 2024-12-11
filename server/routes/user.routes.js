const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../config/auth.middleware");

router.get("/:id", userController.getProfile);
router.put("/", authMiddleware, userController.updateProfile);
router.post("/follow/:id", authMiddleware, userController.follow);
router.post("/bookmark/:imdbID", authMiddleware, userController.bookmark);

module.exports = router;
