import BookingUseCase from "../useCase/bookingUseCase";
import { Request, Response } from "express";
import HostUseCase from "../useCase/hostUseCase";
import TravelerUseCase from "../useCase/travelerUseCase";
import PackageUseCase from "../useCase/packageUseCase";

class BookingController {
  private bookingUseCase: BookingUseCase;
  private hostUseCase: HostUseCase;
  private travelerUseCase: TravelerUseCase;
  private packageUseCase: PackageUseCase;
  constructor(
    bookingUseCase: BookingUseCase,
    hostUseCase: HostUseCase,
    travelerUseCase: TravelerUseCase,
    packageUseCase: PackageUseCase
  ) {
    this.bookingUseCase = bookingUseCase;
    this.hostUseCase = hostUseCase;
    this.travelerUseCase = travelerUseCase;
    this.packageUseCase = packageUseCase;
  }

  async bookPackage(req: Request, res: Response) {
    try {
      const token = req.cookies.traveler as string;
      const traveler = await this.travelerUseCase.verifyTokenAndFindTraveler(
        token
      );
      const response = await this.bookingUseCase.bookPackage(
        req.body,
        token,
        traveler?.email as string
      );
      if (response?.status) {
        await this.hostUseCase.updateHostWallet(req.body, token);
        if (response?.method === "Wallet") {
          await this.travelerUseCase.walletPayment(
            req.body,
            traveler?._id as string
          );
          res.status(200).json({ status: true });
        } else {
          res.status(200).json(response?.sessionId);
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
      const page = parseInt(req.query.page as string);
      const response = await this.bookingUseCase.fetchBookingsForUser(
        userId,
        page
      );
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
  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const Booking = await this.bookingUseCase.fetchBookingById(id);
      const packageDetails = await this.packageUseCase.getPackageDetails(
        Booking?.packageId
      );
      const travelerDetails = await this.travelerUseCase.findTravelerById(
        Booking?.travelerId
      );
      await this.hostUseCase.debitedFromWallet(
        Booking,
        travelerDetails?.name as string,
        packageDetails?.host as string
      );
      await this.travelerUseCase.cancelAmountToWallet(
        Booking,
        travelerDetails?._id as string
      );
      const response = await this.bookingUseCase.cancelBooking(id);
      if (response?.status) {
        res
          .status(200)
          .json({ status: response?.status, message: response?.message });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default BookingController;
