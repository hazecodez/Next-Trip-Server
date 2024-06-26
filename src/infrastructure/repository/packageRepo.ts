import Package from "../../domain/package";
import IPackageRepo from "../../useCase/interface/IPackageRepo";
import bookingModel from "../database/bookingModel";
import packageModel from "../database/packageModel";

class PackageRepo implements IPackageRepo {
  async savePackageData(
    data: Package,
    images: string[],
    hostId: string
  ): Promise<Boolean | undefined> {
    try {
      const {
        activities,
        amenities,
        book_end,
        book_start,
        capacity,
        destination,
        dur_end,
        dur_start,
        food,
        host,
        itinerary,
        name,
        price,
        room_type,
        stay,
        arrival_airport,
        arrival_time,
        depa_airport,
        depa_time,
      } = data;
      const savedToDB = await packageModel.create({
        activities,
        amenities,
        arrival_airport,
        arrival_time,
        book_end,
        book_start,
        capacity,
        depa_airport,
        depa_time,
        destination,
        dur_end,
        dur_start,
        food,
        name,
        itinerary,
        price,
        room_type,
        stay,
        images: images,
        host: hostId,
      });
      if (savedToDB) return true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }
  async getPackagesById(id: string, page: number): Promise<any> {
    try {
      const limit = 2;
      const skip = (page - 1) * limit;
      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0];
      const totalPackages = await packageModel
        .find({
          host: id,
          is_verified: true,
          dur_end: { $gte: formattedToday },
        })
        .countDocuments();
      const totalPages = Math.floor(totalPackages / limit);
      const packages = await packageModel
        .find({
          host: id,
          is_verified: true,
          dur_end: { $gte: formattedToday },
        })
        .skip(skip)
        .limit(limit);
      if (packages) {
        return { packages, totalPages };
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }
  async getAllPackages(page: number): Promise<any> {
    try {
      const limit = 3;
      const skip = (page - 1) * limit;
      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0];
      const totalPackages = await packageModel
        .find({
          is_verified: true,
          capacity: { $gt: 0 },
          book_end: { $gte: formattedToday },
        })
        .countDocuments();
      const totalPages = Math.floor(totalPackages / limit);
      const packages = await packageModel
        .find({
          is_verified: true,
          capacity: { $gt: 0 },
          book_end: { $gte: formattedToday },
        })
        .skip(skip)
        .limit(limit);
      if (packages) return { packages, totalPages };
      return null;
    } catch (error) {
      console.log(error);
    }
  }
  async getPackageDetails(id: string): Promise<Package | null | undefined> {
    try {
      const details = await packageModel.findOne({ _id: id });
      return details;
    } catch (error) {
      console.log(error);
    }
  }
  async updatePackage(
    data: Package,
    images: string[] | undefined
  ): Promise<Boolean | undefined> {
    try {
      const updated = await packageModel.findOneAndUpdate(
        { _id: data._id },
        {
          activities: data.activities,
          amenities: data.amenities,
          arrival_airport: data.arrival_airport,
          arrival_time: data.arrival_time,
          book_end: data.book_end,
          book_start: data.book_start,
          capacity: data.capacity,
          depa_airport: data.depa_airport,
          depa_time: data.depa_time,
          destination: data.destination,
          dur_end: data.dur_end,
          dur_start: data.dur_start,
          food: data.food,
          name: data.name,
          itinerary: data.itinerary,
          price: data.price,
          room_type: data.room_type,
          stay: data.stay,
          is_verified: false,
          images: images,
        }
      );
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }
  async findPackagesDataForAdmin(): Promise<Package[] | undefined> {
    try {
      const packages = await packageModel.find();
      return packages;
    } catch (error) {
      console.log(error);
    }
  }
  async updatePackageCapacity(id: string, count: number): Promise<Boolean> {
    try {
      const updated = await packageModel.findOneAndUpdate(
        { _id: id },
        { $inc: { capacity: -count } }
      );
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getPackageCountByHost(id: string): Promise<number> {
    try {
      const packages = await packageModel.find({ host: id }).countDocuments();
      return packages;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}

export default PackageRepo;
