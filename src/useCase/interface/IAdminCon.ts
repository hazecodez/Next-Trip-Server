import { Request, Response } from "express";

interface IAdminController {
  adminLogin(req: Request, res: Response): Promise<void>;
  googleLogin(req: Request, res: Response): Promise<void>;
  getTravelersList(req: Request, res: Response): Promise<void>;
  getPackagesList(req: Request, res: Response): Promise<void>;
  package_Actions(req: Request, res: Response): Promise<void>;
  block_unblock_Traveler(req: Request, res: Response): Promise<void>;
  getHostsList(req: Request, res: Response): Promise<void>;
  block_unblock_Host(req: Request, res: Response): Promise<void>;
}

export default IAdminController;
