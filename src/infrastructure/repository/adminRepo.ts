import IAdminRepo from "../../useCase/interface/IAdminRepo";
import Admin from "../../domain/admin";
import adminModel from "../database/adminModel";
import travelerModel from "../database/travelerModel";
import traveler from "../../domain/traveler";
import hostModel from "../database/hostModel";
import host from "../../domain/host";

class AdminRepo implements IAdminRepo {
  async findAdminByEmail(email: string): Promise<Admin | null | void> {
    try {
      const adminData = await adminModel.findOne({ email: email });
      return adminData ? adminData.toObject() : null;
    } catch (error) {
      console.log(error);
    }
  }
  async findTravelersData(): Promise<traveler[] | undefined> {
    try {
      const travelers = await travelerModel.find();
      return travelers;
    } catch (error) {
      console.log(error);
    }
  }
  async blockAndUnblockTraveler(id: string): Promise<boolean> {
    try {
      const traveler = await travelerModel.findById(id);
      if (traveler?.isBlocked) {
        await travelerModel.findOneAndUpdate(
          { _id: id },
          { isBlocked: false },
          { new: true }
        );
        return true;
      } else {
        await travelerModel.findOneAndUpdate(
          { _id: id },
          { isBlocked: true },
          { new: true }
        );
        return true;
      }
    } catch (error) {
      return false;
    }
  }
  async findHostsData(): Promise<host[] | undefined> {
    try {
      const hosts = await hostModel.find();
      return hosts;
    } catch (error) {
      console.log(error);
    }
  }
  async blockAndUnblockHost(id: string): Promise<boolean> {
    try {
      const host = await hostModel.findById(id);
      if (host?.isBlocked) {
        await hostModel.findOneAndUpdate(
          { _id: id },
          { isBlocked: false },
          { new: true }
        );
        return true;
      } else {
        await hostModel.findOneAndUpdate(
          { _id: id },
          { isBlocked: true },
          { new: true }
        );
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}

export default AdminRepo;
