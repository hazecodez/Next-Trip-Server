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
const hostModel_1 = __importDefault(require("../database/hostModel"));
class HostRepo {
    findHostByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataFound = yield hostModel_1.default.findOne({ email: email });
                return dataFound ? dataFound.toObject() : null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findHostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield hostModel_1.default.findById(id);
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveHostToDB(host) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hostData = new hostModel_1.default(host);
                yield hostData.save();
                return hostData ? hostData.toObject() : null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyHostEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield hostModel_1.default.findOneAndUpdate({
                email: email,
            }, { emailVerified: true });
        });
    }
    fetchHostData(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const host = yield hostModel_1.default.findOne({
                    email: email,
                }, { email: 1, name: 1 });
                return host;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveGoogleUser(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saved = yield hostModel_1.default.create({
                    email: credential.email,
                    name: credential.name,
                    emailVerified: true,
                    googleId: credential.sub,
                });
                return saved;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateHostPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield hostModel_1.default.findOneAndUpdate({ _id: id }, { password: password });
                if (updated)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateProfile(Data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield hostModel_1.default.findOneAndUpdate({ _id: id }, {
                    name: Data.name,
                    email: Data.email,
                });
                if (updated)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    profilePicUpdate(id, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield hostModel_1.default.findOneAndUpdate({ _id: id }, { image: image });
                if (updated)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    creditedToWallet(Data, traveler) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield hostModel_1.default.findOneAndUpdate({ _id: Data.hostId }, {
                    $inc: { wallet: Data.totalPrice },
                    $push: {
                        walletHistory: {
                            packageName: Data.name,
                            travelerName: traveler.name,
                            amount: Data.totalPrice,
                            status: "Credited",
                            date: new Date(),
                        },
                    },
                }, { new: true });
                if (updated)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    debitedFromWallet(Data, travelerName, hostId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield hostModel_1.default.findOneAndUpdate({ _id: hostId }, {
                    $inc: { wallet: -Data.totalPrice },
                    $push: {
                        walletHistory: {
                            packageName: Data.packageName,
                            travelerName: travelerName,
                            amount: Data.totalPrice,
                            status: "Debited",
                            date: new Date(),
                        },
                    },
                }, { new: true });
                if (updated)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    booking_report(hostId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield bookingModel_1.default.aggregate([
                    // Match bookings by host ID
                    {
                        $match: { hostId },
                    },
                    // Project necessary fields and calculate the number of travelers
                    {
                        $project: {
                            year: { $year: { $dateFromString: { dateString: "$startDate" } } },
                            month: {
                                $month: { $dateFromString: { dateString: "$startDate" } },
                            },
                            travelersCount: { $size: "$travelers" },
                        },
                    },
                    // Group by year and month and sum up the number of travelers
                    {
                        $group: {
                            _id: {
                                year: "$year",
                                month: "$month",
                            },
                            totalBookings: { $sum: "$travelersCount" },
                        },
                    },
                    // Project the final structure
                    {
                        $project: {
                            _id: 0,
                            year: "$_id.year",
                            month: "$_id.month",
                            totalBookings: 1,
                        },
                    },
                    // Sort by year and month
                    {
                        $sort: { year: 1, month: 1 },
                    },
                ]);
                return report;
            }
            catch (error) {
                console.error("Error fetching monthly booking report:", error);
                throw error;
            }
        });
    }
}
exports.default = HostRepo;
