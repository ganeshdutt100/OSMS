// src/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
      trim: true, // Extra spaces hata dega
    },
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      trim: true,
      lowercase: true, // Email hamesha small letters me save hoga
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "GA", "STAFF"], // Roles yahi rehne do
      required: true,
    },
    dept_id: {
      type: String,
      ref: "Department",
      maxlength: 4,
    },
    // YAHAN CHANGE KIYA HAI:
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"], // Ab ye 'ACTIVE' accept karega
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
