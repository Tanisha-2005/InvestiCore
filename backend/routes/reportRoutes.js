const express = require("express");
const router = express.Router();
const { generateReport, downloadReport, listReports } = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

router.post("/case/:caseId/generate", protect, generateReport);
router.post("/generate/:caseId", protect, generateReport);
router.get("/list", protect, listReports);
router.get("/download/:fileName", downloadReport);

module.exports = router;
