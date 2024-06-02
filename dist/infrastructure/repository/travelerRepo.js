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
const travelerModel_1 = __importDefault(require("../database/travelerModel"));
class TravelerRepo {
    //repository for finding traveler data from DB
    findTravelerByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataFound = yield travelerModel_1.default.findOne({ email: email });
                return dataFound ? dataFound.toObject() : null;
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Unable to find traveler data.");
            }
        });
    }
    findTravelerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield travelerModel_1.default.findById(id);
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //repository for saving traveler data to DB
    saveTravelerToDB(traveler) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let travelerData = new travelerModel_1.default(traveler);
                yield travelerData.save();
                return travelerData ? travelerData.toObject() : null;
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Unable save traveler data to DB");
            }
        });
    }
    //repository for verify travaler
    verifyTraveler(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield travelerModel_1.default.findOneAndUpdate({ email: email }, { isVerified: true });
        });
    }
    //repository for finding traveler's specified data from DB
    fetchTravelerData(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const travaler = yield travelerModel_1.default.findOne({ email: email }, { email: 1, name: 1 });
                return travaler;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //repository for save traveler's data login by googleAuth to DB
    saveGoogleUser(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saved = yield travelerModel_1.default.create({
                    email: credential.email,
                    name: credential.name,
                    isVerified: true,
                    googleId: credential.sub,
                });
                return saved;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateTravelerPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield travelerModel_1.default.findOneAndUpdate({ _id: id }, { password: password });
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
                const updated = yield travelerModel_1.default.findOneAndUpdate({ _id: id }, {
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
                const updated = yield travelerModel_1.default.findOneAndUpdate({ _id: id }, { image: image });
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
    cancelAmountToWallet(id, Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield travelerModel_1.default.findOneAndUpdate({ _id: id }, {
                    $inc: { wallet: Data.totalPrice },
                    $push: {
                        walletHistory: {
                            packageName: Data.packageName,
                            amount: Data.totalPrice,
                            status: "Cancelled",
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
    walletPayment(id, Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield travelerModel_1.default.findOneAndUpdate({ _id: id }, {
                    $inc: { wallet: -Data.totalPrice },
                    $push: {
                        walletHistory: {
                            packageName: Data.name,
                            amount: Data.totalPrice,
                            status: "Booked",
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
}
exports.default = TravelerRepo;
