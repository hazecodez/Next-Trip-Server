import Otp from "../../domain/otp";

interface IOtp {
  createOtpCollection(email: string, otp: string):any;
  getOtp(email: string): Promise<Otp | null>;
}

export default IOtp;
