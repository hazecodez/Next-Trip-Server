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
class HostUseCase {
    constructor(repository, generateOtp, sendMail, Jwt, bcryption, OtpRepo, travelerRepo) {
        this.repository = repository;
        this.generateOtp = generateOtp;
        this.sendMail = sendMail;
        this.Jwt = Jwt;
        this.bcryption = bcryption;
        this.OtpRepo = OtpRepo;
        this.travelerRepo = travelerRepo;
        this.repository = repository;
        this.generateOtp = generateOtp;
        this.sendMail = sendMail;
        this.Jwt = Jwt;
        this.bcryption = bcryption;
        this.OtpRepo = OtpRepo;
        this.travelerRepo = travelerRepo;
    }
    signUpAndSendOtp(hostData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hostFound = yield this.repository.findHostByEmail(hostData.email);
                if (hostFound) {
                    return { status: false, message: "Host already exist." };
                }
                else {
                    const payload = {
                        email: hostData.email,
                        role: "host",
                    };
                    const otp = this.generateOtp.generateOTP();
                    this.sendMail.sendEmail(hostData.email, parseInt(otp));
                    const jwtToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: "1m",
                    });
                    this.OtpRepo.createOtpCollection(hostData.email, otp);
                    const hashed = yield this.bcryption.Bcryption(hostData.password);
                    hashed ? (hostData.password = hashed) : "";
                    yield this.repository.saveHostToDB(hostData);
                    return { status: true, Token: jwtToken };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    authentication(token, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeToken = this.Jwt.verifyToken(token);
                if (decodeToken) {
                    const fetchOtp = yield this.OtpRepo.getOtp(decodeToken.email);
                    if ((fetchOtp === null || fetchOtp === void 0 ? void 0 : fetchOtp.otp) === otp) {
                        yield this.repository.verifyHostEmail(decodeToken.email);
                        return {
                            status: true,
                            message: `Your account is created wait for account verification by Admin.`,
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
                let decodeToken = this.Jwt.verifyToken(token);
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
            try {
                let hostFound = yield this.repository.findHostByEmail(email);
                if (hostFound) {
                    const host = yield this.repository.fetchHostData(email);
                    if (!hostFound.emailVerified) {
                        return {
                            status: false,
                            message: "Your Business Email is not verified!!",
                        };
                    }
                    else if (!hostFound.isVerified) {
                        return {
                            status: false,
                            message: "Your account isn't verified by Admin. Please wait.",
                        };
                    }
                    const correct = yield this.bcryption.Encryption(password, hostFound.password);
                    if (!correct) {
                        return { status: false, message: "Whhoops!! Incorrect password" };
                    }
                    else if (hostFound.isBlocked) {
                        return { status: false, message: "You can't access this account!!" };
                    }
                    else {
                        const token = this.Jwt.createToken(hostFound._id, "host");
                        return {
                            status: true,
                            token,
                            host,
                            message: `Welcome to Next-Trip MyBIZ Account.`,
                        };
                    }
                }
                else {
                    return { status: false, message: "Please create an account." };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    googleAuthLogin(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = credential;
                const exist = yield this.repository.findHostByEmail(email);
                if (exist) {
                    if (exist.isBlocked) {
                        return {
                            status: false,
                            message: "You can't access this account!!",
                        };
                    }
                    else if (!exist.emailVerified) {
                        return {
                            status: false,
                            message: "Your Business Email is not verified!!",
                        };
                    }
                    else if (!exist.isVerified) {
                        return {
                            status: false,
                            message: "Your account isn't verified by Admin. Please wait.",
                        };
                    }
                    else {
                        const hostData = yield this.repository.fetchHostData(email);
                        const token = this.Jwt.createToken(hostData === null || hostData === void 0 ? void 0 : hostData._id, "host");
                        return {
                            status: true,
                            hostData,
                            token,
                            message: `Welcome to Next-Trip MyBIZ Account.`,
                        };
                    }
                }
                else {
                    yield this.repository.saveGoogleUser(credential);
                    return {
                        status: true,
                        message: "Your account is created wait for account verification by Admin.",
                    };
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
                const exist = yield this.repository.fetchHostData(email);
                if (exist) {
                    const otp = this.generateOtp.generateOTP();
                    yield this.sendMail.sendEmail(email, parseInt(otp));
                    yield this.OtpRepo.createOtpCollection(email, otp);
                    const token = this.Jwt.createToken(exist._id, "hostForget");
                    return { status: true, message: `Otp sent to ${email}`, token };
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
                let decodeToken = this.Jwt.verifyToken(token);
                const data = yield this.repository.findHostById(decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.id);
                if (decodeToken) {
                    let fetchOtp = yield this.OtpRepo.getOtp(data === null || data === void 0 ? void 0 : data.email);
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
    upadateHostPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decodeToken = this.Jwt.verifyToken(token);
                const hashedPass = yield this.bcryption.Bcryption(password);
                const response = yield this.repository.updateHostPassword(decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.id, hashedPass ? hashedPass : "");
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
    updateHostWallet(Data, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const traveler = yield this.travelerRepo.findTravelerById(user === null || user === void 0 ? void 0 : user.id);
                const updated = yield this.repository.creditedToWallet(Data, traveler);
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
                const updated = yield this.repository.debitedFromWallet(Data, travelerName, hostId);
                if (updated)
                    return true;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getHostProfile(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const host = this.Jwt.verifyToken(token);
                const Host = yield this.repository.findHostById(host === null || host === void 0 ? void 0 : host.id);
                if (Host) {
                    return { status: true, Host };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    hostProfileUpdate(token, data) {
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
                const host = yield this.repository.findHostById(user === null || user === void 0 ? void 0 : user.id);
                const correct = yield this.bcryption.Encryption(data.currPass, host === null || host === void 0 ? void 0 : host.password);
                if (!correct) {
                    return { status: false, message: "Enter valid current password" };
                }
                else {
                    const hashed = yield this.bcryption.Bcryption(data.newPass);
                    const changed = yield this.repository.updateHostPassword(user === null || user === void 0 ? void 0 : user.id, hashed ? hashed : "");
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
                const created = yield this.repository.updateHostPassword(user === null || user === void 0 ? void 0 : user.id, hashed ? hashed : "");
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
                const publicId = yield (0, cloudinary_1.uploadSingleFile)(image, "Hosts_Pics");
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
    booking_report(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const host = this.Jwt.verifyToken(token);
                const response = yield this.repository.booking_report(host === null || host === void 0 ? void 0 : host.id);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = HostUseCase;
