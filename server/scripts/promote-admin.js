const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/user.model");
const { connectDB, disconnectDB } = require("../config/db");
const { validateEnv } = require("../config/env");

async function promoteAdmin() {
  const username = process.argv[2]?.trim();
  if (!username) {
    throw new Error("Usage: npm run admin:promote -- <username>");
  }

  const config = validateEnv();
  await connectDB(config.mongoUri);
  const user = await User.findOneAndUpdate(
    { username },
    { role: "ADMIN" },
    { new: true }
  ).select("username role");

  if (!user) throw new Error(`User '${username}' was not found`);
  console.log(`Promoted ${user.username} to ${user.role}`);
}

promoteAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(disconnectDB);
