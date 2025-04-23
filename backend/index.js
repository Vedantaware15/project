const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const semanticSearchRoutes = require("./routes/semanticSearch");
const fileRoutes = require("./routes/files");

// Load environment variables
dotenv.config();

// Connect to MongoDB
// connectDB();

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/semantic", semanticSearchRoutes);
app.use("/api/files", fileRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "PaperAI API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 