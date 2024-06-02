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
class HostController {
    constructor(hostUseCase, packageUseCase) {
        this.hostUseCase = hostUseCase;
        this.packageUseCase = packageUseCase;
    }
    SignUpAndSendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signUpResponse = yield this.hostUseCase.signUpAndSendOtp(req.body);
                if (signUpResponse === null || signUpResponse === void 0 ? void 0 : signUpResponse.status) {
                    res
                        .cookie("hostOtp", signUpResponse.Token, {
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
                const token = req.cookies.hostOtp;
                const response = yield this.hostUseCase.resendOtp(token);
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
    AuthenticateHost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.hostOtp;
                const response = yield this.hostUseCase.authentication(token, req.body.otp);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response);
                }
                else {
                    res.json(response).status(401);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    Host_Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const verifiedHost = yield this.hostUseCase.Login(email, password);
                if (verifiedHost && verifiedHost.status) {
                    if (verifiedHost === null || verifiedHost === void 0 ? void 0 : verifiedHost.status) {
                        res
                            .cookie("host", verifiedHost.token, {
                            expires: new Date(Date.now() + 25892000000),
                            secure: true,
                        })
                            .status(200)
                            .json({ verifiedHost });
                    }
                    else {
                        res.json(verifiedHost).status(401);
                    }
                }
                else {
                    res.json({ verifiedHost }).status(401);
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
                const response = yield this.hostUseCase.googleAuthLogin(req.body);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    if (response.token) {
                        res
                            .cookie("host", response.token, {
                            expires: new Date(Date.now() + 25892000000),
                            secure: true,
                        })
                            .status(200)
                            .json(response);
                    }
                    else {
                        res.json(response).status(401);
                    }
                }
                else {
                    res.json(response).status(401);
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
                const response = yield this.hostUseCase.forgetPassSendOTP(email);
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
                const response = yield this.hostUseCase.confirmForgetOTP(token, req.body.otp);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response);
                }
                else {
                    res.json(response).status(401);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateHostPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.forget;
                const response = yield this.hostUseCase.upadateHostPassword(token, req.body.password);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response);
                }
                else {
                    res.json(response).status(500);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getHostProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.host;
                const response = yield this.hostUseCase.getHostProfile(token);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response.Host);
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
    hostProfileUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.host;
                const response = yield this.hostUseCase.hostProfileUpdate(token, req.body);
                if (response) {
                    res
                        .status(200)
                        .json({ status: true, message: "Successfully updated." });
                }
                else {
                    res
                        .json({ status: false, message: "Oops!! something went wrong." })
                        .status(500);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    hostChangePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.host;
                const response = yield this.hostUseCase.changePassword(token, req.body);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .status(200)
                        .json({ status: response.status, message: response.message });
                }
                else {
                    res.json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message });
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
                const token = req.cookies.host;
                const response = yield this.hostUseCase.createPassword(token, req.body.password);
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
                const token = req.cookies.host;
                const response = yield this.hostUseCase.profilePicUpdate(token, req.body.image);
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
    dashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.host;
                const Host = yield this.hostUseCase.getHostProfile(token);
                const packageCount = yield this.packageUseCase.getPackageCountByHost(token);
                if (Host && packageCount) {
                    res.status(200).json({ status: true, Host: Host.Host, packageCount });
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
    booking_report(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.host;
                const response = yield this.hostUseCase.booking_report(token);
                if (response) {
                    res.status(200).json(response);
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
}
exports.default = HostController;
