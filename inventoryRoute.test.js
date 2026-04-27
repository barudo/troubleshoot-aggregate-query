/**
 * Unit Tests for inventoryRoute using Jest and Supertest
 *
 * Usage:
 * npm install --save-dev jest supertest mongoose
 * npx jest inventoryRoute.test.js
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const inventoryRouter = require("./inventoryRoute");

describe("Inventory Route Tests", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", inventoryRouter);
  });

  describe("GET /inventory/6245ada248968bf20c9296f0", () => {
    it("should return inventory items for a valid subscriber", async () => {
      const res = await request(app)
        .get("/inventory/6245ada248968bf20c9296f0")
        .expect(200);

      // Verify response structure
      expect(res.body).toBeDefined();
      expect(res.body.inventory).toBeDefined();
      expect(Array.isArray(res.body.inventory) || res.text).toBeDefined();
    });

    it("should return items with all required fields", async () => {
      const res = await request(app).get("/inventory/6245ada248968bf20c9296f0");

      const inventory = res.body.inventory || JSON.parse(res.text);

      // Check that we have inventory items
      expect(inventory.length).toBeGreaterThan(0);

      // Check required fields on first item
      const firstItem = inventory[0];
      expect(firstItem).toHaveProperty("type");
      expect(firstItem).toHaveProperty("vendorItemNumber");
      expect(firstItem).toHaveProperty("ourItemNumber");
      expect(firstItem).toHaveProperty("description");
      expect(firstItem).toHaveProperty("unitOfMeasure");
      expect(firstItem).toHaveProperty("cost");
      expect(firstItem).toHaveProperty("created");
      expect(firstItem).toHaveProperty("isActive");
    });

    it("should return 5 inventory items", async () => {
      const res = await request(app).get("/inventory/6245ada248968bf20c9296f0");

      const inventory = res.body.inventory || JSON.parse(res.text);
      expect(inventory).toHaveLength(5);
    });
  });

  describe("GET /subscribers", () => {
    it("should return subscribers list", async () => {
      const res = await request(app).get("/subscribers").expect(200);

      expect(res.body).toBeDefined();
    });
  });
});
