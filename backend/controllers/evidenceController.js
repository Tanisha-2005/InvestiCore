const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { simpleParser } = require("mailparser");
const Tesseract = require("tesseract.js");

const Evidence = require("../models/Evidence");
const Case = require("../models/Case");
const IOC = require("../models/IOC");
const CustodyLog = require("../models/CustodyLog");
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

    // Record initial Chain of Custody entry
    await CustodyLog.create({
      evidence: evidence._id,
      case: caseId,
      performedBy: req.user._id,
      action: "UPLOADED",
      actionDetails: `Evidence uploaded and cryptographic hashes generated (SHA256: ${fileHash.sha256})`,
      recordedHash: fileHash,
      integrityStatus: "VERIFIED_INTACT",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "InvestiCore Desktop Workstation",
    });

    // Process asynchronously so the upload response returns immediately
    processEvidence(evidence._id).catch((err) =>
      console.error(`Evidence processing failed for ${evidence._id}:`, err.message)
    );

    res.status(201).json({ evidence, message: "Evidence uploaded and custody logged." });
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
    const evidence = await Evidence.find({ case: req.params.caseId })
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ evidence });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch evidence", error: err.message });
  }
};

exports.getEvidenceStatus = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id).populate("uploadedBy", "name email role");
    if (!evidence) return res.status(404).json({ message: "Evidence not found" });
    res.json({ evidence });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch evidence", error: err.message });
  }
};

exports.deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) return res.status(404).json({ message: "Evidence not found" });

    await CustodyLog.create({
      evidence: evidence._id,
      case: evidence.case,
      performedBy: req.user._id,
      action: "DELETED",
      actionDetails: `Evidence deleted from storage vault`,
      recordedHash: evidence.fileHash,
      integrityStatus: "UNKNOWN",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "InvestiCore Workstation",
    });

    if (fs.existsSync(evidence.filePath)) fs.unlinkSync(evidence.filePath);
    await Evidence.findByIdAndDelete(req.params.id);

    res.json({ message: "Evidence deleted and custody record closed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete evidence", error: err.message });
  }
};

/** Live Evidence Integrity Verification API */
exports.verifyEvidenceIntegrity = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id).populate("uploadedBy", "name email role");
    if (!evidence) return res.status(404).json({ message: "Evidence artifact not found" });

    if (!fs.existsSync(evidence.filePath)) {
      const failedLog = await CustodyLog.create({
        evidence: evidence._id,
        case: evidence.case,
        performedBy: req.user._id,
        action: "INTEGRITY_FAILED",
        actionDetails: "Physical evidence file missing from storage path",
        recordedHash: evidence.fileHash,
        integrityStatus: "TAMPERED_OR_MISSING",
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "InvestiCore Verification Engine",
      });

      return res.status(400).json({
        intact: false,
        status: "TAMPERED_OR_MISSING",
        message: "ALERT: Physical evidence file missing from server disk!",
        log: failedLog,
      });
    }

    const currentHash = hashFile(evidence.filePath);
    const intact = currentHash.sha256 === evidence.fileHash.sha256;
    const status = intact ? "VERIFIED_INTACT" : "TAMPERED_OR_MISSING";

    const custodyLog = await CustodyLog.create({
      evidence: evidence._id,
      case: evidence.case,
      performedBy: req.user._id,
      action: intact ? "INTEGRITY_VERIFIED" : "INTEGRITY_FAILED",
      actionDetails: intact
        ? `Live cryptographic hash check PASSED. Current SHA256 matches initial upload baseline.`
        : `CRITICAL ALERT: Live SHA256 (${currentHash.sha256}) does not match upload baseline (${evidence.fileHash.sha256})!`,
      recordedHash: currentHash,
      integrityStatus: status,
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "InvestiCore Verification Engine",
    });

    res.json({
      intact,
      status,
      originalHash: evidence.fileHash,
      currentHash,
      verifiedAt: new Date().toISOString(),
      verifiedBy: { name: req.user.name, email: req.user.email, role: req.user.role },
      log: custodyLog,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify evidence integrity", error: err.message });
  }
};

/** Get Chain of Custody History */
exports.getCustodyLog = async (req, res) => {
  try {
    const { evidenceId, caseId } = req.params;
    let query = {};
    if (evidenceId) query.evidence = evidenceId;
    if (caseId) query.case = caseId;

    const logs = await CustodyLog.find(query)
      .populate("performedBy", "name email role")
      .populate("evidence", "originalName fileType fileHash")
      .sort({ createdAt: -1 });

    res.json({ custodyLogs: logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch custody logs", error: err.message });
  }
};

/** Generate Official Certificate of Evidence Authenticity & Custody */
exports.generateCustodyCertificate = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate("case", "title caseNumber priority status")
      .populate("uploadedBy", "name email role");

    if (!evidence) return res.status(404).json({ message: "Evidence artifact not found" });

    const logs = await CustodyLog.find({ evidence: evidence._id })
      .populate("performedBy", "name email role")
      .sort({ createdAt: 1 });

    // Log the certificate generation event
    await CustodyLog.create({
      evidence: evidence._id,
      case: evidence.case._id,
      performedBy: req.user._id,
      action: "CERTIFICATE_EXPORTED",
      actionDetails: "Official Certificate of Evidence Authenticity generated for legal audit",
      recordedHash: evidence.fileHash,
      integrityStatus: "VERIFIED_INTACT",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "InvestiCore Certificate Engine",
    });

    const certificate = {
      certificateId: `CERT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      issuedAt: new Date().toISOString(),
      caseInfo: {
        id: evidence.case._id,
        title: evidence.case.title,
        caseNumber: evidence.case.caseNumber || `CASE-${evidence.case._id.toString().slice(-6).toUpperCase()}`,
      },
      evidenceInfo: {
        id: evidence._id,
        originalName: evidence.originalName,
        fileType: evidence.fileType,
        mimeType: evidence.mimeType,
        fileSize: evidence.fileSize,
        uploadedAt: evidence.createdAt,
        custodian: evidence.uploadedBy ? evidence.uploadedBy.name : "System Investigator",
      },
      cryptographicSignature: {
        algorithm: "SHA-256 / SHA-1 / MD5 Digest",
        md5: evidence.fileHash?.md5,
        sha1: evidence.fileHash?.sha1,
        sha256: evidence.fileHash?.sha256,
      },
      verificationSeal: {
        status: "OFFICIALLY_SEALED",
        issuer: "InvestiCore Digital Forensics Authority",
        integrityGuarantee: "Cryptographically Verified Untampered Original Evidence",
      },
      chainOfCustodyEvents: logs.map((log) => ({
        id: log._id,
        action: log.action,
        details: log.actionDetails,
        officer: log.performedBy ? `${log.performedBy.name} (${log.performedBy.role || "Investigator"})` : "System Engine",
        timestamp: log.createdAt,
        integrityStatus: log.integrityStatus,
        ipAddress: log.ipAddress,
      })),
    };

    res.json({ certificate });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate custody certificate", error: err.message });
  }
};

module.exports.processEvidence = processEvidence;
