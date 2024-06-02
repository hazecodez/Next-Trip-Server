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
const node_cron_1 = __importDefault(require("node-cron"));
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
class CronJob {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.APP_PASS,
            },
        });
    }
    schedule(email, dateString, place) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetDate = new Date(dateString);
            const now = new Date();
            if (isNaN(targetDate.getTime())) {
                console.error("Invalid date format.");
                return;
            }
            const diffInMillis = targetDate.getTime() - now.getTime();
            if (diffInMillis < 0) {
                console.error("The target date is in the past.");
                return;
            }
            if (diffInMillis <= 24 * 60 * 60 * 1000) {
                // If the target date is within the next 24 hours, run the task immediately
                console.log("The target date is within the next 24 hours. Running the task immediately.");
                this.scheduledTask(email, place);
            }
            else {
                // Calculate the day before the target date
                const dayBefore = new Date(targetDate);
                dayBefore.setDate(targetDate.getDate() - 1);
                // Extract the time to schedule the cron job on the day before the target date
                const hours = targetDate.getHours();
                const minutes = targetDate.getMinutes();
                const day = dayBefore.getDate();
                const month = dayBefore.getMonth() + 1; // Months are zero-based in JavaScript
                const cronTime = `${minutes} ${hours} ${day} ${month} *`;
                if (node_cron_1.default.validate(cronTime)) {
                    node_cron_1.default.schedule(cronTime, () => {
                        this.scheduledTask(email, place);
                    });
                    console.log(`Cron job scheduled for ${email} on ${dayBefore.toLocaleDateString()} at ${hours}:${minutes}`);
                }
                else {
                    console.error("Invalid cron time format.");
                }
            }
        });
    }
    scheduledTask(to, place) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.GMAIL_ID,
                to: to,
                subject: `Your ${place} Journey Begins Tomorrow!`,
                html: `
        <div style="background-color: #f0f8ff; padding: 20px; text-align: center;">
          <h1 style="color: #333;">Your ${place} Journey Begins Tomorrow!</h1>
          <p style="color: #666; font-size: 16px;">
            Wishing you safe travels and looking forward to creating wonderful memories together!
          </p>
          <img src="https://img.freepik.com/premium-vector/cartoon-young-old-tourists-group-excursion-with-tour-guide-girl-with-flag-cityscape-background_208581-136.jpg" alt="Travel Image" style="width: 100%; max-width: 600px; height: auto;" />
        </div>
      `,
            };
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error Occured", error);
                }
                else {
                    console.log("Wishing Email sent : ", info.response);
                }
            });
        });
    }
}
exports.default = CronJob;
