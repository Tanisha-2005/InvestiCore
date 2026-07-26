const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    caseName: { type: String, required: true, trim: true },
    victim: { type: String, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["active", "closed", "pending"], default: "active" },
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    riskLevel: { type: String, enum: ["low", "medium", "high", "critical", "unassessed"], default: "unassessed" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedInvestigators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    aiSummary: { type: String, default: "" },
    tags: [{ type: String }],
    closedAt: { type: Date },
  },
  { timestamps: true }
);

caseSchema.index({ caseName: "text", victim: "text", description: "text" });

module.exports = mongoose.model("Case", caseSchema);
