import { Booking } from "../../domain/booking";

interface IBookingRepo {
  saveBookedPackage(id: string, Data: any, dur_end: string): Promise<Boolean>;
  fetchBookingByUserId(id: string,page:number): Promise<any>;
  fetchBookingByPackageId(id: string): Promise<any>;
  deleteBooking(id: string): Promise<Boolean>;
  fetchBookingById(id: string): Promise<any>;
}

export default IBookingRepo;
