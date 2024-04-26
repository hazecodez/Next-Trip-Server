import { Request, Response } from "express";

interface IHostController {
  SignUpAndSendOtp(req: Request, res: Response): Promise<void>;
  ResendOtp(req: Request, res: Response): Promise<void>;
  AuthenticateHost(req: Request, res: Response): Promise<void>;
  Host_Login(req: Request, res: Response): Promise<void>;
  googleAuthLogin(req: Request, res: Response): Promise<void>;
  forgetPassSendOTP(req: Request, res: Response): Promise<void>;
  confirmForgetOTP(req: Request, res: Response): Promise<void>;
  updateHostPassword(req: Request, res: Response): Promise<void>;
}

export default IHostController;
