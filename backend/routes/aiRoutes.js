const express = require("express");
const router = express.Router();
const { generateCaseSummary, chatWithAI } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/case/:caseId/summarize", generateCaseSummary);
router.post("/case/:caseId/chat", chatWithAI);

module.exports = router;
