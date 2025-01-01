const path = require("path");
const fs = require("fs");
const File = require("../models/fileModel"); // File schema for MongoDB

// Upload a File
exports.uploadFile = async (req, res) => {
    try {
        console.log("req.file", req.file);  // Log the file
        console.log("req.body", req.body);  // Log the request body
    
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

    const { originalname, mimetype, size, filename } = req.file;

    const fileData = new File({
      fileName: originalname,
      fileType: mimetype,
      fileSize: size,
      uploadedBy: req.user.email, // Decoded JWT payload
      uploadDate: new Date(),
      filePath: filename,
    });

    await fileData.save();

    res.status(201).json({ message: "File uploaded successfully", fileData });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};

// Get All Files
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files", error: error.message });
  }
};

// Delete a File
exports.deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "../uploads", file.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file from the server
    }

    await File.findByIdAndDelete(id); // Remove file record from the database
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
};