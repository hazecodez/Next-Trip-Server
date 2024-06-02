import PackageUseCase from "../useCase/packageUseCase";
import { Request, Response } from "express";

class PackageController {
  private packageUseCase: PackageUseCase;
  constructor(packageUseCase: PackageUseCase) {
    this.packageUseCase = packageUseCase;
  }
  async createPackage(req: Request, res: Response) {
    try {
      const formData = req.body.form;
      const images = req.body.images;
      const host = req.headers.authorization as string;

      const response = await this.packageUseCase.createPackage(
        formData,
        images,
        host
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

  async getPackageListByHost(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const token = req.headers.authorization as string;
      const response = await this.packageUseCase.getPackagesByHost(token, page);
      if (response) {
        res.status(200).json({ packageList: response });
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchPackageDetails(req: Request, res: Response) {
    try {
      console.log("ethiyooo package contro");
      
      const { id } = req.body;
      const details = await this.packageUseCase.getPackageDetails(id);
      console.log("ithonn nokk package contro",details);
      
      if (details) res.status(200).json(details);
      res.status(500);
    } catch (error) {
      console.log(error);
    }
  }
  async UpdatePackage(req: Request, res: Response) {
    try {
      const formData = req.body.form;
      const images = req.body.images;

      const response = await this.packageUseCase.updatePackage(
        formData,
        images
      );
      if (response?.status) {
        res.status(200).json(response);
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async fetchAllPackages(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const response = await this.packageUseCase.fetchAllPackages(page);
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

export default PackageController;
