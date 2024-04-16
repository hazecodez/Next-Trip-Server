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

  async authentication(token: string, otp: string) {
    try {
      let decodeToken = this.Jwt.verifyToken(token);
      if (decodeToken) {
        let fetchOtp = await this.OtpRepo.getOtp(decodeToken.email);
        if (fetchOtp) {
          if (fetchOtp.otp === otp) {
            let travelerToken = this.Jwt.createToken(
              decodeToken._id,
              "traveler"
            );
            let travelerData = await this.repository.fetchTravelerData(
              decodeToken.email
            );
            await this.repository.verifyTraveler(decodeToken.email);
            return {
              status: true,
              token: travelerToken,
              travelerData,
            };
          } else {
            return { status: false, message: "Invalid otp" };
          }
        } else {
          return { status: false, message: "OTP has been expired" };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async Login(email: string, password: string) {
    let travalerFound = await this.repository.findTravelerByEmail(email);

    if (travalerFound) {
      const traveler = await this.repository.fetchTravelerData(email);

      if (!travalerFound?.isVerified) {
        return { status: false, message: "Account is not verified!!" };
      }
      const correct = await this.bcryption.Encryption(
        password,
        travalerFound.password
      );
      if (!correct) {
        return { status: false, message: "Whhoops!! Incorrect password" };
      } else if (travalerFound.isBlocked) {
        return { status: false, message: "You can't access this account!!" };
      } else {
        const token = this.Jwt.createToken(travalerFound._id, "traveler");
        return {
          status: true,
          token,
          traveler,
          message: `Welcome to Next-Trip Personal Account.`,
        };
      }
    } else {
      return { status: false, message: "Please create an account." };
    }
  }
}

export default TravelerUseCase;
