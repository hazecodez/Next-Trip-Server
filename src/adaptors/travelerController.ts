import { Request, Response } from "express";
import TravelerUseCase from "../useCase/travelerUseCase";
import ITravelerController from "../useCase/interface/ITravelerCon";

class TravelerController implements ITravelerController {
  private travelerUseCase: TravelerUseCase;
  constructor(travelerUseCase: TravelerUseCase) {
    this.travelerUseCase = travelerUseCase;
  }

  async SignUpAndSendOtp(req: Request, res: Response) {
    try {
      const signUpResponse = await this.travelerUseCase.signUpAndSendOtp(
        req.body
      );
      if (signUpResponse.status) {
        res
          .cookie("travelerOtp", signUpResponse.Token, {
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
      const token = req.cookies.travelerOtp;
      const response = await this.travelerUseCase.resendOtp(token);
      if (response?.status) {
        res.status(200).json(response);
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async AuthenticateTraveler(req: Request, res: Response) {
    try {
      const token = req.cookies.travelerOtp;

      const response = await this.travelerUseCase.authentication(
        token,
        req.body.otp
      );

      if (response?.status) {
        res
          .cookie("traveler", response.token, {
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

  async TravelerLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const verifiedTraveler = await this.travelerUseCase.Login(
        email,
        password
      );
      if (verifiedTraveler && verifiedTraveler.status) {
        if (verifiedTraveler.status) {
          res
            .cookie("traveler", verifiedTraveler.token, {
              expires: new Date(Date.now() + 25892000000),
              secure: true,
            })
            .status(200)
            .json({ verifiedTraveler });
        } else {
          res.json(verifiedTraveler);
        }
      } else {
        res.json({ verifiedTraveler });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async googleAuthLogin(req: Request, res: Response) {
    try {
      const response = await this.travelerUseCase.googleAuthLogin(req.body);
      if (response?.status) {
        res
          .cookie("traveler", response.token, {
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

  async forgetPassSendOTP(req: Request, res: Response) {
    try {
      const email = req.body.email;

      const response = await this.travelerUseCase.forgetPassSendOTP(email);
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
      const response = await this.travelerUseCase.confirmForgetOTP(
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

  async upadateTravelerPassword(req: Request, res: Response) {
    try {
      const token = req.cookies.forget;

      const response = await this.travelerUseCase.upadateTravelerPassword(
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

  async travelerProfile(req: Request, res: Response) {
    try {
      const token = req.cookies.traveler;
      const response = await this.travelerUseCase.travelerProfile(token);
      if (response?.status) {
        res.status(200).json(response.Traveler);
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async profileUpdate(req: Request, res: Response) {
    try {
      const token = req.cookies.traveler;
      const response = await this.travelerUseCase.profileUpdate(
        token,
        req.body
      );
      if (response) {
        res.status(200).json({ status: true, message: "Successfully updated" });
      } else {
        res
          .json({ status: false, message: "Oops!! something went wrong" })
          .status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async changePassword(req: Request, res: Response) {
    try {
      const token = req.cookies.traveler;
      const response = await this.travelerUseCase.changePassword(
        token,
        req.body
      );
      if (response?.status) {
        res.status(200).json({ status: true, message: response.message });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async createPassword(req: Request, res: Response) {
    try {
      const token = req.cookies.traveler;
      const response = await this.travelerUseCase.createPassword(
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
      const token = req.cookies.traveler;
      const response = await this.travelerUseCase.profilePicUpdate(
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
}

export default TravelerController;
