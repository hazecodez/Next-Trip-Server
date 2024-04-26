import { Request, Response } from "express";

interface ITravelerController {
  SignUpAndSendOtp(req: Request, res: Response): Promise<void>;
  ResendOtp(req: Request, res: Response): Promise<void>;
  AuthenticateTraveler(req: Request, res: Response): Promise<void>;
  TravelerLogin(req: Request, res: Response): Promise<void>;
  googleAuthLogin(req: Request, res: Response): Promise<void>;
  forgetPassSendOTP(req: Request, res: Response): Promise<void>;
  confirmForgetOTP(req: Request, res: Response): Promise<void>;
  upadateTravelerPassword(req: Request, res: Response): Promise<void>;
}

export default ITravelerController;
