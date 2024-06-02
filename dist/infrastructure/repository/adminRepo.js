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
const adminModel_1 = __importDefault(require("../database/adminModel"));
const travelerModel_1 = __importDefault(require("../database/travelerModel"));
const hostModel_1 = __importDefault(require("../database/hostModel"));
const packageModel_1 = __importDefault(require("../database/packageModel"));
const blogModel_1 = __importDefault(require("../database/blogModel"));
class AdminRepo {
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield adminModel_1.default.findOne({ email: email });
                return adminData ? adminData.toObject() : null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findTravelersData(search, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 6;
                const skip = (page - 1) * limit;
                const TotalTravelers = yield travelerModel_1.default.find({}).countDocuments();
                const totalPages = Math.floor(TotalTravelers / limit);
                const travelers = yield travelerModel_1.default
                    .find({
                    $or: [
                        { name: { $regex: "^" + search, $options: "i" } },
                        { email: { $regex: "^" + search, $options: "i" } },
                    ],
                })
                    .skip(skip)
                    .limit(limit);
                return { travelers, totalPages };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockAndUnblockTraveler(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const traveler = yield travelerModel_1.default.findById(id);
                if (traveler === null || traveler === void 0 ? void 0 : traveler.isBlocked) {
                    yield travelerModel_1.default.findOneAndUpdate({ _id: id }, { isBlocked: false }, { new: true });
                    return true;
                }
                else {
                    yield travelerModel_1.default.findOneAndUpdate({ _id: id }, { isBlocked: true }, { new: true });
                    return true;
                }
            }
            catch (error) {
                return false;
            }
        });
    }
    findHostsData(search, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 6;
                const skip = (page - 1) * limit;
                const totalHosts = yield hostModel_1.default.find({}).countDocuments();
                const totalPages = Math.floor(totalHosts / limit);
                const hosts = yield hostModel_1.default
                    .find({
                    $or: [
                        { name: { $regex: "^" + search, $options: "i" } },
                        { email: { $regex: "^" + search, $options: "i" } },
                    ],
                })
                    .skip(skip)
                    .limit(limit);
                return { hosts, totalPages };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyPackage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageData = yield packageModel_1.default.findById(id);
                if (!(packageData === null || packageData === void 0 ? void 0 : packageData.is_verified)) {
                    yield packageModel_1.default.findOneAndUpdate({ _id: id }, { is_verified: true });
                }
                else {
                    yield packageModel_1.default.findOneAndUpdate({ _id: id }, { is_verified: false });
                }
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    blockAndUnblockHost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const host = yield hostModel_1.default.findById(id);
                if (host === null || host === void 0 ? void 0 : host.isBlocked) {
                    yield hostModel_1.default.findOneAndUpdate({ _id: id }, { isBlocked: false }, { new: true });
                    return true;
                }
                else {
                    yield hostModel_1.default.findOneAndUpdate({ _id: id }, { isBlocked: true }, { new: true });
                    return true;
                }
            }
            catch (error) {
                return false;
            }
        });
    }
    findPackagesData(search, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 6;
                const skip = (page - 1) * limit;
                const totalPackages = yield packageModel_1.default.find({}).countDocuments();
                const totalPages = Math.floor(totalPackages / limit);
                const packages = yield packageModel_1.default
                    .find({
                    $or: [
                        { name: { $regex: "^" + search, $options: "i" } },
                        { destination: { $regex: "^" + search, $options: "i" } },
                    ],
                })
                    .skip(skip)
                    .limit(limit);
                return { packages, totalPages };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findBlogsData(search, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 6;
                const skip = (page - 1) * limit;
                const TotalBlogs = yield blogModel_1.default.find({}).countDocuments();
                const totalPages = Math.floor(TotalBlogs / limit);
                const blogs = yield blogModel_1.default
                    .find({
                    $or: [
                        { caption: { $regex: "^" + search, $options: "i" } },
                        { location: { $regex: "^" + search, $options: "i" } },
                    ],
                })
                    .skip(skip)
                    .limit(limit);
                return { blogs, totalPages };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockAndUnblockblog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogModel_1.default.findById(id);
                if (blog === null || blog === void 0 ? void 0 : blog.isBlocked) {
                    yield blogModel_1.default.findOneAndUpdate({ _id: id }, { isBlocked: false }, { new: true });
                    return true;
                }
                else {
                    yield blogModel_1.default.findOneAndUpdate({ _id: id }, { isBlocked: true }, { new: true });
                    return true;
                }
            }
            catch (error) {
                return false;
            }
        });
    }
    dashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogModel_1.default.find().countDocuments();
                const packages = yield packageModel_1.default.find().countDocuments();
                const traveler = yield travelerModel_1.default.find().countDocuments();
                const hosts = yield hostModel_1.default.find().countDocuments();
                return { blog, packages, traveler, hosts };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sales_report() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield packageModel_1.default.aggregate([
                    {
                        $group: {
                            _id: {
                                year: {
                                    $year: { $dateFromString: { dateString: "$dur_start" } },
                                },
                                month: {
                                    $month: { $dateFromString: { dateString: "$dur_start" } },
                                },
                            },
                            packageCount: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            year: "$_id.year",
                            month: "$_id.month",
                            packageCount: 1,
                        },
                    },
                    {
                        $sort: { year: 1, month: 1 },
                    },
                ]);
                return report;
            }
            catch (error) {
                console.error("Error fetching monthly package report:", error);
                throw error;
            }
        });
    }
}
exports.default = AdminRepo;
