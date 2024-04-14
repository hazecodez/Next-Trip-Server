import traveler from "../../domain/traveler";
import ITravelerRepo from "../../useCase/interface/ITravelerRepo";
import travelerModel from "../database/travelerModel";

class TravelerRepo implements ITravelerRepo {
  //repository for finding traveler data from DB
  async findTravelerByEmail(email: string): Promise<traveler | null> {
    try {
      let dataFound = await travelerModel.findOne({ email: email });
      return dataFound ? dataFound.toObject() : null;
    } catch (error: any) {
      console.log(error.message);
      throw new Error("Unable to find traveler data.");
    }
  }

  async saveTravelerToDB(traveler: traveler): Promise<void | traveler | null> {
    try {
      //repository for saving traveler data to DB
      let travelerData = new travelerModel(traveler);
      await travelerData.save();
      return travelerData ? travelerData.toObject() : null;
    } catch (error: any) {
      console.log(error.message);
      throw new Error("Unable save traveler data to DB");
    }
  }
}

export default TravelerRepo;
