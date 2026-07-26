const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { simpleParser } = require("mailparser");
const Tesseract = require("tesseract.js");

const Evidence = require("../models/Evidence");
const Case = require("../models/Case");
const IOC = require("../models/IOC");
const { extractIOCs } = require("../services/iocExtractor");
const { summarizeEvidence } = require("../services/aiService");

function hashFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  return {
    md5: crypto.createHash("md5").update(buffer).digest("hex"),
    sha1: crypto.createHash("sha1").update(buffer).digest("hex"),
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function inferFileType(originalName, mimeType) {
  const ext = path.extname(originalName).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) return "screenshot";
  if ([".eml", ".msg"].includes(ext)) return "email";
  if ([".log", ".txt"].includes(ext)) return "log";
  if ([".pcap", ".pcapng"].includes(ext)) return "pcap";
  if (ext === ".pdf") return "pdf";
  return "other";
}

/** Extracts raw text and forensic indicators from evidence files based on type. */
async function extractContent(filePath, fileType) {
  try {
    if (fileType === "screenshot") {
      const { data } = await Tesseract.recognize(filePath, "eng");
      return data.text || "";
    }
    if (fileType === "email") {
      const raw = fs.readFileSync(filePath);
      const parsed = await simpleParser(raw);
      const parts = [
        `From: ${parsed.from?.text || ""}`,
        `To: ${parsed.to?.text || ""}`,
        `Subject: ${parsed.subject || ""}`,
        `Date: ${parsed.date || ""}`,
        `Body: ${parsed.text || parsed.html || ""}`,
      ];
      return parts.join("\n");
    }
    if (fileType === "pcap") {
      const buffer = fs.readFileSync(filePath);
      // Extract printable ASCII packet streams, IP addresses, domains, and protocol data
      const printable = buffer.toString("binary").replace(/[^\x20-\x7E\t\r\n]/g, " ");
      const ipMatches = printable.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
      const domainMatches = printable.match(/\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\b/g) || [];
      const uniqueIPs = Array.from(new Set(ipMatches)).slice(0, 50);
      const uniqueDomains = Array.from(new Set(domainMatches)).slice(0, 50);

      return `[PCAP Network Analysis Result]
Captured Network Streams & Protocol Dump:
Extracted IP Addresses: ${uniqueIPs.join(", ")}
Extracted Domains / Hosts: ${uniqueDomains.join(", ")}
Packet Text Snippet:
${printable.slice(0, 10000)}`;
    }
    if (fileType === "pdf") {
      const buffer = fs.readFileSync(filePath);
      // Extract text content from PDF stream objects
      const pdfText = buffer.toString("binary").replace(/[^\x20-\x7E\t\r\n]/g, " ");
      const cleanedText = pdfText.replace(/\/[\w]+/g, " ").replace(/\s+/g, " ");
      return `[PDF Document Text Content]
${cleanedText.slice(0, 50000)}`;
    }
    if (fileType === "log" || fileType === "other") {
      return fs.readFileSync(filePath, "utf-8").slice(0, 200000);
    }
  } catch (err) {
    console.error(`[ExtractContent Error] (${fileType}):`, err.message);
  }
  return "";
}

exports.uploadEvidence = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseExists = await Case.findById(caseId);
    if (!caseExists) return res.status(404).json({ message: "Case not found" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileType = inferFileType(req.file.originalname, req.file.mimetype);
    const fileHash = hashFile(req.file.path);

    const evidence = await Evidence.create({
      case: caseId,
      uploadedBy: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileHash,
      processingStatus: "pending",
    });

    // Process asynchronously so the upload response returns immediately
    processEvidence(evidence._id).catch((err) =>
      console.error(`Evidence processing failed for ${evidence._id}:`, err.message)
    );

    res.status(201).json({ evidence, message: "Evidence uploaded. Processing started." });
  } catch (err) {
    res.status(500).json({ message: "Evidence upload failed", error: err.message });
  }
};

/** Background pipeline: extract text -> extract IOCs -> AI summary -> save IOC records */
async function processEvidence(evidenceId) {
  const evidence = await Evidence.findById(evidenceId);
  if (!evidence) return;

  evidence.processingStatus = "processing";
  await evidence.save();

  try {
    const text = await extractContent(evidence.filePath, evidence.fileType);
    evidence.extractedText = text.slice(0, 50000);

    const iocs = extractIOCs(text);
    evidence.metadata = { iocCounts: Object.fromEntries(Object.entries(iocs).map(([k, v]) => [k, v.length])) };

    // Persist IOC records (upsert to avoid duplicates within a case)
    const iocDocs = [];
    for (const [type, values] of Object.entries(iocs)) {
      for (const value of values) {
        const doc = await IOC.findOneAndUpdate(
          { case: evidence.case, type, value },
          { $setOnInsert: { case: evidence.case, type, value, sourceEvidence: evidence._id } },
          { upsert: true, new: true }
        );
        iocDocs.push(doc);
      }
    }

    // AI summary (skips gracefully if no OpenAI key configured)
    try {
      if (text && text.trim().length > 0) {
        evidence.aiSummary = await summarizeEvidence(text, evidence.fileType);
      }
    } catch (aiErr) {
      evidence.aiSummary = `AI summary unavailable: ${aiErr.message}`;
    }

    evidence.processingStatus = "completed";
    await evidence.save();
  } catch (err) {
    evidence.processingStatus = "failed";
    evidence.metadata = { ...evidence.metadata, error: err.message };
    await evidence.save();
  }
}

exports.getEvidenceByCase = async (req, res) => {
  try {
    const evidence = await Evidence.find({ case: req.params.caseId }).sort({ createdAt: -1 });
    res.json({ evidence });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch evidence", error: err.message });
  }
};

exports.getEvidenceStatus = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) return res.status(404).json({ message: "Evidence not found" });
    res.json({ evidence });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch evidence", error: err.message });
  }
};

exports.deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);
    if (!evidence) return res.status(404).json({ message: "Evidence not found" });
    if (fs.existsSync(evidence.filePath)) fs.unlinkSync(evidence.filePath);
    res.json({ message: "Evidence deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete evidence", error: err.message });
  }
};

module.exports.processEvidence = processEvidence;
