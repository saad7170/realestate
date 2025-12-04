import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import propertiesRoutes from "./routes/properties.js";
import uploadRoutes from "./routes/upload.js";
import citiesRoutes from "./routes/cities.js";
import usersRoutes from "./routes/users.js";
import inquiriesRoutes from "./routes/inquiries.js";
import agentsRoutes from "./routes/agents.js";
import adminRoutes from "./routes/admin.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Property Listing Platform API",
    version: "1.0.0",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
console.log("Loading routes...");
app.use("/api/auth", authRoutes);
console.log("✓ Auth routes loaded");

app.use("/api/properties", propertiesRoutes);
console.log("✓ Properties routes loaded");

app.use("/api/upload", uploadRoutes);
console.log("✓ Upload routes loaded");

app.use("/api/cities", citiesRoutes);
console.log("✓ Cities routes loaded");

app.use("/api/users", usersRoutes);
console.log("✓ Users routes loaded");

app.use("/api/inquiries", inquiriesRoutes);
console.log("✓ Inquiries routes loaded");

app.use("/api/agents", agentsRoutes);
console.log("✓ Agents routes loaded");

app.use("/api/admin", adminRoutes);
console.log("✓ Admin routes loaded");

console.log("All routes loaded successfully!");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
