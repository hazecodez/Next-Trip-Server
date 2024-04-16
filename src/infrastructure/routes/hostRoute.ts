import express from "express";
import GenerateOTP from "../utils/generateOtp";
import NodeMailer from "../utils/email";
import Bcrypt from "../utils/bcryption";
import OtpRepository from "../repository/otpRepo";
import Jwt from "../utils/jwt";
import HostUseCase from "../../useCase/hostUseCase";
import HostRepo from "../repository/hostRepo";
import HostController from "../../adaptors/hostController";

let generateOTP = new GenerateOTP();
let repository = new HostRepo();
let jwt = new Jwt();
let bcrypt = new Bcrypt();
let sendMail = new NodeMailer();
let OtpRepo = new OtpRepository();

let hostUseCase = new HostUseCase(
  repository,
  generateOTP,
  sendMail,
  jwt,
  bcrypt,
  OtpRepo
);

const controller = new HostController(hostUseCase);
const router = express.Router();

router.post("/verify_otp", (req, res) => {
  controller.AuthenticateHost(req, res);
});
router.post("/signup", (req, res) => {
  controller.SignUpAndSendOtp(req, res);
});
router.post("/login", (req, res) => {
  controller.HostLogin(req, res);
});

export default router;
