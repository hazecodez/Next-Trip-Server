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
        res.json(response).status(401);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getTravelersList(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string);
      const travelers = await this.adminUseCase.findTravelersList(search, page);
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
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string);
      const packages = await this.adminUseCase.packagesList(search, page);
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
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string);
      const hosts = await this.adminUseCase.findHostsList(search, page);
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
  async getBlogList(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string);
      const blogs = await this.adminUseCase.findBlogsList(search, page);
      if (blogs) {
        res.status(200).json({ status: true, blogs });
      } else {
        res.json({ status: false, message: "Unable to fetch." });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async block_unblock_Blogs(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const response = await this.adminUseCase.blockOrUnblockBlog(id);
      if (response) {
        res.status(200).json(response);
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async dashboard(req: Request, res: Response) {
    try {
      const response = await this.adminUseCase.dashboard();
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async sales_report(req: Request, res: Response) {
    try {
      const response = await this.adminUseCase.sales_report();
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

export default AdminController;
