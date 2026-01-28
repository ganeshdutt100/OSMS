// src/models/Request.js
const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    request_id: {
      type: String,
      required: true,
      unique: true,
      maxLength: 25, // <-- CHANGE 1: Increased from 10 to 25 (REQ-Timestamp ke liye)
    },
    dept_id: {
      type: String,
      ref: "Department",
      maxLength: 10,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId, // <-- CHANGE 2: String hata kar ObjectId kiya
          ref: "StockItem", // <-- Added Reference (Isse hi populate kaam karega)
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        quantity_issued: {
          type: Number,
          default: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
