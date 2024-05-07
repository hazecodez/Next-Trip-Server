import { Request, Response } from "express";

interface IPackageController {
  createPackage(req: Request, res: Response): Promise<void>;
  getPackageListByHost(req: Request, res: Response): Promise<void>;
  fetchPackageDetails(req: Request, res: Response): Promise<void>;
  UpdatePackage(req: Request, res: Response): Promise<void>;
  fetchAllPackages(req: Request, res: Response): Promise<void>;
  bookPackage(req: Request, res: Response): Promise<void>;
}

export default IPackageController;
