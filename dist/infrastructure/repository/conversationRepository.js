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
const conversationModel_1 = __importDefault(require("../database/conversationModel"));
const hostModel_1 = __importDefault(require("../database/hostModel"));
const travelerModel_1 = __importDefault(require("../database/travelerModel"));
class conversationRepository {
    saveNewConversation(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const found = yield conversationModel_1.default.findOne({
                    members: { $all: [senderId, receiverId] },
                });
                if (found)
                    return found;
                const newConversation = new conversationModel_1.default({
                    members: [senderId, receiverId],
                });
                yield newConversation.save();
                return newConversation;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getConversations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield conversationModel_1.default.find({
                    members: { $in: [id] },
                });
                if (conversations) {
                    return conversations;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserById(userId, who) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (who === "traveler") {
                    const found = yield hostModel_1.default.findById(userId, { name: 1 });
                    return found;
                }
                const found = yield travelerModel_1.default.findById(userId, { name: 1 });
                return found;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = conversationRepository;
