// src/middleware/auth.js
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  // If the client expects HTML, redirect to login page
  if (req.accepts('html')) {
    return res.redirect('/html/login.html'); // static file served from public/html
  }

  // Otherwise return JSON error
  return res.status(401).json({ error: 'Unauthorized' });
}

module.exports = requireAuth;