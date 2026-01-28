// src/controllers/gaController.js
const Request = require("../models/Request");
const StockItem = require("../models/StockItem");
const Issue = require("../models/Issue");

// Requests
exports.listRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("items.item_id")
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    console.error("List requests error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    request.status = "APPROVED";
    await request.save();
    res.json({ message: "Request approved", request });
  } catch (err) {
    console.error("Approve request error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    request.status = "REJECTED";
    await request.save();
    res.json({ message: "Request rejected", request });
  } catch (err) {
    console.error("Reject request error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Stock
exports.listStock = async (req, res) => {
  try {
    const stock = await StockItem.find().sort({ item_name: 1 });
    res.json({ stock });
  } catch (err) {
    console.error("List stock error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addStockItem = async (req, res) => {
  try {
    const {
      item_id,
      item_name,
      category,
      description,
      uo_m,
      reorder_level,
      available_qty,
    } = req.body;

    if (!item_id || !item_name) {
      return res
        .status(400)
        .json({ error: "Item ID and Item Name are required" });
    }

    const existing = await StockItem.findOne({ item_id });
    if (existing)
      return res.status(400).json({ error: "Item ID already exists" });

    const item = await StockItem.create({
      item_id,
      item_name,
      category,
      description,
      uo_m,
      reorder_level,
      available_qty,
    });

    res.json({ message: "Stock item added", item });
  } catch (err) {
    console.error("Add stock error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateStockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const item = await StockItem.findByIdAndUpdate(id, update, { new: true });
    if (!item) return res.status(404).json({ error: "Stock item not found" });
    res.json({ message: "Stock item updated", item });
  } catch (err) {
    console.error("Update stock error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Issues (UPDATED PART)
exports.listIssues = async (req, res) => {
  try {
    // Populate lagaya taaki IDs ki jagah naam dikhein
    const issues = await Issue.find()
      .populate("request_id") // Request details
      .populate("issued_by", "name email") // User details
      .sort({ createdAt: -1 });
    res.json({ issues });
  } catch (err) {
    console.error("List issues error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { title, description, request_id } = req.body;
    if (!title || !request_id) {
      return res
        .status(400)
        .json({ error: "Title and Request ID are required" });
    }

    const issue = await Issue.create({
      issue_id: `ISS-${Date.now()}`,
      request_id,
      // IMPORTANT: Session se user ki _id lo taaki populate kaam kare
      issued_by: req.session.user.id || req.session.user._id,
      title,
      description,
    });

    res.json({ message: "Issue created", issue });
  } catch (err) {
    console.error("Create issue error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Reports
exports.generateReports = async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: "PENDING" });
    const approved = await Request.countDocuments({ status: "APPROVED" });
    const rejected = await Request.countDocuments({ status: "REJECTED" });
    const issued = await Request.countDocuments({ status: "ISSUED" });
    const stockCount = await StockItem.countDocuments();
    const issuesCount = await Issue.countDocuments();

    res.json({
      summary: {
        totalRequests,
        pending,
        approved,
        rejected,
        issued,
        stockCount,
        issuesCount,
      },
    });
  } catch (err) {
    console.error("Generate reports error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
