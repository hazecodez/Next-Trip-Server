import AdminUseCase from "../useCase/adminUseCase";
import { Request, Response } from "express";

class AdminController {
  constructor(private adminUseCase: AdminUseCase) {
    this.adminUseCase = adminUseCase;
  }
  async adminLogin(req: Request, res: Response) {
    try {
      const response = await this.adminUseCase.adminLogin(req.body);

      if (response?.status) {
        res
          .cookie("adminToken", response.token, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
          })
          .status(200)
          .json(response);
      } else {
        res.json(response).status(401);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async googleLogin(req: Request, res: Response) {
    try {
      const response = await this.adminUseCase.adminGoogleLogin(req.body);
      if (response?.status) {
        res
          .cookie("adminToken", response.token, {
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
}

export default AdminController;
