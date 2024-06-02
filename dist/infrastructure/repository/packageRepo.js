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
const packageModel_1 = __importDefault(require("../database/packageModel"));
class PackageRepo {
    savePackageData(data, images, hostId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activities, amenities, book_end, book_start, capacity, destination, dur_end, dur_start, food, host, itinerary, name, price, room_type, stay, arrival_airport, arrival_time, depa_airport, depa_time, } = data;
                const savedToDB = yield packageModel_1.default.create({
                    activities,
                    amenities,
                    arrival_airport,
                    arrival_time,
                    book_end,
                    book_start,
                    capacity,
                    depa_airport,
                    depa_time,
                    destination,
                    dur_end,
                    dur_start,
                    food,
                    name,
                    itinerary,
                    price,
                    room_type,
                    stay,
                    images: images,
                    host: hostId,
                });
                if (savedToDB)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPackagesById(id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 2;
                const skip = (page - 1) * limit;
                const today = new Date();
                const formattedToday = today.toISOString().split("T")[0];
                const totalPackages = yield packageModel_1.default
                    .find({
                    host: id,
                    is_verified: true,
                    dur_end: { $gte: formattedToday },
                })
                    .countDocuments();
                const totalPages = Math.floor(totalPackages / limit);
                const packages = yield packageModel_1.default
                    .find({
                    host: id,
                    is_verified: true,
                    dur_end: { $gte: formattedToday },
                })
                    .skip(skip)
                    .limit(limit);
                if (packages) {
                    return { packages, totalPages };
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllPackages(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 3;
                const skip = (page - 1) * limit;
                const today = new Date();
                const formattedToday = today.toISOString().split("T")[0];
                const totalPackages = yield packageModel_1.default
                    .find({
                    is_verified: true,
                    capacity: { $gt: 0 },
                    book_end: { $gte: formattedToday },
                })
                    .countDocuments();
                const totalPages = Math.floor(totalPackages / limit);
                const packages = yield packageModel_1.default
                    .find({
                    is_verified: true,
                    capacity: { $gt: 0 },
                    book_end: { $gte: formattedToday },
                })
                    .skip(skip)
                    .limit(limit);
                if (packages)
                    return { packages, totalPages };
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPackageDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield packageModel_1.default.findOne({ _id: id });
                return details;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updatePackage(data, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield packageModel_1.default.findOneAndUpdate({ _id: data._id }, {
                    activities: data.activities,
                    amenities: data.amenities,
                    arrival_airport: data.arrival_airport,
                    arrival_time: data.arrival_time,
                    book_end: data.book_end,
                    book_start: data.book_start,
                    capacity: data.capacity,
                    depa_airport: data.depa_airport,
                    depa_time: data.depa_time,
                    destination: data.destination,
                    dur_end: data.dur_end,
                    dur_start: data.dur_start,
                    food: data.food,
                    name: data.name,
                    itinerary: data.itinerary,
                    price: data.price,
                    room_type: data.room_type,
                    stay: data.stay,
                    is_verified: false,
                    images: images,
                });
                if (updated)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findPackagesDataForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packages = yield packageModel_1.default.find();
                return packages;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updatePackageCapacity(id, count) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield packageModel_1.default.findOneAndUpdate({ _id: id }, { $inc: { capacity: -count } });
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
    getPackageCountByHost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packages = yield packageModel_1.default.find({ host: id }).countDocuments();
                return packages;
            }
            catch (error) {
                console.log(error);
                return 0;
            }
        });
    }
}
exports.default = PackageRepo;
