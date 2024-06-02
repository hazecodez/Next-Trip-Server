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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostAuth = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
const hostRepo_1 = __importDefault(require("../repository/hostRepo"));
const jwt = new jwt_1.default();
const host = new hostRepo_1.default();
const hostAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res
                .status(401)
                .json({ blocked: true, role: "host", message: "No token found!!!" });
        }
        else {
            const decode = jwt.verifyToken(token);
            if (decode) {
                if (decode.role !== "host") {
                    return { status: false, message: "Can't access." };
                }
                else {
                    const hostData = yield host.findHostById(decode.id);
                    if ((host && (hostData === null || hostData === void 0 ? void 0 : hostData.isBlocked)) ||
                        !(hostData === null || hostData === void 0 ? void 0 : hostData.isVerified) ||
                        !(hostData === null || hostData === void 0 ? void 0 : hostData.emailVerified)) {
                        res.status(401).json({
                            blocked: true,
                            message: "Can't access",
                            role: decode.role,
                        });
                    }
                    else {
                        next();
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.hostAuth = hostAuth;
