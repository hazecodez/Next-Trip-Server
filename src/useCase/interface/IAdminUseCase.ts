import Admin from "../../domain/admin";

interface IAdminUseCase {
  adminLogin(loginData: Admin): Promise<any>;
  adminGoogleLogin(credential: any): Promise<any>;
  findTravelersList(search:string,page:number): Promise<any>;
  blockOrUnblockTraveler(id: string): Promise<any>;
  findHostsList(search:string,page:number): Promise<any>;
  blockOrUnblockHost(id: string): Promise<any>;
  packagesList(search:string,page:number): Promise<any>;
  packageActions(id: string): Promise<any>;
}

export default IAdminUseCase;
