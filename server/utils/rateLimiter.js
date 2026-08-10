// Minimal in-memory fixed-window rate limiter (no extra dependency needed).
// Not suitable for a multi-process deployment, but enough to blunt brute-force
// attempts against auth endpoints in this single-process app.
const hits = new Map();

module.exports = function rateLimiter({ windowMs, max }) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { start: now, count: 1 });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({ error: "Too many requests, please try again later" });
    }
    next();
  };
};
