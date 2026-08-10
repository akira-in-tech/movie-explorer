const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "MONGO_CONNECTION_STRING",
  "OMDB_API_KEY",
];

function parsePort(value) {
  const port = Number(value || 5500);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  return port;
}

function validateEnv(env = process.env) {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => typeof env[key] !== "string" || env[key].trim() === ""
  );

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }

  return {
    nodeEnv: env.NODE_ENV || "development",
    port: parsePort(env.PORT),
    mongoUri: env.MONGO_CONNECTION_STRING,
    allowedOrigins: (env.FRONTEND_URL || env.NETLIFY_URL || "")
      .split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter(Boolean),
  };
}

module.exports = { parsePort, validateEnv };
