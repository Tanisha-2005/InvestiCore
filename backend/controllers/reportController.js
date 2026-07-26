const path = require("path");
const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const IOC = require("../models/IOC");
const { generateCaseReport } = require("../services/reportService");

exports.generateReport = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseData = await Case.findById(caseId);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const evidenceList = await Evidence.find({ case: caseId });
    const iocList = await IOC.find({ case: caseId });

    const outputDir = path.join(__dirname, "..", "uploads", "reports");
    const filePath = await generateCaseReport({ caseData, evidenceList, iocList, outputDir });

    res.json({
      message: "Report generated",
      downloadUrl: `/api/reports/download/${path.basename(filePath)}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Report generation failed", error: err.message });
  }
};

exports.downloadReport = (req, res) => {
  const filePath = path.join(__dirname, "..", "uploads", "reports", req.params.fileName);
  res.download(filePath, (err) => {
    if (err) res.status(404).json({ message: "Report not found" });
  });
};
