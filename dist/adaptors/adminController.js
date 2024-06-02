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
class AdminController {
    constructor(adminUseCase) {
        this.adminUseCase = adminUseCase;
        this.adminUseCase = adminUseCase;
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUseCase.adminLogin(req.body);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .cookie("adminToken", response.token, {
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
            catch (error) {
                console.log(error);
            }
        });
    }
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUseCase.adminGoogleLogin(req.body);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .cookie("adminToken", response.token, {
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
            catch (error) {
                console.log(error);
            }
        });
    }
    getTravelersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page);
                const travelers = yield this.adminUseCase.findTravelersList(search, page);
                if (travelers) {
                    res.status(200).json({ status: true, travelers });
                }
                else {
                    res.json({ status: false, message: "Unable to fetch." });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPackagesList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page);
                const packages = yield this.adminUseCase.packagesList(search, page);
                if (packages) {
                    res.status(200).json({ status: true, packages });
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
    package_Actions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this.adminUseCase.packageActions(id);
                if (response) {
                    res.status(200).json({ status: true, response });
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
    block_unblock_Traveler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this.adminUseCase.blockOrUnblockTraveler(id);
                if (response) {
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
    getHostsList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page);
                const hosts = yield this.adminUseCase.findHostsList(search, page);
                if (hosts) {
                    res.status(200).json({ status: true, hosts });
                }
                else {
                    res.json({ status: false, message: "Unable to fetch." });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    block_unblock_Host(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this.adminUseCase.blockOrUnblockHost(id);
                if (response) {
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
    getBlogList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page);
                const blogs = yield this.adminUseCase.findBlogsList(search, page);
                if (blogs) {
                    res.status(200).json({ status: true, blogs });
                }
                else {
                    res.json({ status: false, message: "Unable to fetch." });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    block_unblock_Blogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const response = yield this.adminUseCase.blockOrUnblockBlog(id);
                if (response) {
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
    dashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUseCase.dashboard();
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
    sales_report(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUseCase.sales_report();
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
exports.default = AdminController;
