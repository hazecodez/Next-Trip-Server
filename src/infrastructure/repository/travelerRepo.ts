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

  //repository for saving traveler data to DB

  async saveTravelerToDB(traveler: traveler): Promise<void | traveler | null> {
    try {
      let travelerData = new travelerModel(traveler);
      await travelerData.save();
      return travelerData ? travelerData.toObject() : null;
    } catch (error: any) {
      console.log(error.message);
      throw new Error("Unable save traveler data to DB");
    }
  }

  //repository for verify travaler

  async verifyTraveler(email: string): Promise<any> {
    await travelerModel.findOneAndUpdate(
      { email: email },
      { isVerified: true }
    );
  }
//repository for finding traveler's specified data from DB
  async fetchTravelerData(email: string): Promise<void | traveler | null> {
    try {
      const travaler = await travelerModel.findOne(
        { email: email },
        { email: 1, name: 1 }
      );
      return travaler;
    } catch (error) {
      console.log(error);
    }
  }
//repository for save traveler's data login by googleAuth to DB
  async saveGoogleUser(credential: any): Promise<traveler | undefined> {
    try {
      const saved = await travelerModel.create({
        email: credential.email,
        name: credential.name,
        isVerified: true,
        googleId: credential.sub
      });
      return saved;
    } catch (error) {
      console.log(error);
      
    }
  }
}

export default TravelerRepo;
