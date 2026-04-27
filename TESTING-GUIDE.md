# Testing inventoryRoute.js

There are several ways to test the `inventoryRoute.js` file. Choose the approach that works best for your workflow.

---

## Method 1: Using the Test Server (Easiest - No Setup Required)

Use the provided `test-server.js` to run a minimal Express server and test via HTTP requests.

### Start the server:
```bash
npm install express mongoose
node test-server.js
```

**Output:**
```
✓ Connected to MongoDB
✅ Server running on http://localhost:3000

📝 Test the inventory route:
   curl http://localhost:3000/inventory/6245ada248968bf20c9296f0

Press Ctrl+C to stop
```

### Test with curl:
```bash
curl http://localhost:3000/inventory/6245ada248968bf20c9296f0
```

### Test with browser:
Simply visit: `http://localhost:3000/inventory/6245ada248968bf20c9296f0`

### Expected Response:
```html
<!-- Renders inventory view with 5 items -->
<!-- The actual HTML output depends on your template -->
```

---

## Method 2: Using Postman or Thunder Client

If you prefer a visual tool:

1. **Start the test server** (see Method 1)
2. **Create a new request in Postman/Thunder Client:**
   - **Method:** GET
   - **URL:** `http://localhost:3000/inventory/6245ada248968bf20c9296f0`
   - **Click Send**

**Expected Response:** 200 OK with rendered inventory template

---

## Method 3: Unit Testing with Jest (Best for CI/CD)

Use the provided `inventoryRoute.test.js` for automated testing.

### Install dependencies:
```bash
npm install --save-dev jest supertest mongoose express
```

### Update package.json:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### Run tests:
```bash
npm test
```

### Run with verbose output:
```bash
npm test -- --verbose
```

### Test coverage:
```bash
npm test -- --coverage
```

---

## Method 4: Manual Testing Script

Create a standalone test script that doesn't need Express:

```bash
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/poms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const subscriberSchema = new mongoose.Schema({
    inventory: [Object]
  });
  const Subscriber = mongoose.model('Subscriber', subscriberSchema);
  
  const result = await Subscriber.aggregate([
    { \$match: { _id: mongoose.Types.ObjectId('6245ada248968bf20c9296f0') } },
    { \$project: { inventory: 1 } },
    { \$unwind: { path: '\$inventory' } },
    { 
      \$project: {
        type: '\$inventory.type',
        vendorItemNumber: '\$inventory.vendorItemNumber',
        ourItemNumber: '\$inventory.ourItemNumber',
        description: '\$inventory.description',
        unitOfMeasure: '\$inventory.unitOfMeasure',
        cost: '\$inventory.cost',
        created: '\$inventory.created',
        isActive: '\$inventory.isActive'
      }
    }
  ]);
  
  console.log('Returned items:', result.length);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
"
```

---

## What to Verify

Regardless of which testing method you use, verify these criteria:

✅ **Returns 5 inventory items**
```
Items returned: 5
```

✅ **Includes all required fields:**
- `type` → "Component" or "Module"
- `vendorItemNumber` → "VEN-001", etc.
- `ourItemNumber` → "OUR-001", etc.
- `description` → Item description
- `unitOfMeasure` → "piece", "unit", etc.
- `cost` → Numeric value
- `created` → Date string
- `isActive` → Boolean

✅ **No errors in console:**
```
Error fetching inventory: (should not see this)
Exception in inventory route: (should not see this)
```

✅ **HTTP Status 200 OK** (when using server)

---

## Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
npm install express mongoose
```

### Issue: "MongoDB connection failed"
**Solution:** Ensure MongoDB is running:
```bash
docker ps | grep mongodb
```

### Issue: "No inventory items returned"
**Solution:** Ensure test data is seeded:
```bash
node seed-standalone.js
```

### Issue: Route returns 500 error
**Solution:** Check server console for error details. Common issues:
- MongoDB not running
- Wrong subscriber ID
- SubscriberModel path incorrect

---

## Quick Start (Recommended)

**Test immediately with no setup:**
```bash
# Terminal 1: Start the server
node test-server.js

# Terminal 2: Test with curl
curl http://localhost:3000/inventory/6245ada248968bf20c9296f0
```

**Or test in your browser:**
```
http://localhost:3000/inventory/6245ada248968bf20c9296f0
```

That's it! You should see the rendered inventory page with 5 items.
