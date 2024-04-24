import AdminRepo from "../infrastructure/repository/adminRepo";
import PackageRepo from "../infrastructure/repository/packageRepo";

import Admin from "../domain/admin";
import Jwt from "../infrastructure/utils/jwt";
import Bcrypt from "../infrastructure/utils/bcryption";

class AdminUseCase  {
  constructor(
    private adminRepo: AdminRepo,
    private jwt: Jwt,
    private bcrypt: Bcrypt,
    private packageRepo: PackageRepo
  ) {
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.adminRepo = adminRepo;
    this.packageRepo = packageRepo;
  }
  async adminLogin(loginData: Admin) {
    try {
      const { email } = loginData;
      const found = await this.adminRepo.findAdminByEmail(email);
      if (found) {
        const encryptedPass = await this.bcrypt.Encryption(
          loginData.password,
          found.password
        );
        if (!encryptedPass) {
          return {
            status: false,
            message: "Whoops!! Incorect Password",
          };
        } else {
          const token = this.jwt.createToken(found._id, "admin");
          return {
            status: true,
            token,
            adminData: found,
            message: `Welcome Admin.
            You have successfully logged in!`,
          };
        }
      } else {
        return {
          status: false,
          message:
            "Admin email not found. Please check your email and try again.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async adminGoogleLogin(credential: any) {
    try {
      const { email } = credential;
      const exist = await this.adminRepo.findAdminByEmail(email);
      if (exist) {
        const token = this.jwt.createToken(exist?._id, "admin");
        return {
          status: true,
          adminData: exist,
          message: `Welcome Admin.
          You have successfully logged in!`,
          token,
        };
      } else {
        return {
          status: false,
          message:
            "Admin email not found. Please check your email and try again.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async findTravelersList() {
    try {
      const travelersData = await this.adminRepo.findTravelersData();
      return travelersData;
    } catch (error) {
      console.log(error);
    }
  }
  async blockOrUnblockTraveler(id: string) {
    try {
      const acted = await this.adminRepo.blockAndUnblockTraveler(id);
      return acted;
    } catch (error) {
      console.log(error);
    }
  }
  async findHostsList() {
    try {
      const hostsData = await this.adminRepo.findHostsData();
      return hostsData;
    } catch (error) {
      console.log(error);
    }
  }
  async blockOrUnblockHost(id: string) {
    try {
      const acted = await this.adminRepo.blockAndUnblockHost(id);
      return acted;
    } catch (error) {
      console.log(error);
    }
  }
  async packagesList () {
    try {
      const packagesData = await this.adminRepo.findPackagesData();
      return packagesData;
    } catch (error) {
      console.log(error);
      
    }
  }
  async packageActions(id:string) {
    try {
      const acted = await this.adminRepo.verifyPackage(id);
      return acted;
    } catch (error) {
      console.log(error);
      
    }
  }
}
export default AdminUseCase;
