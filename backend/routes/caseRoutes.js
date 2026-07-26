const express = require("express");
const router = express.Router();
const {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  getDashboardStats,
} = require("../controllers/caseController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/stats/dashboard", getDashboardStats);
router.post("/", createCase);
router.get("/", getCases);
router.get("/:id", getCaseById);
router.put("/:id", updateCase);
router.delete("/:id", deleteCase);

module.exports = router;
