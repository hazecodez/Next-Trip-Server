import Package from "../domain/package";
import IPackageRepo from "./interface/IPackageRepo";

import { uploadFiles } from "../infrastructure/utils/cloudinary";
import Jwt from "../infrastructure/utils/jwt";
import IPackageUseCase from "./interface/IPackageUseCase";

class PackageUseCase implements IPackageUseCase{
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

  async updatePackage(form: Package, images: string[]) {
    try {
      const imageFiles = await uploadFiles(images, "Packages");
      const updated = await this.repository.updatePackage(form, imageFiles);
      if (updated) {
        return {
          status: true,
          message:
            "Package updated successfully, wait for the verification by admin.",
        };
      } else {
        return {
          status: false,
          message: "Oops!! Something went wrong. try again.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getPackagesByHost(token: string) {
    try {
      const decodeToken = this.Jwt.verifyToken(token);
      if (decodeToken) {
        const packageList = await this.repository.getPackagesById(
          decodeToken.id
        );
        return packageList;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getPackageDetails(id: string) {
    try {
      const details = await this.repository.getPackageDetails(id);
      return details;
    } catch (error) {
      console.log(error);
    }
  }
  async fetchAllPackages() {
    try {
      const response = await this.repository.getAllPackages();
      if (response) {
        return {
          status: true,
          packages: response,
        };
      } else {
        return {
          status: false,
          message: "No packages is available.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default PackageUseCase;
