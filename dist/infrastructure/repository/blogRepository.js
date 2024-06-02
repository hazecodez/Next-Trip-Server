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
const blogModel_1 = __importDefault(require("../database/blogModel"));
class BlogRepo {
    createBlog(data, image, userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const created = yield blogModel_1.default.create({
                    caption: data.caption,
                    experience: data.experience,
                    image: image,
                    location: data.location,
                    time: new Date(),
                    userId: userId,
                    userName: name,
                });
                if (created)
                    return true;
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    fetchBlogs(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 3;
                const skip = (page - 1) * limit;
                const TotalBlogs = yield blogModel_1.default
                    .find({ isBlocked: false })
                    .countDocuments();
                const totalPages = Math.floor(TotalBlogs / limit);
                const blogs = yield blogModel_1.default
                    .find({ isBlocked: false })
                    .skip(skip)
                    .limit(limit);
                if (blogs)
                    return { blogs, totalPages };
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchBlogDetails(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield blogModel_1.default.findOne({ _id: blogId });
                if (details)
                    return details;
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchBlogsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield blogModel_1.default.find({ userId: userId });
                return blogs;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    comment_blog(comment, userId, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const caption = yield blogModel_1.default.findOne({ _id: blogId }, { caption: true });
                const newComment = {
                    senderId: userId,
                    comment: comment,
                    time: new Date(),
                };
                const added = yield blogModel_1.default.findOneAndUpdate({ _id: blogId }, { $push: { comments: newComment } }, { new: true });
                if (added)
                    return caption === null || caption === void 0 ? void 0 : caption.caption;
                return null;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    like_unlike_blog(userId, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogModel_1.default.findById(blogId);
                if (!blog) {
                    return null;
                }
                let action;
                const userIndex = blog.liked_users.indexOf(userId);
                const userLiked = blog.liked_users.includes(userId);
                if (!userLiked) {
                    // User has not liked the blog yet so like the blog
                    blog.liked_users.push(userId);
                    action = "liked";
                }
                else {
                    // User has already liked the blog so unlike the blog
                    blog.liked_users.splice(userIndex, 1);
                    action = "unliked";
                }
                yield blog.save();
                return {
                    caption: blog.caption,
                    action: action,
                };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    removeBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogModel_1.default.findById(blogId);
                const removed = yield blogModel_1.default.findOneAndDelete({ _id: blogId });
                if (removed)
                    return blog === null || blog === void 0 ? void 0 : blog.caption;
                return null;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = BlogRepo;
