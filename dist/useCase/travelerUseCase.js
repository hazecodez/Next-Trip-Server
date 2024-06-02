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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env") });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("../infrastructure/utils/cloudinary");
class TravelerUseCase {
    constructor(repository, generateOtp, sendMail, Jwt, bcryption, OtpRepo) {
        this.repository = repository;
        this.generateOtp = generateOtp;
        this.sendMail = sendMail;
        this.Jwt = Jwt;
        this.bcryption = bcryption;
        this.OtpRepo = OtpRepo;
        this.repository = repository;
        this.generateOtp = generateOtp;
        this.sendMail = sendMail;
        this.Jwt = Jwt;
        this.bcryption = bcryption;
        this.OtpRepo = OtpRepo;
    }
    signUpAndSendOtp(travelerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const travelerFound = yield this.repository.findTravelerByEmail(travelerData.email);
                if (travelerFound) {
                    return { status: false, message: "User already exist." };
                }
                else {
                    const payload = {
                        email: travelerData.email,
                        role: "traveler",
                    };
                    const otp = this.generateOtp.generateOTP();
                    this.sendMail.sendEmail(travelerData.email, parseInt(otp));
                    const jwtToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: "1m",
                    });
                    this.OtpRepo.createOtpCollection(travelerData.email, otp);
                    const hashed = yield this.bcryption.Bcryption(travelerData.password);
                    hashed ? (travelerData.password = hashed) : "";
                    yield this.repository.saveTravelerToDB(travelerData);
                    return { status: true, Token: jwtToken };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    authentication(token, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeToken = this.Jwt.verifyToken(token);
                if (decodeToken) {
                    const fetchOtp = yield this.OtpRepo.getOtp(decodeToken.email);
                    if (fetchOtp) {
                        if ((fetchOtp === null || fetchOtp === void 0 ? void 0 : fetchOtp.otp) === otp) {
                            const travelerToken = this.Jwt.createToken(decodeToken._id, "traveler");
                            const travelerData = yield this.repository.fetchTravelerData(decodeToken.email);
                            yield this.repository.verifyTraveler(decodeToken.email);
                            return {
                                status: true,
                                token: travelerToken,
                                travelerData,
                                message: `Welcome ${travelerData === null || travelerData === void 0 ? void 0 : travelerData.name} to Next-Trip Website`,
                            };
                        }
                        else {
                            return { status: false, message: "Invalid otp" };
                        }
                    }
                    else {
                        return { status: false, message: "OTP has been expired" };
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgetPassSendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exist = yield this.repository.fetchTravelerData(email);
                if (exist) {
                    const otp = this.generateOtp.generateOTP();
                    yield this.sendMail.sendEmail(email, parseInt(otp));
                    yield this.OtpRepo.createOtpCollection(email, otp);
                    const token = this.Jwt.createToken(exist._id, "travelerForget");
                    return { status: true, message: `Otp re-sent to ${email}`, token };
                }
                else {
                    return { status: false, message: `You don't have account.` };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    confirmForgetOTP(token, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeToken = this.Jwt.verifyToken(token);
                const data = yield this.repository.findTravelerById(decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.id);
                if (decodeToken) {
                    const fetchOtp = yield this.OtpRepo.getOtp(data === null || data === void 0 ? void 0 : data.email);
                    if ((fetchOtp === null || fetchOtp === void 0 ? void 0 : fetchOtp.otp) === otp) {
                        return {
                            status: true,
                            message: `You can update your password now.`,
                        };
                    }
                    else {
                        return { status: false, message: "Invalid otp" };
                    }
                }
                else {
                    return { status: false, message: "OTP has been expired" };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    resendOtp(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeToken = this.Jwt.verifyToken(token);
                if (decodeToken) {
                    const otp = this.generateOtp.generateOTP();
                    yield this.sendMail.sendEmail(decodeToken.email, parseInt(otp));
                    yield this.OtpRepo.createOtpCollection(decodeToken.email, otp);
                    return { status: true, message: `Otp re-sent to ${decodeToken.email}` };
                }
                else {
                    return {
                        status: false,
                        message: "Something went wrong please re-register your account.",
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    Login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const travalerFound = yield this.repository.findTravelerByEmail(email);
            if (travalerFound) {
                const traveler = yield this.repository.fetchTravelerData(email);
                if (!(travalerFound === null || travalerFound === void 0 ? void 0 : travalerFound.isVerified)) {
                    return { status: false, message: "Account is not verified!!" };
                }
                const correct = yield this.bcryption.Encryption(password, travalerFound.password);
                if (!correct) {
                    return { status: false, message: "Whhoops!! Incorrect password" };
                }
                else if (travalerFound.isBlocked) {
                    return { status: false, message: "You can't access this account!!" };
                }
                else {
                    const token = this.Jwt.createToken(travalerFound._id, "traveler");
                    return {
                        status: true,
                        token,
                        traveler,
                        message: `Welcome to Next-Trip Personal Account.`,
                    };
                }
            }
            else {
                return { status: false, message: "Please create an account." };
            }
        });
    }
    googleAuthLogin(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = credential;
                const exist = yield this.repository.findTravelerByEmail(email);
                if (exist) {
                    if (exist.isBlocked) {
                        return {
                            status: false,
                            message: "You can't access this account!!",
                        };
                    }
                    else {
                        const travelerData = yield this.repository.fetchTravelerData(email);
                        const token = this.Jwt.createToken(travelerData === null || travelerData === void 0 ? void 0 : travelerData._id, "traveler");
                        return {
                            status: true,
                            travelerData,
                            message: "Welcome to Next-Trip Personal Account.",
                            token,
                        };
                    }
                }
                else {
                    const traveler = yield this.repository.saveGoogleUser(credential);
                    const token = this.Jwt.createToken(traveler === null || traveler === void 0 ? void 0 : traveler._id, "traveler");
                    const travelerData = yield this.repository.fetchTravelerData(email);
                    return {
                        status: true,
                        travelerData,
                        message: "Welcome to Next-Trip Personal Account.",
                        token,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    upadateTravelerPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeToken = this.Jwt.verifyToken(token);
                const hashedPass = yield this.bcryption.Bcryption(password);
                const response = yield this.repository.updateTravelerPassword(decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.id, hashedPass ? hashedPass : "");
                if (response) {
                    return {
                        status: true,
                        message: `Successfully updated your password`,
                    };
                }
                else {
                    return {
                        status: false,
                        message: `Oops! something went wrong.`,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    travelerProfile(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const Traveler = yield this.repository.findTravelerById(user === null || user === void 0 ? void 0 : user.id);
                if (Traveler) {
                    return {
                        status: true,
                        Traveler,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    profileUpdate(token, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const update = yield this.repository.updateProfile(data, user === null || user === void 0 ? void 0 : user.id);
                if (update) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changePassword(token, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const traveler = yield this.repository.findTravelerById(user === null || user === void 0 ? void 0 : user.id);
                const correct = yield this.bcryption.Encryption(data.currPass, traveler === null || traveler === void 0 ? void 0 : traveler.password);
                if (!correct) {
                    return { status: false, message: "Enter valid current password" };
                }
                else {
                    const hashed = yield this.bcryption.Bcryption(data.newPass);
                    const changed = yield this.repository.updateTravelerPassword(user === null || user === void 0 ? void 0 : user.id, hashed ? hashed : "");
                    if (changed) {
                        return {
                            status: true,
                            message: `Successfully updated your password`,
                        };
                    }
                    else {
                        return {
                            status: false,
                            message: `Oops! something went wrong.`,
                        };
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const hashed = yield this.bcryption.Bcryption(password);
                const created = yield this.repository.updateTravelerPassword(user === null || user === void 0 ? void 0 : user.id, hashed ? hashed : "");
                if (created) {
                    return {
                        status: true,
                        message: "Password created successfully.",
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
    profilePicUpdate(token, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publicId = yield (0, cloudinary_1.uploadSingleFile)(image, "Travelers_Pics");
                const user = this.Jwt.verifyToken(token);
                const updated = yield this.repository.profilePicUpdate(user === null || user === void 0 ? void 0 : user.id, publicId);
                if (updated) {
                    return {
                        status: true,
                        message: "Profile Picture Updated Successfully",
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
    verifyTokenAndFindTraveler(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const traveler = yield this.repository.findTravelerById(user === null || user === void 0 ? void 0 : user.id);
                return traveler;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findTravelerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const traveler = yield this.repository.findTravelerById(id);
                return traveler;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    cancelAmountToWallet(Data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    walletPayment(Data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield this.repository.walletPayment(id, Data);
                if (updated)
                    return true;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = TravelerUseCase;
