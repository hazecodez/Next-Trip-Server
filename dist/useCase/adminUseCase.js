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
class AdminUseCase {
    constructor(adminRepo, jwt, bcrypt, packageRepo) {
        this.adminRepo = adminRepo;
        this.jwt = jwt;
        this.bcrypt = bcrypt;
        this.packageRepo = packageRepo;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
        this.adminRepo = adminRepo;
        this.packageRepo = packageRepo;
    }
    adminLogin(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = loginData;
                const found = yield this.adminRepo.findAdminByEmail(email);
                if (found) {
                    const encryptedPass = yield this.bcrypt.Encryption(loginData.password, found.password);
                    if (!encryptedPass) {
                        return {
                            status: false,
                            message: "Whoops!! Incorect Password",
                        };
                    }
                    else {
                        const token = this.jwt.createToken(found._id, "admin");
                        return {
                            status: true,
                            token,
                            adminData: found,
                            message: `Welcome Admin.
            You have successfully logged in!`,
                        };
                    }
                }
                else {
                    return {
                        status: false,
                        message: "Admin email not found. Please check your email and try again.",
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    adminGoogleLogin(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = credential;
                const exist = yield this.adminRepo.findAdminByEmail(email);
                if (exist) {
                    const token = this.jwt.createToken(exist === null || exist === void 0 ? void 0 : exist._id, "admin");
                    return {
                        status: true,
                        adminData: exist,
                        message: `Welcome Admin.
          You have successfully logged in!`,
                        token,
                    };
                }
                else {
                    return {
                        status: false,
                        message: "Admin email not found. Please check your email and try again.",
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findTravelersList(search, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const travelersData = yield this.adminRepo.findTravelersData(search, page);
                return travelersData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockOrUnblockTraveler(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const acted = yield this.adminRepo.blockAndUnblockTraveler(id);
                return acted;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findHostsList(search, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hostsData = yield this.adminRepo.findHostsData(search, page);
                return hostsData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockOrUnblockHost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const acted = yield this.adminRepo.blockAndUnblockHost(id);
                return acted;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    packagesList(search, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packagesData = yield this.adminRepo.findPackagesData(search, page);
                return packagesData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    packageActions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const acted = yield this.adminRepo.verifyPackage(id);
                return acted;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findBlogsList(search, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogsData = yield this.adminRepo.findBlogsData(search, page);
                return blogsData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockOrUnblockBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const acted = yield this.adminRepo.blockAndUnblockblog(id);
                return acted;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    dashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepo.dashboard();
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sales_report() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepo.sales_report();
                return response;
            }
            catch (error) {
                console.error("Error fetching monthly package report in useCase:", error);
                throw error;
            }
        });
    }
}
exports.default = AdminUseCase;
