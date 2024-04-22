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
      const host = req.cookies.hostToken as string;

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
}

export default PackageController;
