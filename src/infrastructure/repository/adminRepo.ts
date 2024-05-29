import IAdminRepo from "../../useCase/interface/IAdminRepo";
import Admin from "../../domain/admin";
import adminModel from "../database/adminModel";
import travelerModel from "../database/travelerModel";
import traveler from "../../domain/traveler";
import hostModel from "../database/hostModel";
import host from "../../domain/host";
import packageModel from "../database/packageModel";
import Package from "../../domain/package";
import blogModel from "../database/blogModel";

class AdminRepo implements IAdminRepo {
  async findAdminByEmail(email: string): Promise<Admin | null | void> {
    try {
      const adminData = await adminModel.findOne({ email: email });
      return adminData ? adminData.toObject() : null;
    } catch (error) {
      console.log(error);
    }
  }
  async findTravelersData(search: string, page: number): Promise<any> {
    try {
      const limit = 6;
      const skip = (page - 1) * limit;
      const TotalTravelers = await travelerModel.find({}).countDocuments();
      const totalPages = Math.floor(TotalTravelers / limit);
      const travelers = await travelerModel
        .find({
          $or: [
            { name: { $regex: "^" + search, $options: "i" } },
            { email: { $regex: "^" + search, $options: "i" } },
          ],
        })
        .skip(skip)
        .limit(limit);
      return { travelers, totalPages };
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
  async findHostsData(search: string, page: number): Promise<any> {
    try {
      const limit = 6;
      const skip = (page - 1) * limit;
      const totalHosts = await hostModel.find({}).countDocuments();
      const totalPages = Math.floor(totalHosts / limit);
      const hosts = await hostModel
        .find({
          $or: [
            { name: { $regex: "^" + search, $options: "i" } },
            { email: { $regex: "^" + search, $options: "i" } },
          ],
        })
        .skip(skip)
        .limit(limit);
      return { hosts, totalPages };
    } catch (error) {
      console.log(error);
    }
  }

  async verifyPackage(id: string): Promise<boolean> {
    try {
      const packageData = await packageModel.findById(id);
      if (!packageData?.is_verified) {
        await packageModel.findOneAndUpdate({ _id: id }, { is_verified: true });
      } else {
        await packageModel.findOneAndUpdate(
          { _id: id },
          { is_verified: false }
        );
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
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
  async findPackagesData(search: string, page: number): Promise<any> {
    try {
      const limit = 6;
      const skip = (page - 1) * limit;
      const totalPackages = await packageModel.find({}).countDocuments();
      const totalPages = Math.floor(totalPackages / limit);
      const packages = await packageModel
        .find({
          $or: [
            { name: { $regex: "^" + search, $options: "i" } },
            { destination: { $regex: "^" + search, $options: "i" } },
          ],
        })
        .skip(skip)
        .limit(limit);
      return { packages, totalPages };
    } catch (error) {
      console.log(error);
    }
  }
  async findBlogsData(search: string, page: number): Promise<any> {
    try {
      const limit = 6;
      const skip = (page - 1) * limit;
      const TotalBlogs = await blogModel.find({}).countDocuments();
      const totalPages = Math.floor(TotalBlogs / limit);
      const blogs = await blogModel
        .find({
          $or: [
            { caption: { $regex: "^" + search, $options: "i" } },
            { location: { $regex: "^" + search, $options: "i" } },
          ],
        })
        .skip(skip)
        .limit(limit);
      return { blogs, totalPages };
    } catch (error) {
      console.log(error);
    }
  }
  async blockAndUnblockblog(id: string): Promise<boolean> {
    try {
      const blog = await blogModel.findById(id);
      if (blog?.isBlocked) {
        await blogModel.findOneAndUpdate(
          { _id: id },
          { isBlocked: false },
          { new: true }
        );
        return true;
      } else {
        await blogModel.findOneAndUpdate(
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
  async dashboard(): Promise<any> {
    try {
      const blog = await blogModel.find().countDocuments();
      const packages = await packageModel.find().countDocuments();
      const traveler = await travelerModel.find().countDocuments();
      const hosts = await hostModel.find().countDocuments();
      return { blog, packages, traveler, hosts };
    } catch (error) {
      console.log(error);
    }
  }
}

export default AdminRepo;
