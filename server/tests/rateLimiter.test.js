const test = require("node:test");
const assert = require("node:assert/strict");
const rateLimiter = require("../utils/rateLimiter");

function callLimiter(limiter, ip, username) {
  return new Promise((resolve) => {
    const req = { ip, body: { username } };
    const res = {
      statusCode: 200,
      payload: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.payload = payload;
        resolve(this);
      },
    };
    limiter(req, res, () => resolve(res));
  });
}

test("rate limiter isolates usernames and blocks excess attempts", async () => {
  const limiter = rateLimiter({ windowMs: 60000, max: 2 });

  assert.equal((await callLimiter(limiter, "127.0.0.1", "akira")).statusCode, 200);
  assert.equal((await callLimiter(limiter, "127.0.0.1", "akira")).statusCode, 200);
  assert.equal((await callLimiter(limiter, "127.0.0.1", "akira")).statusCode, 429);
  assert.equal((await callLimiter(limiter, "127.0.0.1", "another")).statusCode, 200);
});
