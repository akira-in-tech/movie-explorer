const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../app");

test("health check reports a connected database", async () => {
  const app = createApp({ dbReadyState: () => 1 });
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok", database: "connected" });
  assert.equal(response.headers["x-powered-by"], undefined);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
});

test("health check fails when the database is disconnected", async () => {
  const app = createApp({ dbReadyState: () => 0 });
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    status: "unavailable",
    database: "disconnected",
  });
});

test("unknown API routes return a JSON 404", async () => {
  const app = createApp({ dbReadyState: () => 1 });
  const response = await request(app).get("/api/not-a-route");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: "API route not found" });
});
