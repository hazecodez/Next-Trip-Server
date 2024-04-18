import IAdminRepo from "../../useCase/interface/IAdminRepo";
import Admin from "../../domain/admin";
import adminModel from "../database/adminModel";

class AdminRepo implements IAdminRepo {
  async findAdminByEmail(email: string): Promise<Admin | null | void> {
    try {
      const adminData = await adminModel.findOne({ email: email });
      return adminData ? adminData.toObject() : null;
    } catch (error) {
      console.log(error);
    }
  }
}

export default AdminRepo;
