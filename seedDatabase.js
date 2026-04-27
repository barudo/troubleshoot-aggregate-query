const mongoose = require("mongoose");

// Connection string - adjust if needed
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/poms";

// Define the Subscriber schema
const subscriberSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true },
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// Test data
const testData = {
  _id: mongoose.Types.ObjectId("6245ada248968bf20c9296f0"),
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
};

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing data
    await Subscriber.deleteMany({});
    console.log("Cleared existing subscribers");

    // Insert test data
    const result = await Subscriber.insertOne(testData);
    console.log("Test subscriber created:", result.insertedId);

    // Verify the data
    const savedSubscriber = await Subscriber.findById(
      "6245ada248968bf20c9296f0",
    );
    console.log("\nVerification - Subscriber found:");
    console.log(JSON.stringify(savedSubscriber, null, 2));

    console.log("\n✅ Database seeded successfully!");
    console.log(
      "You can now test the inventory route with subscriber ID: 6245ada248968bf20c9296f0",
    );
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

seedDatabase();
