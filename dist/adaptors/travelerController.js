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
class TravelerController {
    constructor(travelerUseCase) {
        this.travelerUseCase = travelerUseCase;
    }
    SignUpAndSendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signUpResponse = yield this.travelerUseCase.signUpAndSendOtp(req.body);
                if (signUpResponse.status) {
                    res
                        .cookie("travelerOtp", signUpResponse.Token, {
                        expires: new Date(Date.now() + 25892000000),
                        secure: true,
                    })
                        .status(200)
                        .json(signUpResponse);
                }
                else {
                    res.json(signUpResponse);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ResendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.travelerOtp;
                const response = yield this.travelerUseCase.resendOtp(token);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response);
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
    AuthenticateTraveler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.travelerOtp;
                const response = yield this.travelerUseCase.authentication(token, req.body.otp);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .cookie("traveler", response.token, {
                        expires: new Date(Date.now() + 25892000000),
                        secure: true,
                    })
                        .status(200)
                        .json(response);
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
    TravelerLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const verifiedTraveler = yield this.travelerUseCase.Login(email, password);
                if (verifiedTraveler && verifiedTraveler.status) {
                    if (verifiedTraveler.status) {
                        res
                            .cookie("traveler", verifiedTraveler.token, {
                            expires: new Date(Date.now() + 25892000000),
                            secure: true,
                        })
                            .status(200)
                            .json({ verifiedTraveler });
                    }
                    else {
                        res.json(verifiedTraveler);
                    }
                }
                else {
                    res.json({ verifiedTraveler });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    googleAuthLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.travelerUseCase.googleAuthLogin(req.body);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .cookie("traveler", response.token, {
                        expires: new Date(Date.now() + 25892000000),
                        secure: true,
                    })
                        .status(200)
                        .json(response);
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
    forgetPassSendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const response = yield this.travelerUseCase.forgetPassSendOTP(email);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .cookie("forget", response.token, {
                        expires: new Date(Date.now() + 25892000000),
                        secure: true,
                    })
                        .status(200)
                        .json(response);
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
    confirmForgetOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.forget;
                const response = yield this.travelerUseCase.confirmForgetOTP(token, req.body.otp);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response);
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
    upadateTravelerPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.forget;
                const response = yield this.travelerUseCase.upadateTravelerPassword(token, req.body.password);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response);
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
    travelerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const response = yield this.travelerUseCase.travelerProfile(token);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response.Traveler);
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
    profileUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const response = yield this.travelerUseCase.profileUpdate(token, req.body);
                if (response) {
                    res.status(200).json({ status: true, message: "Successfully updated" });
                }
                else {
                    res
                        .json({ status: false, message: "Oops!! something went wrong" })
                        .status(500);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const response = yield this.travelerUseCase.changePassword(token, req.body);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json({ status: true, message: response.message });
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
    createPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const response = yield this.travelerUseCase.createPassword(token, req.body.password);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .status(200)
                        .json({ status: response.status, message: response.message });
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
    profilePicUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const response = yield this.travelerUseCase.profilePicUpdate(token, req.body.image);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .status(200)
                        .json({ status: response.status, message: response.message });
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
exports.default = TravelerController;
