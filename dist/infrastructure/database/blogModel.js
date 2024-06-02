"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    caption: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    liked_users: {
        type: [String],
        default: [],
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    comments: {
        type: [
            {
                senderId: String,
                comment: String,
                time: Date,
            },
        ],
        default: [],
    },
}, {
    timestamps: true,
});
const blogModel = (0, mongoose_1.model)("blog", blogSchema);
exports.default = blogModel;
