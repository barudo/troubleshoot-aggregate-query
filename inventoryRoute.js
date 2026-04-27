const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Subscriber = require("./models/SubscriberModel");

router.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json({
      title: "POMS Subscribers",
      subscribers: subscribers,
    });
  } catch (err) {
    console.error("Error fetching subscribers:", err);
    res.status(500).json({
      message: "Error fetching subscribers",
      error: err.message,
    });
  }
});

router.get("/inventory/6245ada248968bf20c9296f0", async (req, res) => {
  try {
    let id = new mongoose.Types.ObjectId("6245ada248968bf20c9296f0");
    const inventory = await Subscriber.aggregate()
      .match({ _id: { $eq: id } })
      .project({
        inventory: 1,
      })
      .unwind({ path: "$inventory" }) // FIX: Added $ prefix to reference the field
      .project({
        type: "$inventory.type",
        vendorItemNumber: "$inventory.vendorItemNumber",
        ourItemNumber: "$inventory.ourItemNumber",
        description: "$inventory.description",
        unitOfMeasure: "$inventory.unitOfMeasure",
        cost: "$inventory.cost",
        created: "$inventory.created",
        isActive: "$inventory.isActive",
      });

    if (!inventory || inventory.length === 0) {
      console.log("No inventory found for subscriber");
      return res.status(404).json({
        message: "No inventory found",
      });
    }

    console.log("Inventory items retrieved:", inventory.length);
    res.json({
      title: "Inventory",
      inventory: inventory,
    });
  } catch (err) {
    console.error("Exception in inventory route:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
