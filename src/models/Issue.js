// src/models/Issue.js
const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema(
  {
    issue_id: { type: String, required: true, unique: true, maxlength: 10 }, // synopsis: VARCHAR(10)
    request_id: { type: String, ref: 'Request', required: true, maxlength: 10 },
    issue_date: { type: Date, default: Date.now },
    issued_by: { type: String, ref: 'User', required: true, maxlength: 10 }, // GA staff ID
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, default: '' },
    comments: { type: String, maxlength: 100, default: '' },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], default: 'OPEN' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', IssueSchema);