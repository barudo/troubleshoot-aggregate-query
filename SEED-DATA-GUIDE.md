# MongoDB Test Data Setup Guide

This guide explains how to seed MongoDB with test data to verify the fixed aggregate query route works correctly.

## Quick Start

Choose one of the following methods based on your setup:

### Option 1: Using MongoDB Compass or mongosh (Easiest)

1. Open MongoDB Compass or mongosh shell
2. Copy the entire contents of `seed-data.mongodb`
3. Paste into MongoDB Compass or your shell
4. Execute

**Expected Result:** 5 inventory items will be inserted for subscriber ID `6245ada248968bf20c9296f0`

---

### Option 2: Using Node.js (Recommended)

**Prerequisites:**
- Node.js installed
- MongoDB running locally on `mongodb://localhost:27017`
- `mongodb` npm package installed: `npm install mongodb`

**Run:**
```bash
node seed-standalone.js
```

**Output:**
```
✓ Connected to MongoDB
✓ Deleted 0 existing subscribers
✓ Inserted test subscriber with ID: 6245ada248968bf20c9296f0
✓ Verification successful - Subscriber found
  Name: Test Subscriber
  Email: test@example.com
  Inventory Items: 5
✓ Testing aggregate query...
  Returned 5 inventory items
✅ Database seeded successfully!
```

---

### Option 3: Using Mongoose (if your project uses it)

**Prerequisites:**
- Your Node.js/Express server running
- Mongoose installed and configured
- SubscriberModel defined in `../models/SubscriberModel`

**Run:**
```bash
node seedDatabase.js
```

---

## Test Data Created

The seed scripts create a subscriber with:
- **ID:** `6245ada248968bf20c9296f0`
- **Name:** Test Subscriber
- **Email:** test@example.com
- **Inventory Items:** 5 items

### Inventory Items:

| Type | Vendor Item # | Our Item # | Description | UoM | Cost | Active |
|------|---------------|-----------|-------------|-----|------|--------|
| Component | VEN-001 | OUR-001 | Resistor 10k Ohm 1/4W | piece | 0.15 | ✓ |
| Component | VEN-002 | OUR-002 | Capacitor 100uF 25V | piece | 0.45 | ✓ |
| Component | VEN-003 | OUR-003 | LED Red 5mm | piece | 0.25 | ✓ |
| Module | VEN-004 | OUR-004 | Arduino Nano Board | unit | 12.50 | ✓ |
| Component | VEN-005 | OUR-005 | Breadboard 830 Points | unit | 5.99 | ✗ |

---

## Verify the Aggregate Query Works

### In MongoDB Shell:

```javascript
db.subscribers.aggregate([
  { $match: { _id: ObjectId("6245ada248968bf20c9296f0") } },
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
      isActive: "$inventory.isActive"
    }
  }
])
```

**Expected:** 5 documents returned with all required fields

### In Your Express App:

```bash
curl http://localhost:3000/inventory/6245ada248968bf20c9296f0
```

Should render the inventory template with 5 items.

---

## Database Connection String

If MongoDB is not running on `mongodb://localhost:27017`, set the environment variable:

```bash
export MONGODB_URI="mongodb://user:password@host:port/database"
node seed-standalone.js
```

Or in `seedDatabase.js`, modify:
```javascript
const MONGODB_URI = 'your-connection-string';
```

---

## Clean Up Test Data

To remove the test subscriber:

```javascript
// In mongosh or MongoDB Compass
db.subscribers.deleteOne({ _id: ObjectId("6245ada248968bf20c9296f0") })
```

Or delete all subscribers:
```javascript
db.subscribers.deleteMany({})
```
