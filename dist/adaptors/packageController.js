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
class PackageController {
    constructor(packageUseCase) {
        this.packageUseCase = packageUseCase;
    }
    createPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formData = req.body.form;
                const images = req.body.images;
                const host = req.cookies.host;
                const response = yield this.packageUseCase.createPackage(formData, images, host);
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
    getPackageListByHost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const token = req.cookies.host;
                const response = yield this.packageUseCase.getPackagesByHost(token, page);
                if (response) {
                    res.status(200).json({ packageList: response });
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
    fetchPackageDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const details = yield this.packageUseCase.getPackageDetails(id);
                if (details)
                    res.status(200).json(details);
                res.status(500);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    UpdatePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formData = req.body.form;
                const images = req.body.images;
                const response = yield this.packageUseCase.updatePackage(formData, images);
                if (response === null || response === void 0 ? void 0 : response.status) {
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
    fetchAllPackages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const response = yield this.packageUseCase.fetchAllPackages(page);
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
}
exports.default = PackageController;
