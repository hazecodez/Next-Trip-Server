import Package from "../domain/package";
import IPackageRepo from "./interface/IPackageRepo";

import { uploadFiles } from "../infrastructure/utils/cloudinary";
import Jwt from "../infrastructure/utils/jwt";

class PackageUseCase {
  private repository: IPackageRepo;
  private Jwt: Jwt;
  constructor(repository: IPackageRepo, jwt: Jwt) {
    this.repository = repository;
    this.Jwt = jwt;
  }
  async createPackage(form: Package, images: string[], token: string) {
    try {
      const imageFiles = await uploadFiles(images, "Packages");
      const host = this.Jwt.verifyToken(token);
      const saved = await this.repository.savePackageData(
        form,
        imageFiles,
        host?.id
      );
      if (saved) {
        return {
          status: true,
          message:
            "Package created successfully, wait for the verification by admin.",
        };
      } else {
        return {
          status: false,
          message: "Oops!! Something went wrong. try again.",
        };
      }
    } catch (error) {
      console.error("Error creating package:", error);
      throw new Error("Failed to create package. Please try again.");
    }
  }
}

export default PackageUseCase;
