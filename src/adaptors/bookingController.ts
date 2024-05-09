import BookingUseCase from "../useCase/bookingUseCase";
import { Request, Response } from "express";
import HostUseCase from "../useCase/hostUseCase";

class BookingController {
  private bookingUseCase: BookingUseCase;
  private hostUseCase: HostUseCase;
  constructor(bookingUseCase: BookingUseCase, hostUseCase: HostUseCase) {
    this.bookingUseCase = bookingUseCase;
    this.hostUseCase = hostUseCase;
  }

  async bookPackage(req: Request, res: Response) {
    try {
      const token = req.cookies.traveler as string;
      const response = await this.bookingUseCase.bookPackage(req.body, token);
      if (response?.status) {
        const walletUpdated = await this.hostUseCase.updateHostWallet(
          req.body,
          token
        );
        if (walletUpdated) {
          res.status(200).json(response?.sessionId);
        } else {
          res.json(response);
        }
      } else {
        res.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getBookingsByUser(req: Request, res: Response) {
    try {
      const userId = req.query.travelerId as string;
      const response = await this.bookingUseCase.fetchBookingsForUser(userId);
      if (response) {
        res.status(200).json({ status: true, bookings: response });
      } else {
        res.status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getBookingsByPackage(req: Request, res: Response) {
    try {
      const packageId = req.query.packageId as string;      
      const response = await this.bookingUseCase.fetchBookingsForPackage(
        packageId
      );
      if (response) {
        res.status(200).json({ status: true, bookings: response });
      } else {
        res.json({ status: false, message: "Didn't get bookings" }).status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default BookingController;
