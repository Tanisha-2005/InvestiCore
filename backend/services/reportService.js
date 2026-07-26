const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Generates a professional investigation report PDF for a case.
 * Returns the file path of the generated PDF.
 */
function generateCaseReport({ caseData, evidenceList, iocList, outputDir }) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      const fileName = `report-${caseData._id}-${Date.now()}.pdf`;
      const filePath = path.join(outputDir, fileName);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).fillColor("#0f172a").text("InvestiCore — Official Forensic Investigation Report", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#64748b").text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
      doc.moveDown(1.5);
      doc.strokeColor("#e2e8f0").moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);

      // Case details
      doc.fontSize(14).fillColor("#0f172a").text("Case Overview");
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor("#334155");
      doc.text(`Case Name: ${caseData.caseName}`);
      doc.text(`Victim: ${caseData.victim || "N/A"}`);
      doc.text(`Status: ${caseData.status}`);
      doc.text(`Risk Score: ${caseData.riskScore ?? "N/A"} (${caseData.riskLevel || "unassessed"})`);
      doc.text(`Description: ${caseData.description || "N/A"}`);
      doc.moveDown(1);

      // AI Summary
      if (caseData.aiSummary) {
        doc.fontSize(14).fillColor("#0f172a").text("AI-Generated Summary");
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("#334155").text(caseData.aiSummary, { align: "justify" });
        doc.moveDown(1);
      }

      // Evidence
      doc.fontSize(14).fillColor("#0f172a").text(`Evidence (${evidenceList.length})`);
      doc.moveDown(0.5);
      evidenceList.forEach((ev, i) => {
        doc.fontSize(10).fillColor("#0f172a").text(`${i + 1}. ${ev.originalName} [${ev.fileType}]`);
        if (ev.aiSummary) {
          doc.fontSize(9).fillColor("#64748b").text(`   Summary: ${ev.aiSummary}`, { indent: 10 });
        }
        doc.moveDown(0.3);
      });
      doc.moveDown(0.7);

      // IOCs
      doc.fontSize(14).fillColor("#0f172a").text(`Indicators of Compromise (${iocList.length})`);
      doc.moveDown(0.5);
      const grouped = iocList.reduce((acc, ioc) => {
        acc[ioc.type] = acc[ioc.type] || [];
        acc[ioc.type].push(ioc);
        return acc;
      }, {});
      Object.entries(grouped).forEach(([type, iocs]) => {
        doc.fontSize(11).fillColor("#0f172a").text(type.toUpperCase());
        iocs.forEach((ioc) => {
          const malicious = ioc.threatIntel?.isMalicious ? "MALICIOUS" : "unverified/clean";
          doc.fontSize(9).fillColor("#334155").text(`  - ${ioc.value}  [${malicious}, score: ${ioc.threatIntel?.malwareScore ?? 0}]`);
        });
        doc.moveDown(0.4);
      });

      doc.moveDown(1);
      doc.fontSize(8).fillColor("#94a3b8").text(
        "This report was generated with AI assistance and automated threat intelligence lookups. All findings should be independently verified by a qualified investigator before use in legal proceedings.",
        { align: "center" }
      );

      doc.end();
      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateCaseReport };
