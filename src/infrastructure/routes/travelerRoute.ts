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
import HostUseCase from "../../useCase/hostUseCase";
import HostRepo from "../repository/hostRepo";
import BookingRepo from "../repository/bookingRepo";
import BookingUseCase from "../../useCase/bookingUseCase";
import BookingController from "../../adaptors/bookingController";
import BlogUseCase from "../../useCase/blogUseCase";
import BlogController from "../../adaptors/blogController";
import BlogRepo from "../repository/blogRepository";
import CronJob from "../utils/cronJob";

const generateOTP = new GenerateOTP();
const TravelerRepository = new TravelerRepo();
const jwt = new Jwt();
const bcrypt = new Bcrypt();
const sendMail = new NodeMailer();
const OtpRepo = new OtpRepository();
const packageRepo = new PackageRepo();
const MessageRepo = new messageRepo();
const CoversationRepo = new conversationRepository();
const hostRepository = new HostRepo();
const bookingRepo = new BookingRepo();
const blogRepo = new BlogRepo();
const cronJob = new CronJob();

const travelerUseCase = new TravelerUseCase(
  TravelerRepository,
  generateOTP,
  sendMail,
  jwt,
  bcrypt,
  OtpRepo
);
const hostUseCase = new HostUseCase(
  hostRepository,
  generateOTP,
  sendMail,
  jwt,
  bcrypt,
  OtpRepo,
  TravelerRepository
);
const bookingUseCase = new BookingUseCase(
  bookingRepo,
  jwt,
  packageRepo,
  cronJob
);
const blogUseCase = new BlogUseCase(blogRepo, jwt);
const blogController = new BlogController(blogUseCase);

const ChatUseCase = new chatUseCase(CoversationRepo, MessageRepo);
const ChatController = new chatController(ChatUseCase, jwt);

const packageUseCase = new PackageUseCase(packageRepo, jwt);
const packageController = new PackageController(packageUseCase);

const bookingController = new BookingController(
  bookingUseCase,
  hostUseCase,
  travelerUseCase,
  packageUseCase
);

const controller = new TravelerController(travelerUseCase);
const router = express.Router();

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.post("/verify_otp", (req, res) => {
  controller.AuthenticateTraveler(req, res);
});
router.post("/signup", (req, res) => {
  controller.SignUpAndSendOtp(req, res);
});
router.post("/resend_otp", (req, res) => controller.ResendOtp(req, res));
router.post("/login", (req, res) => {
  controller.TravelerLogin(req, res);
});
router.post("/google_login", (req, res) => {
  controller.googleAuthLogin(req, res);
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.patch("/forget_pass", (req, res) =>
  controller.forgetPassSendOTP(req, res)
);
router.post("/confirm_forget_otp", (req, res) =>
  controller.confirmForgetOTP(req, res)
);
router.post("/new_password", (req, res) =>
  controller.upadateTravelerPassword(req, res)
);
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.get("/package_list", travelerAuth, (req, res) =>
  packageController.fetchAllPackages(req, res)
);
router.patch("/package_details", travelerAuth, (req, res) =>
  packageController.fetchPackageDetails(req, res)
);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.patch("/new_conversation", travelerAuth, (req, res) =>
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

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.patch("/find_user", travelerAuth, (req, res) =>
  ChatController.findUserById(req, res)
);
router.post("/package_booking", travelerAuth, (req, res) =>
  bookingController.bookPackage(req, res)
);
router.get("/booked_packages", travelerAuth, (req, res) =>
  bookingController.getBookingsByUser(req, res)
);
router.patch("/cancel_booking", travelerAuth, (req, res) =>
  bookingController.cancelBooking(req, res)
);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.get("/profile", travelerAuth, (req, res) =>
  controller.travelerProfile(req, res)
);
router.post("/profile_update", travelerAuth, (req, res) =>
  controller.profileUpdate(req, res)
);
router.post("/change_password", travelerAuth, (req, res) =>
  controller.changePassword(req, res)
);
router.post("/create_password", travelerAuth, (req, res) =>
  controller.createPassword(req, res)
);
router.post("/profile_dp", travelerAuth, (req, res) =>
  controller.profilePicUpdate(req, res)
);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

router.post("/create_blog", travelerAuth, (req, res) =>
  blogController.createBlog(req, res)
);
router.get("/blogs", travelerAuth, (req, res) =>
  blogController.fetchAllBlogs(req, res)
);
router.patch("/blog_details", travelerAuth, (req, res) =>
  blogController.fetchBlogDetails(req, res)
);
router.patch("/like_unlike_blog", travelerAuth, (req, res) =>
  blogController.likeAndUnlikeBlogByUser(req, res)
);
router.patch("/comment_blog", travelerAuth, (req, res) =>
  blogController.commentBlogByUser(req, res)
);
router.get("/blogs_by_user", travelerAuth, (req, res) =>
  blogController.fetchBlogsByUser(req, res)
);
router.patch("/remove_blog", travelerAuth, (req, res) =>
  blogController.removeBlogByUser(req, res)
);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

export default router;
