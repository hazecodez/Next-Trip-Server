import host from "../../domain/host";
import IHostRepo from "../../useCase/interface/IHostRepo";
import hostModel from "../database/hostModel";

class HostRepo implements IHostRepo {
  async findHostByEmail(email: string): Promise<host | null | undefined> {
    try {
      const dataFound = await hostModel.findOne({ email: email });
      return dataFound ? dataFound.toObject() : null;
    } catch (error) {
      console.log(error);
    }
  }
  async findHostById(id: string): Promise<host | null | undefined> {
    try {
      const data = await hostModel.findById(id);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async saveHostToDB(host: host): Promise<void | host | null> {
    try {
      const hostData = new hostModel(host);
      await hostData.save();
      return hostData ? hostData.toObject() : null;
    } catch (error) {
      console.log(error);
    }
  }
  async verifyHostEmail(email: string): Promise<any> {
    await hostModel.findOneAndUpdate(
      {
        email: email,
      },
      { emailVerified: true }
    );
  }
  async fetchHostData(email: string): Promise<void | host | null> {
    try {
      const host = await hostModel.findOne(
        {
          email: email,
        },
        { email: 1, name: 1 }
      );
      return host;
    } catch (error) {
      console.log(error);
    }
  }
  async saveGoogleUser(credential: any): Promise<host | undefined> {
    try {
      const saved = await hostModel.create({
        email: credential.email,
        name: credential.name,
        emailVerified: true,
        googleId: credential.sub,
      });
      return saved;
    } catch (error) {
      console.log(error);
    }
  }
  async updateHostPassword(
    id: string,
    password: string
  ): Promise<Boolean | undefined> {
    try {
      const updated = await hostModel.findOneAndUpdate(
        { _id: id },
        { password: password }
      );
      if (updated) return true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }
  async updateWallet(Data: any, traveler: any): Promise<Boolean> {
    try {
      const updated = await hostModel.findOneAndUpdate(
        { _id: Data.hostId },
        {
          $inc: { wallet: Data.totalPrice },
          $push: {
            walletHistory: {
              packageName: Data.name,
              travelerName: traveler.name,
              amount: Data.totalPrice,
              status: "Credited",
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
  async updateProfile(Data: any, id: string): Promise<Boolean> {
    try {
      const updated = await hostModel.findOneAndUpdate(
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
      const updated = await hostModel.findOneAndUpdate(
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
}

export default HostRepo;
