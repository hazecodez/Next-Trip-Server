import host from "../../domain/host";
import IHostRepo, {
  MonthlyBookingReport,
} from "../../useCase/interface/IHostRepo";
import bookingModel from "../database/bookingModel";
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
        { email: 1, name: 1, image:1 }
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
  async creditedToWallet(Data: any, traveler: any): Promise<Boolean> {
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
  async debitedFromWallet(
    Data: any,
    travelerName: string,
    hostId: string
  ): Promise<Boolean> {
    try {
      const updated = await hostModel.findOneAndUpdate(
        { _id: hostId },
        {
          $inc: { wallet: -Data.totalPrice },
          $push: {
            walletHistory: {
              packageName: Data.packageName,
              travelerName: travelerName,
              amount: Data.totalPrice,
              status: "Debited",
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
  async booking_report(hostId: string): Promise<MonthlyBookingReport[]> {
    try {
      const report: MonthlyBookingReport[] = await bookingModel.aggregate([
        // Match bookings by host ID
        {
          $match: { hostId },
        },
        // Project necessary fields and calculate the number of travelers
        {
          $project: {
            year: { $year: { $dateFromString: { dateString: "$startDate" } } },
            month: {
              $month: { $dateFromString: { dateString: "$startDate" } },
            },
            travelersCount: { $size: "$travelers" },
          },
        },
        // Group by year and month and sum up the number of travelers
        {
          $group: {
            _id: {
              year: "$year",
              month: "$month",
            },
            totalBookings: { $sum: "$travelersCount" },
          },
        },
        // Project the final structure
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalBookings: 1,
          },
        },
        // Sort by year and month
        {
          $sort: { year: 1, month: 1 },
        },
      ]);

      return report;
    } catch (error) {
      console.error("Error fetching monthly booking report:", error);
      throw error;
    }
  }
}

export default HostRepo;
