const express = require("express");
const router = express.Router();
const { manualLookup, scanCaseIOCs, getCaseIOCs } = require("../controllers/threatIntelController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/lookup", manualLookup);
router.get("/ip/:ip", (req, res) => {
  req.body = { type: "ip", value: req.params.ip };
  manualLookup(req, res);
});
router.get("/indicator/:value", (req, res) => {
  const val = req.params.value;
  const type = val.includes(".") ? (val.match(/^\d+/) ? "ip" : "domain") : "hash_sha256";
  req.body = { type, value: val };
  manualLookup(req, res);
});
router.post("/case/:caseId/scan", scanCaseIOCs);
router.get("/case/:caseId", getCaseIOCs);

module.exports = router;
