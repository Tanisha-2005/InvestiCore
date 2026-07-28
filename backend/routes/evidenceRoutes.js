const express = require("express");
const router = express.Router();
const {
  uploadEvidence,
  getEvidenceByCase,
  getEvidenceStatus,
  deleteEvidence,
  verifyEvidenceIntegrity,
  getCustodyLog,
  generateCustodyCertificate,
} = require("../controllers/evidenceController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);

router.post("/:caseId/upload", upload.single("file"), uploadEvidence);
router.get("/case/:caseId", getEvidenceByCase);
router.get("/case/:caseId/custody-log", getCustodyLog);
router.get("/:id/status", getEvidenceStatus);
router.get("/:evidenceId/custody-log", getCustodyLog);
router.post("/:id/verify-integrity", verifyEvidenceIntegrity);
router.get("/:id/custody-certificate", generateCustodyCertificate);
router.delete("/:id", deleteEvidence);

module.exports = router;
