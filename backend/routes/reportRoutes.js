const express = require("express");
const router = express.Router();
const { generateReport, downloadReport } = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

router.post("/case/:caseId/generate", protect, generateReport);
router.get("/download/:fileName", downloadReport);

module.exports = router;
