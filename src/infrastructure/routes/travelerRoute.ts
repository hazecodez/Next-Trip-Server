import express from "express";
import TravelerController from "../../adaptors/travelerController";
import TravelerUseCase from "../../useCase/travelerUseCase";
import GenerateOTP from "../utils/generateOtp";
import TravelerRepo from "../repository/travelerRepo";
import Jwt from "../utils/jwt";
import Bcrypt from "../utils/bcryption";
import OtpRepository from "../repository/otpRepo";
import NodeMailer from "../utils/email";

let generateOTP = new GenerateOTP();
let repository = new TravelerRepo();
let jwt = new Jwt();
let bcrypt = new Bcrypt();
let sendMail = new NodeMailer();
let OtpRepo = new OtpRepository();

let travelerUseCase = new TravelerUseCase(
  repository,
  generateOTP,
  sendMail,
  jwt,
  bcrypt,
  OtpRepo
);

let controller = new TravelerController(travelerUseCase);
const router = express.Router();

router.post("/signup", (req, res) => {
  controller.SignUpAndSendOtp(req, res);
});

export default router;
