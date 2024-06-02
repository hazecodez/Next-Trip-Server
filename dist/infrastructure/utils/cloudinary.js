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
exports.uploadSingleFile = exports.uploadFiles = void 0;
const cloudinary_1 = require("cloudinary");
require("dotenv").config();
// for upload package images to cloudinary
const uploadFiles = (files, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const publicIds = [];
        for (const file of files) {
            const response = yield cloudinary_1.v2.uploader.upload(file, {
                folder: `Next-Trip/${folder}`,
            });
            publicIds.push(response.public_id);
        }
        return publicIds;
    }
    catch (error) {
        console.log("Error occurred when uploading images to Cloudinary.", error);
        return undefined;
    }
});
exports.uploadFiles = uploadFiles;
const uploadSingleFile = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const response = yield cloudinary_1.v2.uploader.upload(file, {
            folder: `Next-Trip/${folder}`,
        });
        return response.public_id;
    }
    catch (error) {
        console.log("Error occurred when uploading profile image to Cloudinary.", error);
        return undefined;
    }
});
exports.uploadSingleFile = uploadSingleFile;
