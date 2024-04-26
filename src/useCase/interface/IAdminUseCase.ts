import Admin from "../../domain/admin";

interface IAdminUseCase {
  adminLogin(loginData: Admin): Promise<any>;
  adminGoogleLogin(credential: any): Promise<any>;
  findTravelersList(): Promise<any>;
  blockOrUnblockTraveler(id: string): Promise<any>;
  findHostsList(): Promise<any>;
  blockOrUnblockHost(id: string): Promise<any>;
  packagesList(): Promise<any>;
  packageActions(id: string): Promise<any>;
}

export default IAdminUseCase;
