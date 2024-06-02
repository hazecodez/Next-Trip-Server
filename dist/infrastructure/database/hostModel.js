"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hostSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
    },
    identityImage: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    wallet: {
        type: Number,
        default: 0,
    },
    googleId: {
        type: String,
    },
    walletHistory: {
        type: [
            {
                packageName: String,
                travelerName: String,
                amount: Number,
                status: String,
                date: { type: Date, default: Date.now },
            },
        ],
        default: [],
    },
});
const hostModel = (0, mongoose_1.model)("host", hostSchema);
exports.default = hostModel;
