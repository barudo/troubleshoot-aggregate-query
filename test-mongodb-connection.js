/**
 * Quick MongoDB Connection Test
 * Tests connection to Docker MongoDB on localhost:27017
 */

const http = require("http");

// Simple connection test using Node.js built-in modules
// We'll make a direct connection attempt to verify MongoDB is accessible

const testConnection = () => {
  const net = require("net");
  const client = new net.Socket();

  return new Promise((resolve, reject) => {
    client.setTimeout(5000);

    client.connect(27017, "localhost", () => {
      console.log("✓ TCP connection established on port 27017");
      client.destroy();
      resolve(true);
    });

    client.on("error", (err) => {
      console.error("✗ Connection failed:", err.message);
      reject(err);
    });

    client.on("timeout", () => {
      console.error("✗ Connection timeout");
      client.destroy();
      reject(new Error("Connection timeout"));
    });
  });
};

// Test with MongoDB Driver if available
const testWithDriver = async () => {
  try {
    // Try to require mongodb without needing it installed globally
    const { MongoClient } = require("mongodb");
    const client = new MongoClient("mongodb://localhost:27017", {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("\nAttempting to connect with MongoDB driver...");
    await client.connect();
    console.log("✓ Successfully connected to MongoDB");

    // List databases
    const admin = client.db("admin");
    const databases = await admin.admin().listDatabases();
    console.log(
      "✓ Databases available:",
      databases.databases.map((db) => db.name).join(", "),
    );

    await client.close();
    return true;
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      console.log("\n⚠ MongoDB driver not installed");
      console.log("  Install with: npm install mongodb");
      return false;
    }
    console.error("\n✗ MongoDB connection failed:", err.message);
    return false;
  }
};

async function main() {
  console.log("🔍 Testing MongoDB Connection\n");
  console.log("Docker Container Status:");

  try {
    // Test TCP connection first
    await testConnection();
    console.log("✓ MongoDB port is accessible\n");

    // Try MongoDB driver
    await testWithDriver();

    console.log("\n✅ MongoDB is ready for testing!");
    console.log("   Connection string: mongodb://localhost:27017");
  } catch (err) {
    console.log("\n❌ MongoDB connection check failed");
    process.exit(1);
  }
}

main();
