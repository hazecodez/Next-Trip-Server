import Otp from "../../domain/otp";
import IOtp from "../../useCase/interface/IOtp";
import otpModel from "../database/otpModel";

class OtpRepository implements IOtp {
  async createOtpCollection(email: string, otp: string) {
    try {
      await otpModel.create({
        email: email,
        otp: otp,
      });
    } catch (error) {
      console.log("Error occured when create otp Collection : ", error);
    }
  }
  async getOtp(email: string): Promise<Otp | null> {
    try {
      const otp = await otpModel.findOne({ email: email });
      return otp ? otp : null;
    } catch (error) {
      throw error;
    }
  }
}

export default OtpRepository;
