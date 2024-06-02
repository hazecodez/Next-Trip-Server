"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
class Jwt {
    constructor() {
        this.secret = process.env.JWT_SECRET || "";
    }
    createToken(id, role) {
        try {
            let payload = { id, role };
            const token = (0, jsonwebtoken_1.sign)(payload, this.secret, { expiresIn: "1d" });
            return token;
        }
        catch (error) {
            console.log("Error occured when creating JWT token :", error);
            throw error;
        }
    }
    verifyToken(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, this.secret);
            return decoded;
        }
        catch (error) {
            console.log("Error occured when verifying JWT token");
            return null;
        }
    }
}
exports.default = Jwt;
