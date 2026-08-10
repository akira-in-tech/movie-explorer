const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Review = require("../models/review.model");
const User = require("../models/user.model");

test("review validates IMDb ID and rating boundaries without a database", async () => {
  const review = new Review({
    movieId: "invalid",
    userId: new mongoose.Types.ObjectId(),
    text: "A thoughtful review",
    rating: 11,
  });

  await assert.rejects(review.validate(), (error) => {
    assert.ok(error.errors.movieId);
    assert.ok(error.errors.rating);
    return true;
  });
});

test("user validation trims and normalizes profile data", async () => {
  const user = new User({
    username: "  akira_user  ",
    password: "hashed-password",
    email: "  AKIRA@EXAMPLE.COM  ",
    bio: "  Movie fan  ",
  });

  await user.validate();
  assert.equal(user.username, "akira_user");
  assert.equal(user.email, "akira@example.com");
  assert.equal(user.bio, "Movie fan");
});
