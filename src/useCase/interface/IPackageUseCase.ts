import Package from "../../domain/package";

interface IPackageUseCase {
  createPackage(form: Package, images: string[], token: string): Promise<any>;
  updatePackage(form: Package, images: string[]): Promise<any>;
  getPackagesByHost(token: string): Promise<any>;
  getPackageDetails(id: string): Promise<any>;
  fetchAllPackages(): Promise<any>;
  bookPackage(Data: any, token: string): Promise<any>;
}

export default IPackageUseCase;
