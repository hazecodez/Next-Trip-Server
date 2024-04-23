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

require("dotenv").config();

let generateOTP = new GenerateOTP();
let repository = new HostRepo();
let jwt = new Jwt();
let bcrypt = new Bcrypt();
let sendMail = new NodeMailer();
let OtpRepo = new OtpRepository();
let packageRepo = new PackageRepo();

let hostUseCase = new HostUseCase(
  repository,
  generateOTP,
  sendMail,
  jwt,
  bcrypt,
  OtpRepo
);
let packageUseCase = new PackageUseCase(packageRepo, jwt);
const packageController = new PackageController(packageUseCase);

const controller = new HostController(hostUseCase);

const router = express.Router();

router.post("/verify_otp", (req, res) => {
  controller.AuthenticateHost(req, res);
});
router.post("/signup", (req, res) => {
  controller.SignUpAndSendOtp(req, res);
});
router.get("/resend_otp", (req, res) => controller.ResendOtp(req, res));
router.post("/login", (req, res) => {
  controller.HostLogin(req, res);
});
router.post("/google_login", (req, res) => {
  controller.googleAuthLogin(req, res);
});
router.post("/create_package", (req, res) => {
  packageController.createPackage(req, res);
});
router.get("/package_list", (req, res) =>
  packageController.getPackageListByHost(req, res)
);
router.patch("/package_details", (req, res) =>
  packageController.fetchPackageDetails(req, res)
);
router.patch("/update_package", (req, res) =>
  packageController.UpdatePackage(req, res)
);
router.patch("/forget_pass", (req, res) =>
  controller.forgetPassSendOTP(req, res)
);
router.post("/confirm_forget_otp", (req, res) =>
  controller.confirmForgetOTP(req, res)
);
router.post("/new_password", (req, res) =>
  controller.upadateHostPassword(req, res)
);

export default router;
