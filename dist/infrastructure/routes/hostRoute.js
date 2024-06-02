"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generateOtp_1 = __importDefault(require("../utils/generateOtp"));
const email_1 = __importDefault(require("../utils/email"));
const bcryption_1 = __importDefault(require("../utils/bcryption"));
const otpRepo_1 = __importDefault(require("../repository/otpRepo"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const hostUseCase_1 = __importDefault(require("../../useCase/hostUseCase"));
const hostRepo_1 = __importDefault(require("../repository/hostRepo"));
const hostController_1 = __importDefault(require("../../adaptors/hostController"));
const packageController_1 = __importDefault(require("../../adaptors/packageController"));
const packageUseCase_1 = __importDefault(require("../../useCase/packageUseCase"));
const packageRepo_1 = __importDefault(require("../repository/packageRepo"));
const hostAuth_1 = require("../middleware/hostAuth");
const travelerRepo_1 = __importDefault(require("../repository/travelerRepo"));
const bookingRepo_1 = __importDefault(require("../repository/bookingRepo"));
const bookingUseCase_1 = __importDefault(require("../../useCase/bookingUseCase"));
const bookingController_1 = __importDefault(require("../../adaptors/bookingController"));
const travelerUseCase_1 = __importDefault(require("../../useCase/travelerUseCase"));
const cronJob_1 = __importDefault(require("../utils/cronJob"));
require("dotenv").config();
const generateOTP = new generateOtp_1.default();
const repository = new hostRepo_1.default();
const jwt = new jwt_1.default();
const bcrypt = new bcryption_1.default();
const sendMail = new email_1.default();
const OtpRepo = new otpRepo_1.default();
const packageRepo = new packageRepo_1.default();
const travelerRepo = new travelerRepo_1.default();
const bookingRepo = new bookingRepo_1.default();
const cronJob = new cronJob_1.default();
const hostUseCase = new hostUseCase_1.default(repository, generateOTP, sendMail, jwt, bcrypt, OtpRepo, travelerRepo);
const travelerUseCase = new travelerUseCase_1.default(travelerRepo, generateOTP, sendMail, jwt, bcrypt, OtpRepo);
const bookingUseCase = new bookingUseCase_1.default(bookingRepo, jwt, packageRepo, cronJob);
const packageUseCase = new packageUseCase_1.default(packageRepo, jwt);
const packageController = new packageController_1.default(packageUseCase);
const bookingController = new bookingController_1.default(bookingUseCase, hostUseCase, travelerUseCase, packageUseCase);
const controller = new hostController_1.default(hostUseCase, packageUseCase);
const router = express_1.default.Router();
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/verify_otp", (req, res) => {
    controller.AuthenticateHost(req, res);
});
router.post("/signup", (req, res) => {
    controller.SignUpAndSendOtp(req, res);
});
router.get("/resend_otp", (req, res) => controller.ResendOtp(req, res));
router.post("/login", (req, res) => {
    controller.Host_Login(req, res);
});
router.post("/google_login", (req, res) => {
    controller.googleAuthLogin(req, res);
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/create_package", hostAuth_1.hostAuth, (req, res) => {
    packageController.createPackage(req, res);
});
router.get("/package_list", hostAuth_1.hostAuth, (req, res) => packageController.getPackageListByHost(req, res));
router.patch("/package_details", hostAuth_1.hostAuth, (req, res) => packageController.fetchPackageDetails(req, res));
router.patch("/update_package", hostAuth_1.hostAuth, (req, res) => packageController.UpdatePackage(req, res));
router.get("/bookings", hostAuth_1.hostAuth, (req, res) => bookingController.getBookingsByPackage(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.patch("/forget_pass", (req, res) => controller.forgetPassSendOTP(req, res));
router.post("/confirm_forget_otp", (req, res) => controller.confirmForgetOTP(req, res));
router.post("/new_password", (req, res) => controller.updateHostPassword(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/profile", hostAuth_1.hostAuth, (req, res) => controller.getHostProfile(req, res));
router.post("/profile_update", hostAuth_1.hostAuth, (req, res) => controller.hostProfileUpdate(req, res));
router.post("/change_password", hostAuth_1.hostAuth, (req, res) => controller.hostChangePassword(req, res));
router.post("/create_password", hostAuth_1.hostAuth, (req, res) => controller.createPassword(req, res));
router.post("/profile_dp", hostAuth_1.hostAuth, (req, res) => controller.profilePicUpdate(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/dashboard", hostAuth_1.hostAuth, (req, res) => controller.dashboard(req, res));
router.get("/sales", hostAuth_1.hostAuth, (req, res) => controller.booking_report(req, res));
exports.default = router;
