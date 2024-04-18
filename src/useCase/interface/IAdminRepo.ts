import Admin from "../../domain/admin";

interface IAdminRepo {
  findAdminByEmail(email: string): Promise<Admin | null | void>;
}

export default IAdminRepo;
