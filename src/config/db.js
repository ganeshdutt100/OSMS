// src/config/db.js
const mongoose = require("mongoose");

async function connectDB() {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/office_supplies";

  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB (Office Supplies Management System)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  }
}

module.exports = connectDB;
