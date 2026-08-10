const test = require("node:test");
const assert = require("node:assert/strict");
const { parsePort, validateEnv } = require("../config/env");

const validEnv = {
  NODE_ENV: "production",
  PORT: "8080",
  JWT_SECRET: "a".repeat(48),
  MONGO_CONNECTION_STRING: "mongodb://127.0.0.1:27017/movie-explorer",
  OMDB_API_KEY: "test-key",
  FRONTEND_URL: "https://movies.example.com/, https://preview.example.com",
};

test("validateEnv normalizes deploy configuration", () => {
  assert.deepEqual(validateEnv(validEnv), {
    nodeEnv: "production",
    port: 8080,
    mongoUri: validEnv.MONGO_CONNECTION_STRING,
    allowedOrigins: [
      "https://movies.example.com",
      "https://preview.example.com",
    ],
  });
});

test("validateEnv rejects missing secrets", () => {
  assert.throws(
    () => validateEnv({ ...validEnv, OMDB_API_KEY: "" }),
    /OMDB_API_KEY/
  );
});

test("validateEnv rejects short JWT secrets", () => {
  assert.throws(
    () => validateEnv({ ...validEnv, JWT_SECRET: "short" }),
    /at least 32 characters/
  );
});

test("parsePort rejects invalid ports", () => {
  assert.throws(() => parsePort("70000"), /PORT/);
  assert.throws(() => parsePort("not-a-port"), /PORT/);
});
