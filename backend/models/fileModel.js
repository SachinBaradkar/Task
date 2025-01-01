const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedBy: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  filePath: { type: String, required: true }, // Path where the file is stored
});

module.exports = mongoose.model('File', fileSchema);
