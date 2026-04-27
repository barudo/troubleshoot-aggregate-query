/**
 * Minimal Express Test Server
 *
 * Start this server and it will respond to the inventory route
 *
 * Usage:
 * npm install express mongoose
 * node test-server.js
 *
 * Then test with:
 * curl http://localhost:3000/inventory/6245ada248968bf20c9296f0
 */

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// Simple Subscriber Schema (matching your model)
const subscriberSchema = new mongoose.Schema({
  name: String,
  email: String,
  inventory: [
    {
      type: String,
      vendorItemNumber: String,
      ourItemNumber: String,
      description: String,
      unitOfMeasure: String,
      cost: Number,
      created: Date,
      isActive: Boolean,
    },
  ],
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// Import the route
const inventoryRouter = require("./inventoryRoute");

// Middleware
app.use(express.json());

// Routes
app.use("/", inventoryRouter);

// Simple JSON response for testing
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Connect to MongoDB and start server
mongoose
  .connect("mongodb://localhost:27017/poms")
  .then(() => {
    console.log("✓ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`\n📝 Test the inventory route:`);
      console.log(
        `   curl http://localhost:${PORT}/inventory/6245ada248968bf20c9296f0`,
      );
      console.log(`\n📝 Health check:`);
      console.log(`   curl http://localhost:${PORT}/health`);
      console.log(`\nPress Ctrl+C to stop\n`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
