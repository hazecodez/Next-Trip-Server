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
class BlogController {
    constructor(blogUseCase) {
        this.blogUseCase = blogUseCase;
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.body.name;
                const form = req.body.form;
                const image = req.body.image;
                const token = req.cookies.traveler;
                const response = yield this.blogUseCase.createBlog(form, image, token, name);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res
                        .status(200)
                        .json({ status: response.status, message: response.message });
                }
                else {
                    res
                        .json({ status: response.status, message: response.message })
                        .status(500);
                }
            }
            catch (error) {
                throw new Error("Failed to create blog. Please try again.");
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    fetchAllBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page);
                const response = yield this.blogUseCase.fetchBlogs(page);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json({
                        status: response === null || response === void 0 ? void 0 : response.status,
                        blogs: response === null || response === void 0 ? void 0 : response.blogs,
                    });
                }
                else {
                    res
                        .json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message })
                        .status(500);
                }
            }
            catch (error) {
                throw new Error("Failed to fetch blogs. Please try again.");
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    fetchBlogDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { blogId } = req.body;
                const response = yield this.blogUseCase.fetchblogDetails(blogId);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json({
                        status: response === null || response === void 0 ? void 0 : response.status,
                        details: response === null || response === void 0 ? void 0 : response.details,
                    });
                }
                else {
                    res
                        .json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message })
                        .status(500);
                }
            }
            catch (error) {
                throw new Error(`Failed to fetch blog details. Please try again.`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    fetchBlogsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const response = yield this.blogUseCase.fetchBlogsByUser(token);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json({
                        status: response === null || response === void 0 ? void 0 : response.status,
                        blogs: response === null || response === void 0 ? void 0 : response.blogs,
                    });
                }
                else {
                    res
                        .json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message })
                        .status(500);
                }
            }
            catch (error) {
                throw new Error(`Failed to fetch blog details of specific user. Please try again.`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    commentBlogByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const { blogId, comment } = req.body;
                const response = yield this.blogUseCase.commentBlog(comment, blogId, token);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json({
                        status: response === null || response === void 0 ? void 0 : response.status,
                        message: response === null || response === void 0 ? void 0 : response.message,
                    });
                }
                else {
                    res
                        .json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message })
                        .status(500);
                }
            }
            catch (error) {
                throw new Error(`Failed to coment on blog . Please try again.`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    likeAndUnlikeBlogByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.traveler;
                const { blogId } = req.body;
                const response = yield this.blogUseCase.likeAndUnlikeBlog(token, blogId);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json({
                        status: response === null || response === void 0 ? void 0 : response.status,
                        message: response === null || response === void 0 ? void 0 : response.message,
                    });
                }
                else {
                    res
                        .json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message })
                        .status(500);
                }
            }
            catch (error) {
                throw new Error(`Failed to like or unlike on blog . Please try again.`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    removeBlogByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { blogId } = req.body;
                const response = yield this.blogUseCase.removeBlog(blogId);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json({
                        status: response === null || response === void 0 ? void 0 : response.status,
                        message: response === null || response === void 0 ? void 0 : response.message,
                    });
                }
                else {
                    res
                        .json({ status: response === null || response === void 0 ? void 0 : response.status, message: response === null || response === void 0 ? void 0 : response.message })
                        .status(500);
                }
            }
            catch (error) {
                throw new Error(`Failed to remove blog . Please try again.`);
            }
        });
    }
}
exports.default = BlogController;
