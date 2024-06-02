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
class BlogUseCase {
    constructor(blogRepo, jwt) {
        this.blogRepo = blogRepo;
        this.Jwt = jwt;
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    createBlog(form, image, token, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogImage = yield (0, cloudinary_1.uploadSingleFile)(image, "Blogs");
                const user = this.Jwt.verifyToken(token);
                const created = yield this.blogRepo.createBlog(form, blogImage, user === null || user === void 0 ? void 0 : user.id, name);
                if (created) {
                    return {
                        status: true,
                        message: "Blog posted successfully.",
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
                console.log("Error creating blog:", error);
                throw new Error("Failed to create blog. Please try again.");
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    fetchBlogs(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.blogRepo.fetchBlogs(page);
                if (response) {
                    return {
                        status: true,
                        blogs: response,
                    };
                }
                else {
                    return {
                        status: false,
                        message: "No Blogs found.",
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to fetch blogs. Please try again.");
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    fetchblogDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.blogRepo.fetchBlogDetails(id);
                if (response) {
                    return {
                        status: true,
                        details: response,
                    };
                }
                else {
                    return {
                        status: false,
                        message: "Unable to fetch details",
                    };
                }
            }
            catch (error) {
                throw new Error(`Failed to fetch blog details of ${id}. Please try again.`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    fetchBlogsByUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const response = yield this.blogRepo.fetchBlogsByUser(user === null || user === void 0 ? void 0 : user.id);
                if (response) {
                    return {
                        status: true,
                        blogs: response,
                    };
                }
                else {
                    return {
                        status: false,
                        message: "No Blogs.",
                    };
                }
            }
            catch (error) {
                throw new Error(`Failed to fetch blog details of specific user. Please try again.`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    commentBlog(comment, blogId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const response = yield this.blogRepo.comment_blog(comment, user === null || user === void 0 ? void 0 : user.id, blogId);
                if (response) {
                    return {
                        status: true,
                        message: `Commented on ${response}`,
                    };
                }
                else {
                    return {
                        status: false,
                        message: `Failed to Comment.`,
                    };
                }
            }
            catch (error) {
                throw new Error(`Failed to coment on ${blogId}'s blog . Please try again.`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    likeAndUnlikeBlog(token, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.Jwt.verifyToken(token);
                const response = yield this.blogRepo.like_unlike_blog(user === null || user === void 0 ? void 0 : user.id, blogId);
                if (response) {
                    return {
                        status: true,
                        message: `You've ${response.action} on ${response.caption}`,
                    };
                }
                else {
                    return {
                        status: false,
                        message: "something went wrong.try again",
                    };
                }
            }
            catch (error) {
                throw new Error(`Failed to like or unlike on ${blogId}'s blog . Please try again.`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    removeBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.blogRepo.removeBlog(blogId);
                if (response) {
                    return {
                        status: true,
                        message: `You've successfully deleted ${response}.`,
                    };
                }
                else {
                    return {
                        status: false,
                        message: "something went wrong.try again",
                    };
                }
            }
            catch (error) {
                throw new Error(`Failed to remove ${blogId}'s blog . Please try again.`);
            }
        });
    }
}
exports.default = BlogUseCase;
