"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    otp: {
        type: String,
    },
    email: {
        type: String,
    },
    createdAt: {
        type: Date,
        expires: 60,
        default: Date.now,
    },
});
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 });
const otpModel = (0, mongoose_1.model)("otp", OtpSchema);
exports.default = otpModel;
