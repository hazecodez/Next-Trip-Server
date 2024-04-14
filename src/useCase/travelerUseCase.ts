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

class TravelerUseCase {
  constructor(
    private repository: ITravelerRepo,
    private generateOtp: GenerateOTP,
    private sendMail: IMailer
  ) {
    this.repository = repository;
    this.generateOtp = generateOtp;
    this.sendMail = sendMail;
  }
  async signUpAndSendOtp(travelerData: traveler) {
    try {
      const travelerFound = this.repository.findTravelerByEmail(
        travelerData.email
      );
      // if(travelerFound) {
      //     return {status: false, message: "User is already exist."}
      // } else {

      // }
    } catch (error) {}
  }
}

export default TravelerUseCase;
