"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const packageShema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    dur_start: {
        type: String,
        required: true,
    },
    dur_end: {
        type: String,
        required: true,
    },
    stay: {
        type: String,
        required: true,
    },
    room_type: {
        type: String,
        required: true,
    },
    amenities: {
        type: String,
        required: true,
    },
    food: {
        type: String,
        required: true,
    },
    depa_airport: {
        type: String,
    },
    depa_time: {
        type: String,
    },
    arrival_airport: {
        type: String,
    },
    arrival_time: {
        type: String,
    },
    book_start: {
        type: String,
        required: true,
    },
    book_end: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    activities: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    itinerary: {
        type: String,
        required: true,
    },
    host: {
        type: String,
        ref: "host",
        required: true,
    },
    is_verified: {
        type: Boolean,
        default: false,
    }
});
const packageModel = (0, mongoose_1.model)("package", packageShema);
exports.default = packageModel;
