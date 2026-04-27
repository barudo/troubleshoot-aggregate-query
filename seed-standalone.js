#!/usr/bin/env node

/**
 * Standalone MongoDB Seed Script
 *
 * Usage:
 * node seed-standalone.js
 *
 * Requires MongoDB to be running locally on port 27017
 * Adjust MONGODB_URI if your database is at a different location
 */

const { MongoClient, ObjectId } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "poms";
const COLLECTION_NAME = "subscribers";

const testSubscriber = {
  _id: new ObjectId("6245ada248968bf20c9296f0"),
  name: "Test Subscriber",
  email: "test@example.com",
  inventory: [
    {
      type: "Component",
      vendorItemNumber: "VEN-001",
      ourItemNumber: "OUR-001",
      description: "Resistor 10k Ohm 1/4W",
      unitOfMeasure: "piece",
      cost: 0.15,
      created: new Date("2022-04-01"),
      isActive: true,
    },
    {
      type: "Component",
      vendorItemNumber: "VEN-002",
      ourItemNumber: "OUR-002",
      description: "Capacitor 100uF 25V",
      unitOfMeasure: "piece",
      cost: 0.45,
      created: new Date("2022-04-02"),
      isActive: true,
    },
    {
      type: "Component",
      vendorItemNumber: "VEN-003",
      ourItemNumber: "OUR-003",
      description: "LED Red 5mm",
      unitOfMeasure: "piece",
      cost: 0.25,
      created: new Date("2022-04-03"),
      isActive: true,
    },
    {
      type: "Module",
      vendorItemNumber: "VEN-004",
      ourItemNumber: "OUR-004",
      description: "Arduino Nano Board",
      unitOfMeasure: "unit",
      cost: 12.5,
      created: new Date("2022-04-04"),
      isActive: true,
    },
    {
      type: "Component",
      vendorItemNumber: "VEN-005",
      ourItemNumber: "OUR-005",
      description: "Breadboard 830 Points",
      unitOfMeasure: "unit",
      cost: 5.99,
      created: new Date("2022-04-05"),
      isActive: false,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✓ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing data
    try {
      const deleteResult = await collection.deleteMany({});
      console.log(
        `✓ Deleted ${deleteResult.deletedCount} existing subscribers`,
      );
    } catch (deleteErr) {
      if (deleteErr.message.includes("authentication")) {
        console.log(
          "⚠ Authentication required for delete. Skipping delete operation.",
        );
      } else {
        throw deleteErr;
      }
    }

    // Insert test data
    const insertResult = await collection.insertOne(testSubscriber);
    console.log(
      `✓ Inserted test subscriber with ID: ${insertResult.insertedId}`,
    );

    // Verify the data was inserted
    const subscriber = await collection.findOne({
      _id: new ObjectId("6245ada248968bf20c9296f0"),
    });

    if (subscriber) {
      console.log("\n✓ Verification successful - Subscriber found");
      console.log(`  Name: ${subscriber.name}`);
      console.log(`  Email: ${subscriber.email}`);
      console.log(`  Inventory Items: ${subscriber.inventory.length}`);
    }

    // Test the aggregate query
    console.log("\n✓ Testing aggregate query...");
    const aggregateResult = await collection
      .aggregate([
        { $match: { _id: new ObjectId("6245ada248968bf20c9296f0") } },
        { $project: { inventory: 1 } },
        { $unwind: { path: "$inventory" } },
        {
          $project: {
            type: "$inventory.type",
            vendorItemNumber: "$inventory.vendorItemNumber",
            ourItemNumber: "$inventory.ourItemNumber",
            description: "$inventory.description",
            unitOfMeasure: "$inventory.unitOfMeasure",
            cost: "$inventory.cost",
            created: "$inventory.created",
            isActive: "$inventory.isActive",
          },
        },
      ])
      .toArray();

    console.log(`  Returned ${aggregateResult.length} inventory items`);
    console.log("\n  Sample item:");
    console.log(`    ${JSON.stringify(aggregateResult[0], null, 4)}`);

    console.log("\n✅ Database seeded successfully!");
    console.log(
      "   You can now test the route with subscriber ID: 6245ada248968bf20c9296f0\n",
    );
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
