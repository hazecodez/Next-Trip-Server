"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BookingController {
    constructor(bookingUseCase, hostUseCase, travelerUseCase, packageUseCase) {
        this.bookingUseCase = bookingUseCase;
        this.hostUseCase = hostUseCase;
        this.travelerUseCase = travelerUseCase;
        this.packageUseCase = packageUseCase;
    }
    bookPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const traveler = yield this.travelerUseCase.verifyTokenAndFindTraveler(token);
                const response = yield this.bookingUseCase.bookPackage(req.body, token, traveler === null || traveler === void 0 ? void 0 : traveler.email);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    yield this.hostUseCase.updateHostWallet(req.body, token);
                    if ((response === null || response === void 0 ? void 0 : response.method) === "Wallet") {
                        yield this.travelerUseCase.walletPayment(req.body, traveler === null || traveler === void 0 ? void 0 : traveler._id);
                        res.status(200).json({ status: true });
                    }
                    else {
                        res.status(200).json(response === null || response === void 0 ? void 0 : response.sessionId);
                    }
                }
                else {
                    res.json(response);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getBookingsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.travelerId;
                const page = parseInt(req.query.page);
                const response = yield this.bookingUseCase.fetchBookingsForUser(userId, page);
                if (response) {
                    res.status(200).json({ status: true, bookings: response });
                }
                else {
                    res.status(500);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getBookingsByPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageId = req.query.packageId;
                const response = yield this.bookingUseCase.fetchBookingsForPackage(packageId);
                if (response) {
                    res.status(200).json({ status: true, bookings: response });
                }
                else {
                    res.json({ status: false, message: "Didn't get bookings" }).status(500);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    cancelBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const Booking = yield this.bookingUseCase.fetchBookingById(id);
                const packageDetails = yield this.packageUseCase.getPackageDetails(Booking === null || Booking === void 0 ? void 0 : Booking.packageId);
                const travelerDetails = yield this.travelerUseCase.findTravelerById(Booking === null || Booking === void 0 ? void 0 : Booking.travelerId);
                yield this.hostUseCase.debitedFromWallet(Booking, travelerDetails === null || travelerDetails === void 0 ? void 0 : travelerDetails.name, packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails.host);
                yield this.travelerUseCase.cancelAmountToWallet(Booking, travelerDetails === null || travelerDetails === void 0 ? void 0 : travelerDetails._id);
                const response = yield this.bookingUseCase.cancelBooking(id);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .status(200)
                        .json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message });
                }
                else {
                    res
                        .json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message })
                        .status(500);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = BookingController;
