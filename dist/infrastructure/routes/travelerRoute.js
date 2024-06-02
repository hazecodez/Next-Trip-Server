"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const travelerController_1 = __importDefault(require("../../adaptors/travelerController"));
const travelerUseCase_1 = __importDefault(require("../../useCase/travelerUseCase"));
const generateOtp_1 = __importDefault(require("../utils/generateOtp"));
const travelerRepo_1 = __importDefault(require("../repository/travelerRepo"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const bcryption_1 = __importDefault(require("../utils/bcryption"));
const otpRepo_1 = __importDefault(require("../repository/otpRepo"));
const email_1 = __importDefault(require("../utils/email"));
const packageRepo_1 = __importDefault(require("../repository/packageRepo"));
const packageController_1 = __importDefault(require("../../adaptors/packageController"));
const packageUseCase_1 = __importDefault(require("../../useCase/packageUseCase"));
const conversationRepository_1 = __importDefault(require("../repository/conversationRepository"));
const messageRepo_1 = __importDefault(require("../repository/messageRepo"));
const chatUseCase_1 = __importDefault(require("../../useCase/chatUseCase"));
const chatController_1 = __importDefault(require("../../adaptors/chatController"));
const userAuth_1 = require("../middleware/userAuth");
const hostUseCase_1 = __importDefault(require("../../useCase/hostUseCase"));
const hostRepo_1 = __importDefault(require("../repository/hostRepo"));
const bookingRepo_1 = __importDefault(require("../repository/bookingRepo"));
const bookingUseCase_1 = __importDefault(require("../../useCase/bookingUseCase"));
const bookingController_1 = __importDefault(require("../../adaptors/bookingController"));
const blogUseCase_1 = __importDefault(require("../../useCase/blogUseCase"));
const blogController_1 = __importDefault(require("../../adaptors/blogController"));
const blogRepository_1 = __importDefault(require("../repository/blogRepository"));
const cronJob_1 = __importDefault(require("../utils/cronJob"));
const generateOTP = new generateOtp_1.default();
const TravelerRepository = new travelerRepo_1.default();
const jwt = new jwt_1.default();
const bcrypt = new bcryption_1.default();
const sendMail = new email_1.default();
const OtpRepo = new otpRepo_1.default();
const packageRepo = new packageRepo_1.default();
const MessageRepo = new messageRepo_1.default();
const CoversationRepo = new conversationRepository_1.default();
const hostRepository = new hostRepo_1.default();
const bookingRepo = new bookingRepo_1.default();
const blogRepo = new blogRepository_1.default();
const cronJob = new cronJob_1.default();
const travelerUseCase = new travelerUseCase_1.default(TravelerRepository, generateOTP, sendMail, jwt, bcrypt, OtpRepo);
const hostUseCase = new hostUseCase_1.default(hostRepository, generateOTP, sendMail, jwt, bcrypt, OtpRepo, TravelerRepository);
const bookingUseCase = new bookingUseCase_1.default(bookingRepo, jwt, packageRepo, cronJob);
const blogUseCase = new blogUseCase_1.default(blogRepo, jwt);
const blogController = new blogController_1.default(blogUseCase);
const ChatUseCase = new chatUseCase_1.default(CoversationRepo, MessageRepo);
const ChatController = new chatController_1.default(ChatUseCase, jwt);
const packageUseCase = new packageUseCase_1.default(packageRepo, jwt);
const packageController = new packageController_1.default(packageUseCase);
const bookingController = new bookingController_1.default(bookingUseCase, hostUseCase, travelerUseCase, packageUseCase);
const controller = new travelerController_1.default(travelerUseCase);
const router = express_1.default.Router();
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/verify_otp", (req, res) => {
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
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.patch("/forget_pass", (req, res) => controller.forgetPassSendOTP(req, res));
router.post("/confirm_forget_otp", (req, res) => controller.confirmForgetOTP(req, res));
router.post("/new_password", (req, res) => controller.upadateTravelerPassword(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/package_list", userAuth_1.travelerAuth, (req, res) => packageController.fetchAllPackages(req, res));
router.patch("/package_details", userAuth_1.travelerAuth, (req, res) => packageController.fetchPackageDetails(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/new_conversation", userAuth_1.travelerAuth, (req, res) => ChatController.newConversation(req, res));
router.get("/get_conversations", userAuth_1.travelerAuth, (req, res) => ChatController.getConversations(req, res));
router.post("/new_message", userAuth_1.travelerAuth, (req, res) => ChatController.addMessage(req, res));
router.patch("/get_messages", userAuth_1.travelerAuth, (req, res) => ChatController.getMessages(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.patch("/find_user", userAuth_1.travelerAuth, (req, res) => ChatController.findUserById(req, res));
router.post("/package_booking", userAuth_1.travelerAuth, (req, res) => bookingController.bookPackage(req, res));
router.get("/booked_packages", userAuth_1.travelerAuth, (req, res) => bookingController.getBookingsByUser(req, res));
router.patch("/cancel_booking", userAuth_1.travelerAuth, (req, res) => bookingController.cancelBooking(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/profile", userAuth_1.travelerAuth, (req, res) => controller.travelerProfile(req, res));
router.post("/profile_update", userAuth_1.travelerAuth, (req, res) => controller.profileUpdate(req, res));
router.post("/change_password", userAuth_1.travelerAuth, (req, res) => controller.changePassword(req, res));
router.post("/create_password", userAuth_1.travelerAuth, (req, res) => controller.createPassword(req, res));
router.post("/profile_dp", userAuth_1.travelerAuth, (req, res) => controller.profilePicUpdate(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
router.post("/create_blog", userAuth_1.travelerAuth, (req, res) => blogController.createBlog(req, res));
router.get("/blogs", userAuth_1.travelerAuth, (req, res) => blogController.fetchAllBlogs(req, res));
router.patch("/blog_details", userAuth_1.travelerAuth, (req, res) => blogController.fetchBlogDetails(req, res));
router.patch("/like_unlike_blog", userAuth_1.travelerAuth, (req, res) => blogController.likeAndUnlikeBlogByUser(req, res));
router.patch("/comment_blog", userAuth_1.travelerAuth, (req, res) => blogController.commentBlogByUser(req, res));
router.get("/blogs_by_user", userAuth_1.travelerAuth, (req, res) => blogController.fetchBlogsByUser(req, res));
router.patch("/remove_blog", userAuth_1.travelerAuth, (req, res) => blogController.removeBlogByUser(req, res));
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
exports.default = router;
