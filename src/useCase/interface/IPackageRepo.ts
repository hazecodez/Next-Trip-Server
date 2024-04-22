import Package from "../../domain/package";

interface IPackageRepo {
  savePackageData(
    data: Package,
    images: string[] | undefined,
    hostId: string
  ): Promise<Boolean | undefined>;
}

export default IPackageRepo;
