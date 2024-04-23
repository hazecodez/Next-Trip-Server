import { Request, Response, response } from "express";
import HostUseCase from "../useCase/hostUseCase";
class HostController {
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
        res.status(401).json(signUpResponse);
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
      let token = req.cookies.hostOtp;
      let response = await this.hostUseCase.authentication(token, req.body.otp);
      if (response?.status) {
        res
          .cookie("host", response.token, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
          })
          .status(200)
          .json(response);
      } else {
        res.status(401).json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async HostLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const verifiedHost = await this.hostUseCase.Login(email, password);
      if (verifiedHost && verifiedHost.status) {
        if (verifiedHost.status) {
          return res
            .cookie("hostToken", verifiedHost.token, {
              expires: new Date(Date.now() + 25892000000),
              secure: true,
            })
            .status(200)
            .json({ verifiedHost });
        } else {
          res.status(401).json(verifiedHost);
        }
      } else {
        res.json({ verifiedHost });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async googleAuthLogin(req: Request, res: Response) {
    try {
      const response = await this.hostUseCase.googleAuthLogin(req.body);
      if (response?.status) {
        res
          .cookie("hostToken", response.token, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
          })
          .status(200)
          .json(response);
      } else {
        res.status(401).json(response);
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
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async upadateHostPassword(req: Request, res: Response) {
    try {
      const token = req.cookies.forget;
      const response = await this.hostUseCase.upadateHostPassword(
        token,
        req.body.password
      );
      if (response?.status) {
        res.status(200).json(response);
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default HostController;
