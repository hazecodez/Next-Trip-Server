import Package from "../../domain/package";

interface IPackageRepo {
  savePackageData(
    data: Package,
    images: string[] | undefined,
    hostId: string
  ): Promise<Boolean | undefined>;
  getPackagesById(id: string): Promise<Package[] | null | undefined>;
  getAllPackages(): Promise<Package[] | null | undefined>;
  getPackageDetails(id: string): Promise<Package | null | undefined>;
  updatePackage(
    data: Package,
    images: string[] | undefined
  ): Promise<Boolean | undefined>;
  findPackagesDataForAdmin(): Promise<Package[] | undefined>;
}

export default IPackageRepo;
