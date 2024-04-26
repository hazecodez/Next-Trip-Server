import traveler from "../domain/traveler";
import ITravelerRepo from "./interface/ITravelerRepo";
import ITravelerUseCase from "./interface/ITravelerUseCase";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import GenerateOTP from "../infrastructure/utils/generateOtp";
import IMailer from "./interface/IMailer";
import Bcrypt from "../infrastructure/utils/bcryption";
import Jwt from "../infrastructure/utils/jwt";
import jwt from "jsonwebtoken";
import OtpRepository from "../infrastructure/repository/otpRepo";

class TravelerUseCase implements ITravelerUseCase {
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
        const payload: { email: string; role: string } = {
          email: travelerData.email,
          role: "traveler",
        };
        const otp = this.generateOtp.generateOTP();
        this.sendMail.sendEmail(travelerData.email, parseInt(otp));
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1m",
        });
        this.OtpRepo.createOtpCollection(travelerData.email, otp);
        const hashed = await this.bcryption.Bcryption(travelerData.password);
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
      const decodeToken = this.Jwt.verifyToken(token);
      if (decodeToken) {
        const fetchOtp = await this.OtpRepo.getOtp(decodeToken.email);
        if (fetchOtp) {
          if (fetchOtp?.otp === otp) {
            const travelerToken = this.Jwt.createToken(
              decodeToken._id,
              "traveler"
            );
            const travelerData = await this.repository.fetchTravelerData(
              decodeToken.email
            );
            await this.repository.verifyTraveler(decodeToken.email);
            return {
              status: true,
              token: travelerToken,
              travelerData,
              message: `Welcome ${travelerData?.name} to Next-Trip Website`,
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

  async forgetPassSendOTP(email: string) {
    try {
      const exist = await this.repository.fetchTravelerData(email);
      if (exist) {
        const otp = this.generateOtp.generateOTP();
        await this.sendMail.sendEmail(email, parseInt(otp));
        await this.OtpRepo.createOtpCollection(email, otp);
        const token = this.Jwt.createToken(exist._id, "travelerForget");
        return { status: true, message: `Otp re-sent to ${email}`, token };
      } else {
        return { status: false, message: `You don't have account.` };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async confirmForgetOTP(token: string, otp: string) {
    try {
      const decodeToken = this.Jwt.verifyToken(token);
      const data = await this.repository.findTravelerById(decodeToken?.id);
      if (decodeToken) {
        const fetchOtp = await this.OtpRepo.getOtp(data?.email as string);

        if (fetchOtp?.otp === otp) {
          return {
            status: true,
            message: `You can update your password now.`,
          };
        } else {
          return { status: false, message: "Invalid otp" };
        }
      } else {
        return { status: false, message: "OTP has been expired" };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async resendOtp(token: string) {
    try {
      const decodeToken = this.Jwt.verifyToken(token);
      if (decodeToken) {
        const otp = this.generateOtp.generateOTP();
        await this.sendMail.sendEmail(decodeToken.email, parseInt(otp));
        await this.OtpRepo.createOtpCollection(decodeToken.email, otp);
        return { status: true, message: `Otp re-sent to ${decodeToken.email}` };
      } else {
        return {
          status: false,
          message: "Something went wrong please re-register your account.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async Login(email: string, password: string) {
    const travalerFound = await this.repository.findTravelerByEmail(email);

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

  async googleAuthLogin(credential: any) {
    try {
      const { email } = credential;
      const exist = await this.repository.findTravelerByEmail(email);
      if (exist) {
        if (exist.isBlocked) {
          return {
            status: false,
            message: "You can't access this account!!",
          };
        } else {
          const travelerData = await this.repository.fetchTravelerData(email);
          const token = this.Jwt.createToken(travelerData?._id, "traveler");
          return {
            status: true,
            travelerData,
            message: "Welcome to Next-Trip Personal Account.",
            token,
          };
        }
      } else {
        const traveler = await this.repository.saveGoogleUser(credential);
        const token = this.Jwt.createToken(traveler?._id, "traveler");
        const travelerData = await this.repository.fetchTravelerData(email);
        return {
          status: true,
          travelerData,
          message: "Welcome to Next-Trip Personal Account.",
          token,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async upadateTravelerPassword(token: string, password: string) {
    try {
      const decodeToken = this.Jwt.verifyToken(token);
      const hashedPass = await this.bcryption.Bcryption(password);
      const response = await this.repository.updateTravelerPassword(
        decodeToken?.id,
        hashedPass ? hashedPass : ""
      );
      if (response) {
        return {
          status: true,
          message: `Successfully updated your password`,
        };
      } else {
        return {
          status: false,
          message: `Oops! something went wrong.`,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default TravelerUseCase;
