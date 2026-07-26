const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["screenshot", "email", "log", "pcap", "pdf", "chat_screenshot", "other"],
      default: "other",
    },
    mimeType: { type: String },
    fileSize: { type: Number },
    fileHash: {
      md5: String,
      sha1: String,
      sha256: String,
    },
    extractedText: { type: String, default: "" },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    aiSummary: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evidence", evidenceSchema);
