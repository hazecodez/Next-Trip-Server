"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    members: {
        type: [String],
    },
}, {
    timestamps: true,
});
const conversationModel = (0, mongoose_1.model)("conversation", conversationSchema);
exports.default = conversationModel;
