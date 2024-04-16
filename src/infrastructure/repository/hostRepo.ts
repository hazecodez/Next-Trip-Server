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

  async saveHostToDB(host: host): Promise<void | host | null> {
    try {
      const hostData = new hostModel(host);
      await hostData.save();
      return hostData ? hostData.toObject() : null;
    } catch (error) {
      console.log(error);
    }
  }
  async verifyHost(email: string): Promise<any> {
    await hostModel.findOneAndUpdate(
      {
        email: email,
      },
      { isVerified: true }
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
}

export default HostRepo;
