const mongoose = require("mongoose");

const custodyLogSchema = new mongoose.Schema(
  {
    evidence: { type: mongoose.Schema.Types.ObjectId, ref: "Evidence", required: true },
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: [
        "UPLOADED",
        "INTEGRITY_VERIFIED",
        "INTEGRITY_FAILED",
        "VIEWED",
        "DOWNLOADED",
        "DELETED",
        "CERTIFICATE_EXPORTED",
      ],
      required: true,
    },
    actionDetails: { type: String, default: "" },
    recordedHash: {
      md5: String,
      sha1: String,
      sha256: String,
    },
    integrityStatus: {
      type: String,
      enum: ["VERIFIED_INTACT", "TAMPERED_OR_MISSING", "UNKNOWN"],
      default: "VERIFIED_INTACT",
    },
    ipAddress: { type: String, default: "127.0.0.1" },
    userAgent: { type: String, default: "InvestiCore Desktop Workstation" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustodyLog", custodyLogSchema);
