// src/middleware/roles.js

/**
 * Middleware to enforce role-based access control.
 * Roles must match one of: 'ADMIN', 'GA', 'STAFF'
 */
function requireRole(role) {
  return (req, res, next) => {
    const user = req.session && req.session.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: `Forbidden: requires ${role} role` });
    }

    next();
  };
}

module.exports = { requireRole };