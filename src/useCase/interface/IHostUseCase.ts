import host from "../../domain/host";

interface IHostUseCase {
  signUpAndSendOtp(hostData: host): Promise<any>;
  authentication(token: string, otp: string): Promise<any>;
  resendOtp(token: string): Promise<any>;
  Login(email: string, password: string): Promise<any>;
  googleAuthLogin(credential: any): Promise<any>;
  forgetPassSendOTP(email: string): Promise<any>;
  confirmForgetOTP(token: string, otp: string): Promise<any>;
  upadateHostPassword(token: string, password: string): Promise<any>;
}

export default IHostUseCase;
