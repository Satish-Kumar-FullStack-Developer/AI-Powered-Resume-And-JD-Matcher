"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Public Routes
 */
router.post('/register', authController_1.AuthController.register);
router.post('/login', authController_1.AuthController.login);
/**
 * Protected Routes
 */
router.get('/me', authMiddleware_1.authMiddleware, authController_1.AuthController.getCurrentUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map