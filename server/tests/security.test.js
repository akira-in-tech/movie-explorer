const test = require("node:test");
const assert = require("node:assert/strict");
const {
  getCookieOptions,
} = require("../controllers/auth.controller");
const { createCorsOptions } = require("../app");
const { isValidEmail } = require("../utils/validation");

test("production auth cookies use secure browser protections", () => {
  assert.deepEqual(getCookieOptions({ NODE_ENV: "production" }), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
});

test("email validation accepts normal addresses and rejects malformed input", () => {
  assert.equal(isValidEmail("akira@example.com"), true);
  assert.equal(isValidEmail("not-an-email"), false);
});

test("CORS accepts configured origins and rejects unknown origins", async () => {
  const options = createCorsOptions(["https://movies.example.com"]);

  await new Promise((resolve, reject) => {
    options.origin("https://movies.example.com", (error, allowed) => {
      try {
        assert.ifError(error);
        assert.equal(allowed, true);
        resolve();
      } catch (assertionError) {
        reject(assertionError);
      }
    });
  });

  await new Promise((resolve, reject) => {
    options.origin("https://evil.example", (error) => {
      try {
        assert.equal(error.status, 403);
        resolve();
      } catch (assertionError) {
        reject(assertionError);
      }
    });
  });
});
