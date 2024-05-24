import Admin from "../../domain/admin";
import host from "../../domain/host";
import Package from "../../domain/package";
import traveler from "../../domain/traveler";

interface IAdminRepo {
  findAdminByEmail(email: string): Promise<Admin | null | void>;
  findTravelersData(search: string, page: number): Promise<any>;
  blockAndUnblockTraveler(id: string): Promise<boolean>;
  findHostsData(search: string, page: number): Promise<any>;
  blockAndUnblockHost(id: string): Promise<boolean>;
  verifyPackage(id: string): Promise<boolean>;
  findPackagesData(search: string, page: number): Promise<any>;
  findBlogsData(search: string, page: number): Promise<any>;
}

export default IAdminRepo;
