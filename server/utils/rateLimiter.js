// Minimal in-memory fixed-window rate limiter (no extra dependency needed).
// Not suitable for a multi-process deployment, but enough to blunt brute-force
// attempts against auth endpoints in this single-process app.
module.exports = function rateLimiter({ windowMs, max }) {
  const hits = new Map();
  let lastSweep = Date.now();

  return (req, res, next) => {
    const now = Date.now();
    if (now - lastSweep >= windowMs) {
      for (const [key, value] of hits) {
        if (now - value.start >= windowMs) hits.delete(key);
      }
      lastSweep = now;
    }

    const username = req.body?.username?.trim().toLowerCase() || "anonymous";
    const key = `${req.ip}:${username}`;
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
