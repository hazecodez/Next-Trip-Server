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
const cloudinary_1 = require("../infrastructure/utils/cloudinary");
class PackageUseCase {
    constructor(repository, jwt) {
        this.repository = repository;
        this.Jwt = jwt;
    }
    createPackage(form, images, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageFiles = yield (0, cloudinary_1.uploadFiles)(images, "Packages");
                const host = this.Jwt.verifyToken(token);
                const saved = yield this.repository.savePackageData(form, imageFiles, host === null || host === void 0 ? void 0 : host.id);
                if (saved) {
                    return {
                        status: true,
                        message: "Package created successfully, wait for the verification by admin.",
                    };
                }
                else {
                    return {
                        status: false,
                        message: "Oops!! Something went wrong. try again.",
                    };
                }
            }
            catch (error) {
                console.error("Error creating package:", error);
                throw new Error("Failed to create package. Please try again.");
            }
        });
    }
    updatePackage(form, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageFiles = yield (0, cloudinary_1.uploadFiles)(images, "Packages");
                const updated = yield this.repository.updatePackage(form, imageFiles);
                if (updated) {
                    return {
                        status: true,
                        message: "Package updated successfully, wait for the verification by admin.",
                    };
                }
                else {
                    return {
                        status: false,
                        message: "Oops!! Something went wrong. try again.",
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPackagesByHost(token, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeToken = this.Jwt.verifyToken(token);
                if (decodeToken) {
                    const packageList = yield this.repository.getPackagesById(decodeToken.id, page);
                    return packageList;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPackageCountByHost(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeToken = this.Jwt.verifyToken(token);
                if (decodeToken) {
                    const packageCount = yield this.repository.getPackageCountByHost(decodeToken.id);
                    return packageCount;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPackageDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield this.repository.getPackageDetails(id);
                return details;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchAllPackages(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.repository.getAllPackages(page);
                if (response) {
                    return {
                        status: true,
                        packages: response,
                    };
                }
                else {
                    return {
                        status: false,
                        message: "No packages is available.",
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = PackageUseCase;
