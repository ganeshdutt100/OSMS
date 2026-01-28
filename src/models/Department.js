// src/models/Department.js
const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    dept_id: {
      type: String,
      required: true,
      unique: true,
      maxlength: 4,
      trim: true,
    },
    dept_name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Explicitly set collection name to avoid casing issues
module.exports = mongoose.model('Department', DepartmentSchema, 'departments');