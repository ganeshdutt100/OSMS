// src/server.js
const express = require("express");

const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");

const helmet = require("helmet");
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
const morgan = require("morgan");
require("dotenv").config();


mongoose.set("strictQuery", false);


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("✅ Connected to MongoDB for Office Supplies Management System")
  )
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // security headers
app.use(morgan("dev")); // request logging

app.use(
  session({
    secret: process.env.SESSION_SECRET || "office-supplies-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static files (css, js, html)
app.use(express.static(path.join(__dirname, "public")));

// Default route → send login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

// Routes
const authRoutes = require("./routes/auth");
const departmentRoutes = require("./routes/department");
const gaRoutes = require("./routes/ga");
const reportRoutes = require("./routes/report");

app.use("/auth", authRoutes);
app.use("/department", departmentRoutes);
app.use("/ga", gaRoutes);
app.use("/report", reportRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `🚀 Office Supplies Management System running at http://localhost:${PORT}`
  );
});
