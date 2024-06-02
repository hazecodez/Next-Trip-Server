"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const travelerSchema = new mongoose_1.Schema({
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
    password: {
        type: String,
    },
    image: {
        type: String,
        default: "",
    },
    wallet: {
        type: Number,
        default: 0,
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
    googleId: {
        type: String,
    },
});
const travelerModel = (0, mongoose_1.model)("traveler", travelerSchema);
exports.default = travelerModel;
