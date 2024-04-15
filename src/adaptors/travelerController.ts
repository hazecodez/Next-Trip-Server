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
}

export default TravelerController;
