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
exports.travelerAuth = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
const travelerRepo_1 = __importDefault(require("../repository/travelerRepo"));
const jwt = new jwt_1.default();
const traveler = new travelerRepo_1.default();
const travelerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.traveler;
        if (!token) {
            res.status(401).json({
                blocked: true,
                role: "traveler",
                message: "No token found!!!",
            });
        }
        else {
            const decode = jwt.verifyToken(token);
            if (decode) {
                if (decode.role !== "traveler") {
                    return { status: false, message: "Can't access." };
                }
                else {
                    const travelerData = yield traveler.findTravelerById(decode.id);
                    if ((traveler && (travelerData === null || travelerData === void 0 ? void 0 : travelerData.isBlocked)) ||
                        !(travelerData === null || travelerData === void 0 ? void 0 : travelerData.isVerified)) {
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
exports.travelerAuth = travelerAuth;
