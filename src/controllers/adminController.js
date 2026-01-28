// src/controllers/adminController.js
const User = require('../models/User');
const Department = require('src/models/Department'); // make sure this model exists

// List all users
async function listUsers(req, res) {
  try {
    const users = await User.find({}, 'user_id name email role dept_id status').lean();
    res.json({ users });
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
}

// Delete a user
async function deleteUser(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    res.json({ message: `User ${email} deleted` });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

// List all departments
async function listDepartments(req, res) {
  try {
    const departments = await Department.find({}, 'dept_id dept_name location phone email').lean();
    res.json({ departments });
  } catch (err) {
    console.error('listDepartments error:', err);
    res.status(500).json({ error: 'Failed to load departments' });
  }
}

// Delete a department
async function deleteDepartment(req, res) {
  try {
    const { dept_id } = req.body;
    if (!dept_id) return res.status(400).json({ error: 'dept_id is required' });

    const deleted = await Department.findOneAndDelete({ dept_id });
    if (!deleted) return res.status(404).json({ error: 'Department not found' });

    res.json({ message: `Department ${dept_id} deleted` });
  } catch (err) {
    console.error('deleteDepartment error:', err);
    res.status(500).json({ error: 'Failed to delete department' });
  }
}

module.exports = {
  listUsers,
  deleteUser,
  listDepartments,
  deleteDepartment,
};