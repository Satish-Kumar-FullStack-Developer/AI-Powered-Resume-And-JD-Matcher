"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const matchingRoutes_1 = __importDefault(require("./matchingRoutes"));
const router = (0, express_1.Router)();
/**
 * API Routes
 */
router.use('/auth', authRoutes_1.default);
router.use('/matching', matchingRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map