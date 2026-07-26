const express = require("express");
const router = express.Router();
const {
  uploadEvidence,
  getEvidenceByCase,
  getEvidenceStatus,
  deleteEvidence,
} = require("../controllers/evidenceController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);
router.post("/:caseId/upload", upload.single("file"), uploadEvidence);
router.get("/case/:caseId", getEvidenceByCase);
router.get("/:id/status", getEvidenceStatus);
router.delete("/:id", deleteEvidence);

module.exports = router;
