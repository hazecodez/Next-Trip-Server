import Package from "../../domain/package";

interface IPackageUseCase {
  createPackage(form: Package, images: string[], token: string): Promise<any>;
  updatePackage(form: Package, images: string[]): Promise<any>;
  getPackagesByHost(token: string,page:number): Promise<any>;
  getPackageDetails(id: string): Promise<any>;
  fetchAllPackages(page:number): Promise<any>;
  // bookPackage(Data: any, token: string): Promise<any>;
}

export default IPackageUseCase;
