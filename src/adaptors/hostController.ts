import { Request, Response } from "express";
import HostUseCase from "../useCase/hostUseCase";
import PackageUseCase from "../useCase/packageUseCase";

class HostController {
  private hostUseCase: HostUseCase;
  private packageUseCase: PackageUseCase;
  constructor(hostUseCase: HostUseCase, packageUseCase: PackageUseCase) {
    this.hostUseCase = hostUseCase;
    this.packageUseCase = packageUseCase;
  }

  async SignUpAndSendOtp(req: Request, res: Response) {
    try {
      const signUpResponse = await this.hostUseCase.signUpAndSendOtp(req.body);
      if (signUpResponse?.status) {
        res.status(200).json(signUpResponse);
      } else {
        res.json(signUpResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async ResendOtp(req: Request, res: Response) {
    try {
      const token = req.body.token;
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
      const response = await this.hostUseCase.authentication(
        req.body.token,
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
          res.status(200).json({ verifiedHost });
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
          res.status(200).json(response);
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
        res.status(200).json(response);
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async confirmForgetOTP(req: Request, res: Response) {
    try {
      const response = await this.hostUseCase.confirmForgetOTP(
        req.body.token,
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
      const response = await this.hostUseCase.upadateHostPassword(
        req.body.token,
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

  async getHostProfile(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const response = await this.hostUseCase.getHostProfile(token);
      if (response?.status) {
        res.status(200).json(response.Host);
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async hostProfileUpdate(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const response = await this.hostUseCase.hostProfileUpdate(
        token,
        req.body
      );
      if (response) {
        res
          .status(200)
          .json({ status: true, message: "Successfully updated." });
      } else {
        res
          .json({ status: false, message: "Oops!! something went wrong." })
          .status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async hostChangePassword(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const response = await this.hostUseCase.changePassword(token, req.body);
      if (response?.status) {
        res
          .status(200)
          .json({ status: response.status, message: response.message });
      } else {
        res.json({ status: response?.status, message: response?.message });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async createPassword(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const response = await this.hostUseCase.createPassword(
        token,
        req.body.password
      );
      if (response?.status) {
        res
          .status(200)
          .json({ status: response.status, message: response.message });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async profilePicUpdate(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const response = await this.hostUseCase.profilePicUpdate(
        token,
        req.body.image
      );
      if (response?.status) {
        res
          .status(200)
          .json({ status: response.status, message: response.message });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async dashboard(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const Host = await this.hostUseCase.getHostProfile(token);
      const packageCount = await this.packageUseCase.getPackageCountByHost(
        token
      );
      if (Host && packageCount) {
        res.status(200).json({ status: true, Host: Host.Host, packageCount });
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async booking_report(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const response = await this.hostUseCase.booking_report(token);
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default HostController;
