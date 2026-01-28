// src/controllers/departmentController.js
const Request = require("../models/Request");
const StockItem = require("../models/StockItem");

// Create a new request
exports.createRequest = async (req, res) => {
  try {
    console.log("--- Create Request Start ---"); // Debug Log
    const { items } = req.body; // [{ item_id, quantity }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items required" });
    }

    // Validate item_ids and build items array
    const stockItems = await Promise.all(
      items.map(async (it) => {
        // Clean the ID (Remove spaces)
        const searchId = it.item_id.toString().trim();

        console.log(`Searching for Item ID: "${searchId}"`); // Debug Log

        // Find item in DB
        const s = await StockItem.findOne({ item_id: searchId });

        if (!s) {
          console.error(`❌ Database mein ye ID nahi mili: "${searchId}"`);
          // Optional: Database me available IDs print karo debugging ke liye
          const allIds = await StockItem.find({}).select("item_id");
          console.log(
            "Available IDs inside DB:",
            allIds.map((i) => i.item_id)
          );

          throw new Error(`Invalid Item ID: ${it.item_id}`);
        }

        console.log(`✅ Item Found: ${s.item_name}`); // Debug Log

        return {
          item_id: s._id, // <--- IMPORTANT: Populate ke liye _id save karna padta hai, String nahi
          quantity: Number(it.quantity) || 0,
          quantity_issued: 0,
        };
      })
    );

    const request = await Request.create({
      request_id: `REQ-${Date.now()}`, // simple unique ID
      dept_id: req.session.user.dept_id,
      requestedBy: req.session.user.id,
      items: stockItems,
      status: "PENDING",
    });

    console.log("Request Saved Successfully!"); // Debug Log
    res.json({ message: "Request submitted", request });
  } catch (err) {
    console.error("Create request error:", err.message || err);
    res.status(400).json({ error: err.message || "Bad request" });
  }
};

// List all requests for the logged-in department user
exports.listMyRequests = async (req, res) => {
  try {
    // Note: Populate tabhi chalega jab createRequest me humne s._id save kiya ho
    const requests = await Request.find({ requestedBy: req.session.user.id })
      .populate("items.item_id")
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    console.error("List requests error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get status of a specific request
exports.getRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findOne({
      _id: id,
      requestedBy: req.session.user.id,
    }).populate("items.item_id");

    if (!request) return res.status(404).json({ error: "Not found" });
    res.json({ request });
  } catch (err) {
    console.error("Get status error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
