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
const bcrypt_1 = __importDefault(require("bcrypt"));
class Bcrypt {
    Bcryption(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let hashed = bcrypt_1.default.hash(password, 10);
                return hashed;
            }
            catch (error) {
                console.log("Couldn't hash the password : ", error);
            }
        });
    }
    Encryption(password, hashPass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let verifiedPass = bcrypt_1.default.compare(password, hashPass);
                return verifiedPass;
            }
            catch (error) {
                console.log("Couldn't compare the hashed password : ", error);
            }
        });
    }
}
exports.default = Bcrypt;
