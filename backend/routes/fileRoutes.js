const express = require("express");
const multer = require("multer");
const { uploadFile, getFiles, deleteFile } = require("../controllers/fileController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // Max size of 10MB
  });
  
// Routes
router.post("/upload", authenticate, upload.single("file"), uploadFile); // Upload file
router.get("/", authenticate, getFiles); // Get all files
router.delete("/:id", authenticate, deleteFile); // Delete file by ID

module.exports = router;