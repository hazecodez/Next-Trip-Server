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
import IHostUseCase from "./interface/IHostUseCase";
import ITravelerRepo from "./interface/ITravelerRepo";
import { uploadSingleFile } from "../infrastructure/utils/cloudinary";

interface profileData {
  name?: string;
  email?: string;
  currPass?: string;
  newPass?: string;
}

class HostUseCase implements IHostUseCase {
  constructor(
    private repository: IHostRepo,
    private generateOtp: GenerateOTP,
    private sendMail: IMailer,
    private Jwt: Jwt,
    private bcryption: Bcrypt,
    private OtpRepo: OtpRepository,
    private travelerRepo: ITravelerRepo
  ) {
    this.repository = repository;
    this.generateOtp = generateOtp;
    this.sendMail = sendMail;
    this.Jwt = Jwt;
    this.bcryption = bcryption;
    this.OtpRepo = OtpRepo;
    this.travelerRepo = travelerRepo;
  }

  async signUpAndSendOtp(hostData: host) {
    try {
      const hostFound = await this.repository.findHostByEmail(hostData.email);
      if (hostFound) {
        return { status: false, message: "Host already exist." };
      } else {
        const payload: { email: string; role: string } = {
          email: hostData.email,
          role: "host",
        };
        const otp = this.generateOtp.generateOTP();
        this.sendMail.sendEmail(hostData.email, parseInt(otp));
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1m",
        });
        this.OtpRepo.createOtpCollection(hostData.email, otp);
        const hashed = await this.bcryption.Bcryption(hostData.password);
        hashed ? (hostData.password = hashed) : "";

        await this.repository.saveHostToDB(hostData);
        return { status: true, Token: jwtToken };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async authentication(token: string, otp: string) {
    try {
      const decodeToken = this.Jwt.verifyToken(token);
      if (decodeToken) {
        const fetchOtp = await this.OtpRepo.getOtp(decodeToken.email);

        if (fetchOtp?.otp === otp) {
          await this.repository.verifyHostEmail(decodeToken.email);
          return {
            status: true,
            message: `Your account is created wait for account verification by Admin.`,
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
  async Login(email: string, password: string) {
    try {
      let hostFound = await this.repository.findHostByEmail(email);
      if (hostFound) {
        const host = await this.repository.fetchHostData(email);

        if (!hostFound.emailVerified) {
          return {
            status: false,
            message: "Your Business Email is not verified!!",
          };
        } else if (!hostFound.isVerified) {
          return {
            status: false,
            message: "Your account isn't verified by Admin. Please wait.",
          };
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
        } else if (!exist.emailVerified) {
          return {
            status: false,
            message: "Your Business Email is not verified!!",
          };
        } else if (!exist.isVerified) {
          return {
            status: false,
            message: "Your account isn't verified by Admin. Please wait.",
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
        await this.repository.saveGoogleUser(credential);

        return {
          status: true,
          message:
            "Your account is created wait for account verification by Admin.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async forgetPassSendOTP(email: string) {
    try {
      const exist = await this.repository.fetchHostData(email);
      if (exist) {
        const otp = this.generateOtp.generateOTP();
        await this.sendMail.sendEmail(email, parseInt(otp));
        await this.OtpRepo.createOtpCollection(email, otp);
        const token = this.Jwt.createToken(exist._id, "hostForget");
        return { status: true, message: `Otp sent to ${email}`, token };
      } else {
        return { status: false, message: `You don't have account.` };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async confirmForgetOTP(token: string, otp: string) {
    try {
      let decodeToken = this.Jwt.verifyToken(token);
      const data = await this.repository.findHostById(decodeToken?.id);

      if (decodeToken) {
        let fetchOtp = await this.OtpRepo.getOtp(data?.email as string);

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
  async upadateHostPassword(token: string, password: string) {
    try {
      let decodeToken = this.Jwt.verifyToken(token);
      const hashedPass = await this.bcryption.Bcryption(password);
      const response = await this.repository.updateHostPassword(
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
  async updateHostWallet(Data: any, token: string): Promise<Boolean> {
    try {
      const user = this.Jwt.verifyToken(token);
      const traveler = await this.travelerRepo.findTravelerById(user?.id);
      const updated = await this.repository.creditedToWallet(Data, traveler);
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async debitedFromWallet(Data: any, travelerName: string, hostId: string) {
    try {
      const updated = await this.repository.debitedFromWallet(
        Data,
        travelerName,
        hostId
      );
      if (updated) return true;
    } catch (error) {
      console.log(error);
    }
  }
  async getHostProfile(token: string) {
    try {
      const host = this.Jwt.verifyToken(token);
      const Host = await this.repository.findHostById(host?.id);
      if (Host) {
        return { status: true, Host };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async hostProfileUpdate(token: string, data: profileData) {
    try {
      const user = this.Jwt.verifyToken(token);
      const update = await this.repository.updateProfile(data, user?.id);
      if (update) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(token: string, data: profileData) {
    try {
      const user = this.Jwt.verifyToken(token);
      const host = await this.repository.findHostById(user?.id);
      const correct = await this.bcryption.Encryption(
        data.currPass as string,
        host?.password as string
      );
      if (!correct) {
        return { status: false, message: "Enter valid current password" };
      } else {
        const hashed = await this.bcryption.Bcryption(data.newPass as string);
        const changed = await this.repository.updateHostPassword(
          user?.id,
          hashed ? hashed : ""
        );
        if (changed) {
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
      }
    } catch (error) {
      console.log(error);
    }
  }
  async createPassword(token: string, password: string) {
    try {
      const user = this.Jwt.verifyToken(token);
      const hashed = await this.bcryption.Bcryption(password as string);
      const created = await this.repository.updateHostPassword(
        user?.id,
        hashed ? hashed : ""
      );
      if (created) {
        return {
          status: true,
          message: "Password created successfully.",
        };
      } else {
        return {
          status: false,
          message: "Oops!! something went wrong.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async profilePicUpdate(token: string, image: string) {
    try {
      const publicId = await uploadSingleFile(image, "Hosts_Pics");
      const user = this.Jwt.verifyToken(token);
      const updated = await this.repository.profilePicUpdate(
        user?.id,
        publicId as string
      );
      if (updated) {
        return {
          status: true,
          message: "Profile Picture Updated Successfully",
        };
      } else {
        return {
          status: false,
          message: "Oops!! something went wrong.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default HostUseCase;
