import traveler from "../../domain/traveler";

interface ITravelerUseCase {
  signUpAndSendOtp(travelerData: traveler): Promise<any>;
  authentication(token: string, otp: string): Promise<any>;
  forgetPassSendOTP(email: string): Promise<any>;
  confirmForgetOTP(token: string, otp: string): Promise<any>;
  resendOtp(token: string): Promise<any>;
  Login(email: string, password: string): Promise<any>;
  googleAuthLogin(credential: any): Promise<any>;
  upadateTravelerPassword(token: string, password: string): Promise<any>;
}

export default ITravelerUseCase;
