import express from "express";
import GenerateOTP from "../utils/generateOtp";
import NodeMailer from "../utils/email";
import Bcrypt from "../utils/bcryption";
import OtpRepository from "../repository/otpRepo";
import Jwt from "../utils/jwt";
import HostUseCase from "../../useCase/hostUseCase";
import HostRepo from "../repository/hostRepo";
import HostController from "../../adaptors/hostController";
import PackageController from "../../adaptors/packageController";
import PackageUseCase from "../../useCase/packageUseCase";
import PackageRepo from "../repository/packageRepo";
import { hostAuth } from "../middleware/hostAuth";
import TravelerRepo from "../repository/travelerRepo";
import BookingRepo from "../repository/bookingRepo";
import BookingUseCase from "../../useCase/bookingUseCase";
import BookingController from "../../adaptors/bookingController";
import TravelerUseCase from "../../useCase/travelerUseCase";
import CronJob from "../utils/cronJob";

require("dotenv").config();

const generateOTP = new GenerateOTP();
const repository = new HostRepo();
const jwt = new Jwt();
const bcrypt = new Bcrypt();
const sendMail = new NodeMailer();
const OtpRepo = new OtpRepository();
const packageRepo = new PackageRepo();
const travelerRepo = new TravelerRepo();
const bookingRepo = new BookingRepo();
const cronJob = new CronJob();

const hostUseCase = new HostUseCase(
  repository,
  generateOTP,
  sendMail,
  jwt,
  bcrypt,
  OtpRepo,
  travelerRepo
);
const travelerUseCase = new TravelerUseCase(
  travelerRepo,
  generateOTP,
  sendMail,
  jwt,
  bcrypt,
  OtpRepo
);
const bookingUseCase = new BookingUseCase(
  bookingRepo,
  jwt,
  packageRepo,
  cronJob
);

const packageUseCase = new PackageUseCase(packageRepo, jwt);
const packageController = new PackageController(packageUseCase);
const bookingController = new BookingController(
  bookingUseCase,
  hostUseCase,
  travelerUseCase,
  packageUseCase
);

const controller = new HostController(hostUseCase);

const router = express.Router();

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

router.post("/create_package", hostAuth, (req, res) => {
  packageController.createPackage(req, res);
});
router.get("/package_list", hostAuth, (req, res) =>
  packageController.getPackageListByHost(req, res)
);
router.patch("/package_details", hostAuth, (req, res) =>
  packageController.fetchPackageDetails(req, res)
);
router.patch("/update_package", hostAuth, (req, res) =>
  packageController.UpdatePackage(req, res)
);
router.get("/bookings", hostAuth, (req, res) =>
  bookingController.getBookingsByPackage(req, res)
);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.patch("/forget_pass", (req, res) =>
  controller.forgetPassSendOTP(req, res)
);
router.post("/confirm_forget_otp", (req, res) =>
  controller.confirmForgetOTP(req, res)
);
router.post("/new_password", (req, res) =>
  controller.updateHostPassword(req, res)
);
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.get("/profile", hostAuth, (req, res) =>
  controller.getHostProfile(req, res)
);
router.post("/profile_update", hostAuth, (req, res) =>
  controller.hostProfileUpdate(req, res)
);
router.post("/change_password", hostAuth, (req, res) =>
  controller.hostChangePassword(req, res)
);
router.post("/create_password", hostAuth, (req, res) =>
  controller.createPassword(req, res)
);
router.post("/profile_dp", hostAuth, (req, res) =>
  controller.profilePicUpdate(req, res)
);

export default router;
