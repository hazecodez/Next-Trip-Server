import IBookingRepo from "./interface/IBookingRepo";
import Jwt from "../infrastructure/utils/jwt";
import { checkout } from "../infrastructure/utils/stripe";
import IPackageRepo from "./interface/IPackageRepo";
import CronJob from "../infrastructure/utils/cronJob";

class BookingUseCase {
  private bookigRepository: IBookingRepo;
  private Jwt: Jwt;
  private packageRepository: IPackageRepo;
  private cronJob: CronJob;
  constructor(
    bookigRepository: IBookingRepo,
    jwt: Jwt,
    packageRepository: IPackageRepo,
    cronJob: CronJob
  ) {
    this.bookigRepository = bookigRepository;
    this.Jwt = jwt;
    this.packageRepository = packageRepository;
    this.cronJob = cronJob;
  }

  async bookPackage(Data: any, token: string, email: string): Promise<any> {
    try {
      const traveler = this.Jwt.verifyToken(token);
      const packageDetails = await this.packageRepository.getPackageDetails(
        Data.packageId
      );
      const response = await this.bookigRepository.saveBookedPackage(
        traveler?.id,
        Data,
        packageDetails?.book_end as string,
        packageDetails?.dur_start as string,
        packageDetails?.dur_end as string,
        packageDetails?.host as string
      );
      await this.packageRepository.updatePackageCapacity(
        Data.packageId,
        Data.travelers.length
      );
      if (response) {
        //---------to schedule email for inform the travelers journey date. day before the start date
        await this.cronJob.schedule(
          email,
          packageDetails?.dur_start as string,
          packageDetails?.destination as string
        );
        //-------for payment
        if (Data.method === "Online Payment") {
          const sessionId = await checkout(Data);
          if (sessionId) {
            return { sessionId, status: true };
          }
        } else {
          return { status: true, method: "Wallet" };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async fetchBookingsForUser(id: string, page: number): Promise<any> {
    try {
      const response = await this.bookigRepository.fetchBookingByUserId(
        id,
        page
      );
      if (response) return response;
    } catch (error) {
      console.log(error);
    }
  }
  async fetchBookingsForPackage(id: string): Promise<any> {
    try {
      const response = await this.bookigRepository.fetchBookingByPackageId(id);
      if (response) return response;
    } catch (error) {
      console.log(error);
    }
  }
  async fetchBookingById(id: string): Promise<any> {
    try {
      const Booking = await this.bookigRepository.fetchBookingById(id);
      return Booking;
    } catch (error) {
      console.log(error);
    }
  }
  async cancelBooking(id: string) {
    try {
      const response = await this.bookigRepository.deleteBooking(id);
      if (response) {
        return {
          status: true,
          message: "Booking cancelled successfully.",
        };
      } else {
        return {
          status: false,
          message: "Oops!! something went wrong.",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default BookingUseCase;
