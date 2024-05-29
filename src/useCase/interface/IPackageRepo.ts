import Package from "../../domain/package";

interface IPackageRepo {
  savePackageData(
    data: Package,
    images: string[] | undefined,
    hostId: string
  ): Promise<Boolean | undefined>;
  getPackagesById(id: string, page: number): Promise<any>;
  getAllPackages(page: number): Promise<any>;
  getPackageDetails(id: string): Promise<Package | null | undefined>;
  updatePackage(
    data: Package,
    images: string[] | undefined
  ): Promise<Boolean | undefined>;
  findPackagesDataForAdmin(): Promise<Package[] | undefined>;
  updatePackageCapacity(id: string, count: number): Promise<Boolean>;
  getPackageCountByHost(id: string): Promise<number>;
}

export default IPackageRepo;
