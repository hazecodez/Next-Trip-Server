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
class chatUseCase {
    constructor(CoversationRepo, MessageRepo) {
        this.CoversationRepo = CoversationRepo;
        this.MessageRepo = MessageRepo;
    }
    newConversation(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newConversation = yield this.CoversationRepo.saveNewConversation(senderId, receiverId);
                if (newConversation) {
                    return { status: true, data: newConversation };
                }
                else {
                    return { status: false };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getConversations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield this.CoversationRepo.getConversations(id);
                return { data: conversations };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMessages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.MessageRepo.getMessages(id);
                if (messages)
                    return { status: true, data: messages };
                return { status: false, data: "No Messages." };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sendMessage = yield this.MessageRepo.saveMessage(message);
                return { data: sendMessage };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserById(userId, who) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userName = yield this.CoversationRepo.findUserById(userId, who);
                return { status: true, data: userName };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = chatUseCase;
