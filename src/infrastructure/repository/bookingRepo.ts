import { Booking } from "../../domain/booking";
import IBookingRepo from "../../useCase/interface/IBookingRepo";
import bookingModel from "../database/bookingModel";

class BookingRepo implements IBookingRepo {
  async saveBookedPackage(
    id: string,
    Data: any,
    book_end: string,
    startDate: string,
    durEnd: string,
    hostId: string
  ): Promise<Boolean> {
    try {
      const bookEndDate = new Date(book_end);
      // Subtract three days from the bookendDate to get the cancelDate
      const cancelDate = new Date(bookEndDate);
      cancelDate.setDate(cancelDate.getDate() - 3);

      const saved = await bookingModel.create({
        packageId: Data.packageId,
        totalPrice: Data.totalPrice,
        travelerId: id,
        travelers: Data.travelers,
        status: "booked",
        packageName: Data.name,
        cancelDate: cancelDate,
        startDate: startDate,
        endDate: durEnd,
        hostId: hostId,
      });
      if (saved) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async fetchBookingByUserId(id: string, page: number): Promise<any> {
    try {
      const limit = 4;
      const skip = (page - 1) * limit;
      const TotalBookings = await bookingModel
        .find({ travelerId: id })
        .countDocuments();
      const totalPages = Math.floor(TotalBookings / limit);
      const bookings = await bookingModel
        .find({ travelerId: id })
        .sort({ cancelDate: 1 })
        .skip(skip)
        .limit(limit);
      return { bookings, totalPages };
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
  async deleteBooking(id: string): Promise<Boolean> {
    try {
      const deleted = await bookingModel.findOneAndDelete({ _id: id });
      if (deleted) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async fetchBookingById(id: string): Promise<any> {
    try {
      const Booking = await bookingModel.findOne({ _id: id });
      return Booking;
    } catch (error) {
      console.log(error);
    }
  }
}
export default BookingRepo;
