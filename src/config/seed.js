const mongoose = require("mongoose");
const StockItem = require("../models/StockItem");
const path = require("path");
// Dotenv ko explicitly root folder se load karte hain taaki galti na ho
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

async function seed() {
  // CHANGE: Variable name match kiya (.env wala MONGODB_URI)
  const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/osms5";

  console.log(`🔌 Attempting to connect to: ${dbURI}`);

  await mongoose
    .connect(dbURI)
    .then(() => console.log("✅ Seed Script: DB Connected"))
    .catch((err) => {
      console.error("❌ Connection Error:", err);
      process.exit(1);
    });

  const items = [
    {
      item_id: "101",
      item_name: "A4 File Folder",
      category: "Stationery",
      available_qty: 100,
      uo_m: "pcs",
      status: "ACTIVE",
    },
    {
      item_id: "FILE1",
      item_name: "Office File",
      category: "Stationery",
      available_qty: 200,
      uo_m: "pcs",
      status: "ACTIVE",
    },
    {
      item_id: "COMP1",
      item_name: "Desktop Computer",
      category: "Electronics",
      available_qty: 10,
      uo_m: "units",
      status: "ACTIVE",
    },
    {
      item_id: "PRNT1",
      item_name: "Laser Printer",
      category: "Electronics",
      available_qty: 5,
      uo_m: "units",
      status: "ACTIVE",
    },
    {
      item_id: "PEN01",
      item_name: "Ball Point Pen (Blue)",
      category: "Stationery",
      available_qty: 500,
      uo_m: "pcs",
      status: "ACTIVE",
    },
    {
      item_id: "PAPR1",
      item_name: "A4 Paper Ream",
      category: "Stationery",
      available_qty: 1000,
      uo_m: "ream",
      status: "ACTIVE",
    },
  ];

  try {
    // Clear old data
    await StockItem.deleteMany({});
    console.log("🧹 Old data cleared...");

    // Insert new data
    const savedItems = await StockItem.insertMany(items);
    console.log(`🌱 Seeded ${savedItems.length} items successfully!`);

    // Verify: Abhi kya IDs save hui hain print karo
    const allIds = savedItems.map((i) => i.item_id);
    console.log("📋 Verified IDs in DB:", allIds);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected");
  }
}

seed();
