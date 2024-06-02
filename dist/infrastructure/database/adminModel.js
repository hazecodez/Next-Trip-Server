"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    google_Id: {
        type: String,
    },
});
const adminModel = (0, mongoose_1.model)("admin", adminSchema);
exports.default = adminModel;
