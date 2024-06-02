"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const booking_1 = require("../../domain/booking");
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    packageName: {
        type: String,
        required: true,
    },
    travelerId: {
        type: String,
        required: true,
    },
    packageId: {
        type: String,
        required: true,
    },
    cancelDate: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    hostId: {
        type: String,
        required: true,
    },
    travelers: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                },
                age: {
                    type: Number,
                    required: true,
                },
                gender: {
                    type: String,
                    enum: ["Male", "Female", "Other"],
                    required: true,
                },
            },
        ],
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(booking_1.Status),
        required: true,
    },
});
const bookingModel = (0, mongoose_1.model)("booking", bookingSchema);
exports.default = bookingModel;
