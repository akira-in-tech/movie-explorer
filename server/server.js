const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { createApp } = require("./app");
const { connectDB, disconnectDB } = require("./config/db");
const { validateEnv } = require("./config/env");

async function startServer() {
  const config = validateEnv();
  await connectDB(config.mongoUri);

  const app = createApp(config);
  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received; shutting down`);

    server.close(async () => {
      try {
        await disconnectDB();
        process.exit(0);
      } catch (error) {
        console.error("Graceful shutdown failed", error);
        process.exit(1);
      }
    });

    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Server failed to start", error);
    process.exit(1);
  });
}

module.exports = { startServer };
