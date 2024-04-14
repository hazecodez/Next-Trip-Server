import nodemailer from "nodemailer";
import IMailer from "../../useCase/interface/IMailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

class NodeMailer implements IMailer {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.APP_PASS,
      },
    });
  }
  async sendEmail(to: string, otp: number): Promise<any> {
    let mailOptions = {
      from: process.env.GMAIL_ID,
      to: to,
      subject: "One Time Password for Next-Trip Account Verification",
      text: `Your Otp number is ${otp}`,
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error Occured", error);
      } else {
        console.log("Email sent : ", info.response);
      }
    });
  }
}

export default NodeMailer;
