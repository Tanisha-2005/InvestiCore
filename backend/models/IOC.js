const mongoose = require("mongoose");

const iocSchema = new mongoose.Schema(
  {
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
    sourceEvidence: { type: mongoose.Schema.Types.ObjectId, ref: "Evidence" },
    type: {
      type: String,
      enum: ["ip", "domain", "url", "email", "file_hash", "phone", "upi_id"],
      required: true,
    },
    value: { type: String, required: true, trim: true },
    firstSeen: { type: Date, default: Date.now },
    relatedIOCs: [{ type: mongoose.Schema.Types.ObjectId, ref: "IOC" }],
    threatIntel: {
      checked: { type: Boolean, default: false },
      isMalicious: { type: Boolean, default: false },
      malwareScore: { type: Number, default: 0 },
      sources: { type: mongoose.Schema.Types.Mixed, default: {} },
      lastChecked: { type: Date },
    },
  },
  { timestamps: true }
);

iocSchema.index({ case: 1, type: 1, value: 1 }, { unique: true });

module.exports = mongoose.model("IOC", iocSchema);
