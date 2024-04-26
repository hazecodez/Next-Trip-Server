import { Request, Response } from "express";
import HostUseCase from "../useCase/hostUseCase";
import IHostController from "../useCase/interface/IHostCon";

class HostController implements IHostController {
  private hostUseCase: HostUseCase;
  constructor(hostUseCase: HostUseCase) {
    this.hostUseCase = hostUseCase;
  }

  async SignUpAndSendOtp(req: Request, res: Response) {
    try {
      const signUpResponse = await this.hostUseCase.signUpAndSendOtp(req.body);
      if (signUpResponse?.status) {
        res
          .cookie("hostOtp", signUpResponse.Token, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
          })
          .status(200)
          .json(signUpResponse);
      } else {
        res.json(signUpResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async ResendOtp(req: Request, res: Response) {
    try {
      const token = req.cookies.hostOtp;
      const response = await this.hostUseCase.resendOtp(token);
      if (response?.status) {
        res.status(200).json(response);
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async AuthenticateHost(req: Request, res: Response) {
    try {
      const token = req.cookies.hostOtp;
      const response = await this.hostUseCase.authentication(
        token,
        req.body.otp
      );
      if (response?.status) {
        res.status(200).json(response);
      } else {
        res.json(response).status(401);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async Host_Login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const verifiedHost = await this.hostUseCase.Login(email, password);
      if (verifiedHost && verifiedHost.status) {
        if (verifiedHost?.status) {
          res
            .cookie("host", verifiedHost.token, {
              expires: new Date(Date.now() + 25892000000),
              secure: true,
            })
            .status(200)
            .json({ verifiedHost });
        } else {
          res.json(verifiedHost).status(401);
        }
      } else {
        res.json({ verifiedHost }).status(401);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async googleAuthLogin(req: Request, res: Response) {
    try {
      const response = await this.hostUseCase.googleAuthLogin(req.body);
      if (response?.status) {
        if (response.token) {
          res
            .cookie("host", response.token, {
              expires: new Date(Date.now() + 25892000000),
              secure: true,
            })
            .status(200)
            .json(response);
        } else {
          res.json(response).status(401);
        }
      } else {
        res.json(response).status(401);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async forgetPassSendOTP(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const response = await this.hostUseCase.forgetPassSendOTP(email);
      if (response?.status) {
        res
          .cookie("forget", response.token, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
          })
          .status(200)
          .json(response);
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async confirmForgetOTP(req: Request, res: Response) {
    try {
      const token = req.cookies.forget;

      const response = await this.hostUseCase.confirmForgetOTP(
        token,
        req.body.otp
      );
      if (response?.status) {
        res.status(200).json(response);
      } else {
        res.json(response).status(401);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateHostPassword(req: Request, res: Response) {
    try {
      const token = req.cookies.forget;
      const response = await this.hostUseCase.upadateHostPassword(
        token,
        req.body.password
      );
      if (response?.status) {
        res.status(200).json(response);
      } else {
        res.json(response).status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default HostController;
