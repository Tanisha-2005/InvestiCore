const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const IOC = require("../models/IOC");

const formatCaseDoc = (c) => {
  if (!c) return c;
  const doc = c.toObject ? c.toObject() : { ...c };
  return {
    ...doc,
    id: doc._id.toString(),
    title: doc.caseName || doc.title,
    caseName: doc.caseName || doc.title,
    victim_name: doc.victim || doc.victim_name,
    victim: doc.victim || doc.victim_name,
    priority: doc.riskLevel && doc.riskLevel !== "unassessed" ? doc.riskLevel : (doc.priority || "medium"),
    case_number: `CASE-${doc._id.toString().substring(0, 8).toUpperCase()}`
  };
};

exports.createCase = async (req, res) => {
  try {
    const { caseName, title, victim, victim_name, description, tags, priority, riskLevel } = req.body;
    const name = caseName || title;
    if (!name) return res.status(400).json({ message: "caseName or title is required" });

    const newCase = await Case.create({
      caseName: name,
      victim: victim || victim_name,
      description,
      tags,
      riskLevel: riskLevel || priority || "unassessed",
      createdBy: req.user._id,
      assignedInvestigators: [req.user._id],
    });
    res.status(201).json({ case: formatCaseDoc(newCase) });
  } catch (err) {
    res.status(500).json({ message: "Failed to create case", error: err.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const cases = await Case.find(filter).sort({ createdAt: -1 }).populate("createdBy", "name email");
    const formatted = cases.map(formatCaseDoc);
    res.json({ cases: formatted });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cases", error: err.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id).populate("createdBy", "name email");
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const evidence = await Evidence.find({ case: caseData._id }).sort({ createdAt: -1 });
    const iocs = await IOC.find({ case: caseData._id }).sort({ createdAt: -1 });

    res.json({ case: formatCaseDoc(caseData), evidence, iocs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch case", error: err.message });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const updates = (({ caseName, victim, description, status, tags }) => ({
      caseName,
      victim,
      description,
      status,
      tags,
    }))(req.body);

    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);
    if (updates.status === "closed") updates.closedAt = new Date();

    const updated = await Case.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Case not found" });
    res.json({ case: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update case", error: err.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const deleted = await Case.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Case not found" });
    await Evidence.deleteMany({ case: req.params.id });
    await IOC.deleteMany({ case: req.params.id });
    res.json({ message: "Case and related data deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete case", error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalCases, activeCases, closedCases, totalIOCs, maliciousIOCs] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: "active" }),
      Case.countDocuments({ status: "closed" }),
      IOC.countDocuments(),
      IOC.countDocuments({ "threatIntel.isMalicious": true }),
    ]);
    const recentCases = await Case.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalCases,
      activeCases,
      closedCases,
      threatAlerts: maliciousIOCs,
      totalIOCs,
      recentCases,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: err.message });
  }
};
