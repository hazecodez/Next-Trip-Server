import IBookingRepo from "../../useCase/interface/IBookingRepo";
import bookingModel from "../database/bookingModel";

class BookingRepo implements IBookingRepo {
  async saveBookedPackage(id: string, Data: any): Promise<Boolean> {
    try {
      const saved = await bookingModel.create({
        packageId: Data.packageId,
        totalPrice: Data.totalPrice,
        travelerId: id,
        travelers: Data.travelers,
        status: "booked",
      });
      if (saved) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async fetchBookingByUserId(id: string): Promise<any> {
    try {
      const bookings = await bookingModel.find({ travelerId: id });
      return bookings;
    } catch (error) {
      console.log(error);
    }
  }
  async fetchBookingByPackageId(id: string): Promise<any> {
    try {
      const bookings = await bookingModel.find({ packageId: id });
      return bookings;
    } catch (error) {
      console.log(error);
    }
  }
}
export default BookingRepo;
