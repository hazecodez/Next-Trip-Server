import AdminRepo from "../infrastructure/repository/adminRepo";
import Admin from "../domain/admin";
import Jwt from "../infrastructure/utils/jwt";
import Bcrypt from "../infrastructure/utils/bcryption";

class AdminUseCase {
  constructor(
    private adminRepo: AdminRepo,
    private jwt: Jwt,
    private bcrypt: Bcrypt
  ) {
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.adminRepo = adminRepo;
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
}
export default AdminUseCase;
