import host from "../domain/host";
import IHostRepo from "./interface/IHostRepo";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import GenerateOTP from "../infrastructure/utils/generateOtp";
import IMailer from "./interface/IMailer";
import Bcrypt from "../infrastructure/utils/bcryption";
import Jwt from "../infrastructure/utils/jwt";
import jwt from "jsonwebtoken";
import OtpRepository from "../infrastructure/repository/otpRepo";

class HostUseCase {
  constructor(
    private repository: IHostRepo,
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

  async signUpAndSendOtp(hostData: host) {
    try {
      const hostFound = await this.repository.findHostByEmail(hostData.email);
      if (hostFound) {
        return { status: false, message: "Host already exist." };
      } else {
        let payload: { email: string; role: string } = {
          email: hostData.email,
          role: "host",
        };
        let otp = this.generateOtp.generateOTP();
        this.sendMail.sendEmail(hostData.email, parseInt(otp));
        let jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1m",
        });
        this.OtpRepo.createOtpCollection(hostData.email, otp);
        let hashed = await this.bcryption.Bcryption(hostData.password);
        hashed ? (hostData.password = hashed) : "";

        await this.repository.saveHostToDB(hostData);
        return { status: true, Token: jwtToken };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async resendOtp(token: string) {
    try {
      let decodeToken = this.Jwt.verifyToken(token);
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
  async authentication(token: string, otp: string) {
    try {
      let decodeToken = this.Jwt.verifyToken(token);
      if (decodeToken) {
        let fetchOtp = await this.OtpRepo.getOtp(decodeToken.email);

        if (fetchOtp?.otp === otp) {
          let hostToken = this.Jwt.createToken(decodeToken._id, "host");

          let hostData = await this.repository.fetchHostData(decodeToken.email);

          await this.repository.verifyHost(decodeToken.email);

          return {
            status: true,
            token: hostToken,
            hostData,
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

  async Login(email: string, password: string) {
    try {
      let hostFound = await this.repository.findHostByEmail(email);
      if (hostFound) {
        const host = await this.repository.fetchHostData(email);

        if (!hostFound.isVerified) {
          return { status: false, message: "Account is not verified!!" };
        }
        const correct = await this.bcryption.Encryption(
          password,
          hostFound.password
        );
        if (!correct) {
          return { status: false, message: "Whhoops!! Incorrect password" };
        } else if (hostFound.isBlocked) {
          return { status: false, message: "You can't access this account!!" };
        } else {
          const token = this.Jwt.createToken(hostFound._id, "host");
          return {
            status: true,
            token,
            host,
            message: `Welcome to Next-Trip MyBIZ Account.`,
          };
        }
      } else {
        return { status: false, message: "Please create an account." };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async googleAuthLogin(credential: any) {
    try {
      const { email } = credential;
      const exist = await this.repository.findHostByEmail(email);
      if (exist) {
        if (exist.isBlocked) {
          return {
            status: false,
            message: "You can't access this account!!",
          };
        } else {
          const hostData = await this.repository.fetchHostData(email);
          const token = this.Jwt.createToken(hostData?._id, "host");
          return {
            status: true,
            hostData,
            token,
            message: `Welcome to Next-Trip MyBIZ Account.`,
          };
        }
      } else {
        const host = await this.repository.saveGoogleUser(credential);
        const token = this.Jwt.createToken(host?._id, "host");
        const hostData = await this.repository.fetchHostData(email);
        return {
          status: true,
          hostData,
          message: "Welcome to Next-Trip MyBIZ Account.",
          token,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default HostUseCase;
