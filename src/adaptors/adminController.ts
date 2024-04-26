import AdminUseCase from "../useCase/adminUseCase";
import { Request, Response } from "express";
import IAdminController from "../useCase/interface/IAdminCon";

class AdminController implements IAdminController {
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
        res.json(response).status(401);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getTravelersList(req: Request, res: Response) {
    try {
      const travelers = await this.adminUseCase.findTravelersList();
      if (travelers) {
        res.status(200).json({ status: true, travelers });
      } else {
        res.json({ status: false, message: "Unable to fetch." });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getPackagesList(req: Request, res: Response) {
    try {
      const packages = await this.adminUseCase.packagesList();
      if (packages) {
        res.status(200).json({ status: true, packages });
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async package_Actions(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const response = await this.adminUseCase.packageActions(id);
      if (response) {
        res.status(200).json({ status: true, response });
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async block_unblock_Traveler(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const response = await this.adminUseCase.blockOrUnblockTraveler(id);
      if (response) {
        res.status(200).json(response);
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getHostsList(req: Request, res: Response) {
    try {
      const hosts = await this.adminUseCase.findHostsList();
      if (hosts) {
        res.status(200).json({ status: true, hosts });
      } else {
        res.json({ status: false, message: "Unable to fetch." });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async block_unblock_Host(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const response = await this.adminUseCase.blockOrUnblockHost(id);
      if (response) {
        res.status(200).json(response);
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default AdminController;
