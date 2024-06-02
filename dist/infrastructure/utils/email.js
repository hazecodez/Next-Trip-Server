"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
class NodeMailer {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.APP_PASS,
            },
        });
    }
    sendEmail(to, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            let mailOptions = {
                from: process.env.GMAIL_ID,
                to: to,
                subject: "One Time Password for Next-Trip Account Verification",
                text: `Your Otp number is ${otp}`,
            };
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error Occured", error);
                }
                else {
                    console.log("Email sent : ", info.response);
                }
            });
        });
    }
}
exports.default = NodeMailer;
