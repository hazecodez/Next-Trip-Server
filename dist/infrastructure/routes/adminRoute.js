"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminUseCase_1 = __importDefault(require("../../useCase/adminUseCase"));
const adminRepo_1 = __importDefault(require("../repository/adminRepo"));
const packageRepo_1 = __importDefault(require("../repository/packageRepo"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const bcryption_1 = __importDefault(require("../utils/bcryption"));
const adminController_1 = __importDefault(require("../../adaptors/adminController"));
const adminAuth_1 = require("../middleware/adminAuth");
const jwt = new jwt_1.default();
const bcrypt = new bcryption_1.default();
const adminRepo = new adminRepo_1.default();
const packageRepo = new packageRepo_1.default();
const adminUseCase = new adminUseCase_1.default(adminRepo, jwt, bcrypt, packageRepo);
const controller = new adminController_1.default(adminUseCase);
const router = express_1.default.Router();
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/login", (req, res) => controller.adminLogin(req, res));
router.post("/google_login", (req, res) => controller.googleLogin(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/travelers", adminAuth_1.adminAuth, (req, res) => controller.getTravelersList(req, res));
router.patch("/traveler_action", adminAuth_1.adminAuth, (req, res) => controller.block_unblock_Traveler(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/hosts", adminAuth_1.adminAuth, (req, res) => controller.getHostsList(req, res));
router.patch("/host_action", adminAuth_1.adminAuth, (req, res) => controller.block_unblock_Host(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/packages", adminAuth_1.adminAuth, (req, res) => controller.getPackagesList(req, res));
router.patch("/package_action", adminAuth_1.adminAuth, (req, res) => controller.package_Actions(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/blogs", adminAuth_1.adminAuth, (req, res) => controller.getBlogList(req, res));
router.patch("/blog_action", adminAuth_1.adminAuth, (req, res) => controller.block_unblock_Blogs(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/dashboard", adminAuth_1.adminAuth, (req, res) => controller.dashboard(req, res));
router.get("/sales", adminAuth_1.adminAuth, (req, res) => controller.sales_report(req, res));
exports.default = router;
