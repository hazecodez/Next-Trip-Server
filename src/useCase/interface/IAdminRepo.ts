import Admin from "../../domain/admin";

export interface MonthlyPackageReport {
  year: number;
  month: number;
  packageCount: number;
}

interface IAdminRepo {
  findAdminByEmail(email: string): Promise<Admin | null | void>;
  findTravelersData(search: string, page: number): Promise<any>;
  blockAndUnblockTraveler(id: string): Promise<boolean>;
  findHostsData(search: string, page: number): Promise<any>;
  blockAndUnblockHost(id: string): Promise<boolean>;
  verifyPackage(id: string): Promise<boolean>;
  findPackagesData(search: string, page: number): Promise<any>;
  findBlogsData(search: string, page: number): Promise<any>;
  dashboard(): Promise<any>;
  sales_report(): Promise<MonthlyPackageReport[]>;
}

export default IAdminRepo;
