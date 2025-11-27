"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matchingController_1 = require("../controllers/matchingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
/**
 * Protected Routes - Require Authentication
 */
/**
 * Compare resume with job description
 * POST /api/matching/compare
 */
router.post('/compare', authMiddleware_1.authMiddleware, uploadMiddleware_1.upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jd', maxCount: 1 },
]), uploadMiddleware_1.handleMulterError, matchingController_1.MatchingController.compareResumeWithJD);
/**
 * Get match history for user
 * GET /api/matching/history
 */
router.get('/history', authMiddleware_1.authMiddleware, matchingController_1.MatchingController.getMatchHistory);
exports.default = router;
//# sourceMappingURL=matchingRoutes.js.map