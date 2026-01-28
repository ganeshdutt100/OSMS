// src/controllers/reportController.js
const Request = require('../models/Request');
const StockItem = require('../models/StockItem');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Department = require('../models/Department'); // ✅ fixed path

exports.departmentSummary = async (req, res) => {
  try {
    const summary = await Request.aggregate([
      {
        $group: {
          _id: '$dept_id',
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] } },
          issued: { $sum: { $cond: [{ $eq: ['$status', 'ISSUED'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: 'dept_id',
          as: 'departmentDetails'
        }
      },
      { $unwind: { path: '$departmentDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          dept_id: '$_id',
          dept_name: '$departmentDetails.dept_name',
          location: '$departmentDetails.location',
          phone: '$departmentDetails.phone',
          email: '$departmentDetails.email',
          total: 1,
          pending: 1,
          approved: 1,
          rejected: 1,
          issued: 1
        }
      }
    ]);

    res.json({ summary });
  } catch (err) {
    console.error('Department summary error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.systemSummary = async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: 'PENDING' });
    const approved = await Request.countDocuments({ status: 'APPROVED' });
    const rejected = await Request.countDocuments({ status: 'REJECTED' });
    const issued = await Request.countDocuments({ status: 'ISSUED' });
    const stockCount = await StockItem.countDocuments();
    const issuesCount = await Issue.countDocuments();
    const usersCount = await User.countDocuments();
    const departmentsCount = await Department.countDocuments();

    res.json({
      summary: {
        totalRequests,
        pending,
        approved,
        rejected,
        issued,
        stockCount,
        issuesCount,
        usersCount,
        departmentsCount
      }
    });
  } catch (err) {
    console.error('System summary error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};