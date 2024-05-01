import express from "express";
import TravelerController from "../../adaptors/travelerController";
import TravelerUseCase from "../../useCase/travelerUseCase";
import GenerateOTP from "../utils/generateOtp";
import TravelerRepo from "../repository/travelerRepo";
import Jwt from "../utils/jwt";
import Bcrypt from "../utils/bcryption";
import OtpRepository from "../repository/otpRepo";
import NodeMailer from "../utils/email";
import PackageRepo from "../repository/packageRepo";
import PackageController from "../../adaptors/packageController";
import PackageUseCase from "../../useCase/packageUseCase";
import conversationRepository from "../repository/conversationRepository";
import messageRepo from "../repository/messageRepo";
import chatUseCase from "../../useCase/chatUseCase";
import chatController from "../../adaptors/chatController";
import { travelerAuth } from "../middleware/userAuth";

const generateOTP = new GenerateOTP();
const repository = new TravelerRepo();
const jwt = new Jwt();
const bcrypt = new Bcrypt();
const sendMail = new NodeMailer();
const OtpRepo = new OtpRepository();
const packageRepo = new PackageRepo();
const MessageRepo = new messageRepo();
const CoversationRepo = new conversationRepository();

const travelerUseCase = new TravelerUseCase(
  repository,
  generateOTP,
  sendMail,
  jwt,
  bcrypt,
  OtpRepo
);

const ChatUseCase = new chatUseCase(CoversationRepo, MessageRepo);
const ChatController = new chatController(ChatUseCase, jwt);

const packageUseCase = new PackageUseCase(packageRepo, jwt);
const packageController = new PackageController(packageUseCase);

const controller = new TravelerController(travelerUseCase);
const router = express.Router();

router.post("/verify_otp", (req, res) => {
  console.log("eth");

  controller.AuthenticateTraveler(req, res);
});
router.post("/signup", (req, res) => {
  controller.SignUpAndSendOtp(req, res);
});
router.get("/resend_otp", (req, res) => controller.ResendOtp(req, res));
router.post("/login", (req, res) => {
  controller.TravelerLogin(req, res);
});
router.post("/google_login", (req, res) => {
  controller.googleAuthLogin(req, res);
});

router.patch("/forget_pass", (req, res) =>
  controller.forgetPassSendOTP(req, res)
);
router.post("/confirm_forget_otp", (req, res) =>
  controller.confirmForgetOTP(req, res)
);
router.post("/new_password", (req, res) =>
  controller.upadateTravelerPassword(req, res)
);

router.get("/package_list", travelerAuth, (req, res) =>
  packageController.fetchAllPackages(req, res)
);
router.patch("/package_details", travelerAuth, (req, res) =>
  packageController.fetchPackageDetails(req, res)
);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/new_conversation", travelerAuth, (req, res) =>
  ChatController.newConversation(req, res)
);
router.get("/get_conversations", travelerAuth, (req, res) =>
  ChatController.getConversations(req, res)
);
router.post("/new_message", travelerAuth, (req, res) =>
  ChatController.addMessage(req, res)
);
router.patch("/get_messages", travelerAuth, (req, res) =>
  ChatController.getMessages(req, res)
);
router.patch("/find_user", travelerAuth, (req, res) =>
  ChatController.findUserById(req, res)
);

export default router;
