import traveler from "../domain/traveler";
import ITravelerRepo from "./interface/ITravelerRepo";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import GenerateOTP from "../infrastructure/utils/generateOtp";
import IMailer from "./interface/IMailer";
import Bcrypt from "../infrastructure/utils/bcryption";
import Jwt from "../infrastructure/utils/jwt";
import jwt from "jsonwebtoken";
import OtpRepository from "../infrastructure/repository/otpRepo";

class TravelerUseCase {
  constructor(
    private repository: ITravelerRepo,
    private generateOtp: GenerateOTP,
    private sendMail: IMailer,
    private Jwt: Jwt,
    private bcryption: Bcrypt,
    private OtpRepo: OtpRepository
  ) {
    this.repository = repository;
    this.generateOtp = generateOtp;
    this.sendMail = sendMail;
    this.Jwt = Jwt;
    this.bcryption = bcryption;
    this.OtpRepo = OtpRepo;
  }
  async signUpAndSendOtp(travelerData: traveler) {
    try {
      const travelerFound = await this.repository.findTravelerByEmail(
        travelerData.email
      );
      if (travelerFound) {
        return { status: false, message: "User already exist." };
      } else {
        let payload: { email: string; role: string } = {
          email: travelerData.email,
          role: "traveler",
        };
        let otp = this.generateOtp.generateOTP();
        this.sendMail.sendEmail(travelerData.email, parseInt(otp));
        let jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1m",
        });
        this.OtpRepo.createOtpCollection(travelerData.email, otp);
        let hashed = await this.bcryption.Bcryption(travelerData.password);
        hashed ? (travelerData.password = hashed) : "";

        await this.repository.saveTravelerToDB(travelerData);
        return { status: true, Token: jwtToken };
      }
    } catch (error) {
      throw error;
    }
  }
}

export default TravelerUseCase;
