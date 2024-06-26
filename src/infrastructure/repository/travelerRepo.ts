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

  async findTravelerById(id: string): Promise<traveler | null | undefined> {
    try {
      const data = await travelerModel.findById(id);
      return data;
    } catch (error) {
      console.log(error);
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
        { email: 1, name: 1, image:1 }
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
        googleId: credential.sub,
      });
      return saved;
    } catch (error) {
      console.log(error);
    }
  }
  async updateTravelerPassword(
    id: string,
    password: string
  ): Promise<Boolean | undefined> {
    try {
      const updated = await travelerModel.findOneAndUpdate(
        { _id: id },
        { password: password }
      );
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }
  async updateProfile(Data: any, id: string): Promise<Boolean> {
    try {
      const updated = await travelerModel.findOneAndUpdate(
        { _id: id },
        {
          name: Data.name,
          email: Data.email,
        }
      );
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async profilePicUpdate(id: string, image: string): Promise<Boolean> {
    try {
      const updated = await travelerModel.findOneAndUpdate(
        { _id: id },
        { image: image }
      );
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async cancelAmountToWallet(id: string, Data: any): Promise<Boolean> {
    try {
      const updated = await travelerModel.findOneAndUpdate(
        { _id: id },
        {
          $inc: { wallet: Data.totalPrice },
          $push: {
            walletHistory: {
              packageName: Data.packageName,
              amount: Data.totalPrice,
              status: "Cancelled",
              date: new Date(),
            },
          },
        },
        { new: true }
      );
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async walletPayment(id: string, Data: any): Promise<Boolean> {
    try {
      const updated = await travelerModel.findOneAndUpdate(
        { _id: id },
        {
          $inc: { wallet: -Data.totalPrice },
          $push: {
            walletHistory: {
              packageName: Data.name,
              amount: Data.totalPrice,
              status: "Booked",
              date: new Date(),
            },
          },
        },
        { new: true }
      );
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default TravelerRepo;
