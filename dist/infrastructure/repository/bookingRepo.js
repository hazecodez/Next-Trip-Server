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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookingModel_1 = __importDefault(require("../database/bookingModel"));
class BookingRepo {
    saveBookedPackage(id, Data, book_end, startDate, durEnd, hostId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookEndDate = new Date(book_end);
                // Subtract three days from the bookendDate to get the cancelDate
                const cancelDate = new Date(bookEndDate);
                cancelDate.setDate(cancelDate.getDate() - 3);
                const saved = yield bookingModel_1.default.create({
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
                if (saved)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    fetchBookingByUserId(id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 4;
                const skip = (page - 1) * limit;
                const TotalBookings = yield bookingModel_1.default
                    .find({ travelerId: id })
                    .countDocuments();
                const totalPages = Math.floor(TotalBookings / limit);
                const bookings = yield bookingModel_1.default
                    .find({ travelerId: id })
                    .sort({ cancelDate: 1 })
                    .skip(skip)
                    .limit(limit);
                return { bookings, totalPages };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchBookingByPackageId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingModel_1.default.find({ packageId: id });
                return bookings;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield bookingModel_1.default.findOneAndDelete({ _id: id });
                if (deleted)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    fetchBookingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Booking = yield bookingModel_1.default.findOne({ _id: id });
                return Booking;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = BookingRepo;
