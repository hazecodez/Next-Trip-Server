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
const stripe_1 = require("../infrastructure/utils/stripe");
class BookingUseCase {
    constructor(bookigRepository, jwt, packageRepository, cronJob) {
        this.bookigRepository = bookigRepository;
        this.Jwt = jwt;
        this.packageRepository = packageRepository;
        this.cronJob = cronJob;
    }
    bookPackage(Data, token, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const traveler = this.Jwt.verifyToken(token);
                const packageDetails = yield this.packageRepository.getPackageDetails(Data.packageId);
                const response = yield this.bookigRepository.saveBookedPackage(traveler === null || traveler === void 0 ? void 0 : traveler.id, Data, packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails.book_end, packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails.dur_start, packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails.dur_end, packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails.host);
                yield this.packageRepository.updatePackageCapacity(Data.packageId, Data.travelers.length);
                if (response) {
                    //---------to schedule email for inform the travelers journey date. day before the start date
                    yield this.cronJob.schedule(email, packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails.dur_start, packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails.destination);
                    //-------for payment
                    if (Data.method === "Online Payment") {
                        const sessionId = yield (0, stripe_1.checkout)(Data);
                        if (sessionId) {
                            return { sessionId, status: true };
                        }
                    }
                    else {
                        return { status: true, method: "Wallet" };
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchBookingsForUser(id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.bookigRepository.fetchBookingByUserId(id, page);
                if (response)
                    return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchBookingsForPackage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.bookigRepository.fetchBookingByPackageId(id);
                if (response)
                    return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchBookingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Booking = yield this.bookigRepository.fetchBookingById(id);
                return Booking;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    cancelBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.bookigRepository.deleteBooking(id);
                if (response) {
                    return {
                        status: true,
                        message: "Booking cancelled successfully.",
                    };
                }
                else {
                    return {
                        status: false,
                        message: "Oops!! something went wrong.",
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = BookingUseCase;
