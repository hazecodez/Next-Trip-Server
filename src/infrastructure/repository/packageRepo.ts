import Package from "../../domain/package";
import IPackageRepo from "../../useCase/interface/IPackageRepo";
import packageModel from "../database/packageModel";

class PackageRepo implements IPackageRepo {
  async savePackageData(
    data: Package,
    images:string[],
    hostId:string
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
        host: hostId
      });
      if(savedToDB) return true
      return false;
    } catch (error) {
      console.log(error);
    }
  }
}

export default PackageRepo;
