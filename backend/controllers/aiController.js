const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const IOC = require("../models/IOC");
const aiService = require("../services/aiService");

exports.generateCaseSummary = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseData = await Case.findById(caseId);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const evidence = await Evidence.find({ case: caseId, processingStatus: "completed" });
    const iocDocs = await IOC.find({ case: caseId });

    const iocs = iocDocs.reduce((acc, ioc) => {
      acc[ioc.type] = acc[ioc.type] || [];
      acc[ioc.type].push(ioc.value);
      return acc;
    }, {});

    const result = await aiService.generateCaseSummary({
      caseName: caseData.caseName,
      description: caseData.description,
      evidenceSummaries: evidence.map((e) => e.aiSummary).filter(Boolean),
      iocs,
    });

    caseData.aiSummary = result.overview;
    caseData.riskScore = Math.min(100, Math.max(0, Number(result.riskScore) || 0));
    caseData.riskLevel =
      caseData.riskScore >= 75 ? "critical" : caseData.riskScore >= 50 ? "high" : caseData.riskScore >= 25 ? "medium" : "low";
    await caseData.save();

    res.json({ case: caseData, analysis: result });
  } catch (err) {
    res.status(500).json({ message: "AI case summary failed", error: err.message });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ message: "message is required" });

    const caseData = await Case.findById(caseId);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const evidence = await Evidence.find({ case: caseId });
    const iocs = await IOC.find({ case: caseId });

    const contextParts = [
      `Case: ${caseData.caseName}`,
      `Victim: ${caseData.victim || "N/A"}`,
      `Description: ${caseData.description || "N/A"}`,
      `Status: ${caseData.status}, Risk: ${caseData.riskScore}/100 (${caseData.riskLevel})`,
      caseData.aiSummary ? `Existing AI Summary: ${caseData.aiSummary}` : "",
      `Evidence (${evidence.length}): ${evidence.map((e) => `${e.originalName} [${e.fileType}]${e.aiSummary ? ` - ${e.aiSummary}` : ""}`).join("; ")}`,
      `IOCs (${iocs.length}): ${iocs.map((i) => `${i.type}:${i.value}${i.threatIntel?.isMalicious ? " (MALICIOUS)" : ""}`).join(", ")}`,
    ];

    const reply = await aiService.chatAboutCase({
      caseContext: contextParts.filter(Boolean).join("\n"),
      conversationHistory: history || [],
      userMessage: message,
    });

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "AI chat failed", error: err.message });
  }
};
