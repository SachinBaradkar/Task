const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const cors = require("cors"); // Import the cors package
const multer = require('multer'); // Import multer
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const fileRoutes = require('./routes/fileRoutes');
const { authenticate } = require("./middlewares/authMiddleware"); // Import the authenticate middleware

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for the port

// Ensure "uploads" directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer storage and file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Files will be saved in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set file name with timestamp to avoid collisions
  }
});

// Set up upload middleware
const upload = multer({ storage });

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing JSON requests

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

// Connect to MongoDB
connectDB();

// Default Route
app.get("/", (req, res) => {
  res.send("Hello, CleverPe backend is working!");
});

// API Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/tasks", authenticate, taskRoutes); // Task routes with authentication middleware
app.use('/api/files', fileRoutes);
app.use('/uploads', express.static('uploads'));

// API to handle file upload with multer
app.post('/api/files/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', file: req.file });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
