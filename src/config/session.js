// src/config/session.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/office_supplies';

const store = MongoStore.create({
  mongoUrl: uri,
  collectionName: 'sessions',
  ttl: 60 * 60 * 8 // 8 hours
});

function sessionConfig() {
  return session({
    secret: process.env.SESSION_SECRET || 'office-supplies-secret',
    resave: false,
    saveUninitialized: false,
    store
  });
}

module.exports = sessionConfig;