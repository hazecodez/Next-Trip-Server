import IBookingRepo from "./interface/IBookingRepo";
import Jwt from "../infrastructure/utils/jwt";
import { checkout } from "../infrastructure/utils/stripe";

class BookingUseCase {
  private bookigRepository: IBookingRepo;
  private Jwt: Jwt;
  constructor(bookigRepository: IBookingRepo, jwt: Jwt) {
    this.bookigRepository = bookigRepository;
    this.Jwt = jwt;
  }
  async bookPackage(Data: any, token: string): Promise<any> {
    try {
      const traveler = this.Jwt.verifyToken(token);
      const response = await this.bookigRepository.saveBookedPackage(
        traveler?.id,
        Data
      );
      if (response) {
        const sessionId = await checkout(Data);
        if (sessionId) {
          return { sessionId, status: true };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async fetchBookingsForUser(id: string): Promise<any> {
    try {
      const response = await this.bookigRepository.fetchBookingByUserId(id);
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
}

export default BookingUseCase;