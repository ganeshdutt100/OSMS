// src/models/StockItem.js
const mongoose = require("mongoose");

const StockItemSchema = new mongoose.Schema(
  {
    item_id: {
      type: String,
      required: true,
      unique: true,
      maxLength: 10, // <-- Spelling Fixed: L bada kar diya
      trim: true,
      uppercase: true,
    },
    item_name: {
      type: String,
      required: true,
      maxLength: 100, // <-- Fixed & Increased to 100
      trim: true,
    },
    category: {
      type: String,
      maxLength: 50, // <-- Fixed
      default: "General",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    uo_m: {
      type: String,
      maxLength: 20, // <-- Fixed
      default: "pcs",
      trim: true,
    },
    reorder_level: {
      type: Number,
      default: 0,
      min: 0,
    },
    available_qty: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DISCONTINUED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockItem", StockItemSchema);
