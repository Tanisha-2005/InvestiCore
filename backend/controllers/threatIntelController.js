const IOC = require("../models/IOC");
const Case = require("../models/Case");
const threatIntelService = require("../services/threatIntelService");

/** Ad-hoc lookup: check any IP/domain/hash/URL without needing a saved IOC record */
exports.manualLookup = async (req, res) => {
  try {
    const { type, value } = req.body;
    if (!type || !value) return res.status(400).json({ message: "type and value are required" });

    const result = await threatIntelService.lookupIOC(type, value);
    res.json({ type, value, result });
  } catch (err) {
    res.status(500).json({ message: "Threat intel lookup failed", error: err.message });
  }
};

/** Runs threat intel checks on every un-checked IOC for a case */
exports.scanCaseIOCs = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseExists = await Case.findById(caseId);
    if (!caseExists) return res.status(404).json({ message: "Case not found" });

    const iocs = await IOC.find({ case: caseId, "threatIntel.checked": false });
    const updated = [];

    for (const ioc of iocs) {
      try {
        const result = await threatIntelService.lookupIOC(ioc.type, ioc.value);
        ioc.threatIntel = {
          checked: true,
          isMalicious: result.isMalicious,
          malwareScore: result.malwareScore,
          sources: result.sources,
          lastChecked: new Date(),
        };
        await ioc.save();
        updated.push(ioc);
      } catch (err) {
        console.error(`Threat intel check failed for IOC ${ioc.value}:`, err.message);
      }
    }

    res.json({ message: `Scanned ${updated.length} IOC(s)`, iocs: updated });
  } catch (err) {
    res.status(500).json({ message: "Case IOC scan failed", error: err.message });
  }
};

exports.getCaseIOCs = async (req, res) => {
  try {
    const iocs = await IOC.find({ case: req.params.caseId }).sort({ "threatIntel.malwareScore": -1 });
    res.json({ iocs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch IOCs", error: err.message });
  }
};
