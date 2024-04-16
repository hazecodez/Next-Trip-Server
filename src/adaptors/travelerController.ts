import { Request, Response } from "express";
import TravelerUseCase from "../useCase/travelerUseCase";

class TravelerController {
  private travelerUseCase: TravelerUseCase;
  constructor(travelerUseCase: TravelerUseCase) {
    this.travelerUseCase = travelerUseCase;
  }

  async SignUpAndSendOtp(req: Request, res: Response) {
    try {
      let signUpResponse = await this.travelerUseCase.signUpAndSendOtp(
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
        res.status(401).json(signUpResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async AuthenticateTraveler(req: Request, res: Response) {
    try {
      let token = req.cookies.travelerOtp;

      let response = await this.travelerUseCase.authentication(
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
        res.status(401).json(response);
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
          return res
            .cookie("travelerToken", verifiedTraveler.token, {
              expires: new Date(Date.now() + 25892000000),
              secure: true,
            })
            .status(200)
            .json({ verifiedTraveler });
        } else {
          res.status(401).json(verifiedTraveler);
        }
      } else {
        res.json({ verifiedTraveler });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default TravelerController;
