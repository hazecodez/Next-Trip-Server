import Admin from "../../domain/admin";
import host from "../../domain/host";
import traveler from "../../domain/traveler";

interface IAdminRepo {
  findAdminByEmail(email: string): Promise<Admin | null | void>;
  findTravelersData(): Promise<traveler[] | undefined>;
  blockAndUnblockTraveler(id: string): Promise<boolean>;
  findHostsData(): Promise<host[] | undefined>;
  blockAndUnblockHost(id: string): Promise<boolean>;
}

export default IAdminRepo;
