const fs = require("fs");
const path = require("path");
const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const IOC = require("../models/IOC");
const CustodyLog = require("../models/CustodyLog");
const { generateCaseReport } = require("../services/reportService");

exports.generateReport = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseData = await Case.findById(caseId);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const evidenceList = await Evidence.find({ case: caseId }).populate("uploadedBy", "name email role");
    const iocList = await IOC.find({ case: caseId });
    const custodyLogs = await CustodyLog.find({ case: caseId })
      .populate("performedBy", "name email role")
      .populate("evidence", "originalName fileType")
      .sort({ createdAt: 1 });

    const outputDir = path.join(__dirname, "..", "uploads", "reports");
    const filePath = await generateCaseReport({ caseData, evidenceList, iocList, custodyLogs, outputDir });
    const fileName = path.basename(filePath);
    const stats = fs.statSync(filePath);

    res.json({
      message: "Court-Admissible Evidence Package Report generated successfully",
      fileName,
      downloadUrl: `/api/reports/download/${fileName}`,
      fileSize: `${(stats.size / 1024).toFixed(1)} KB`,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ message: "Report generation failed", error: err.message });
  }
};

exports.downloadReport = (req, res) => {
  const filePath = path.join(__dirname, "..", "uploads", "reports", req.params.fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Report file not found" });
  }
  res.download(filePath, (err) => {
    if (err && !res.headersSent) res.status(500).json({ message: "Failed to stream report file" });
  });
};

exports.listReports = (req, res) => {
  try {
    const reportsDir = path.join(__dirname, "..", "uploads", "reports");
    if (!fs.existsSync(reportsDir)) {
      return res.json({ reports: [] });
    }

    const files = fs.readdirSync(reportsDir);
    const reports = files
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => {
        const filePath = path.join(reportsDir, file);
        const stats = fs.statSync(filePath);
        return {
          fileName: file,
          downloadUrl: `/api/reports/download/${file}`,
          fileSize: `${(stats.size / 1024).toFixed(1)} KB`,
          createdAt: stats.birthtime || stats.mtime,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: "Failed to list reports", error: err.message });
  }
};
