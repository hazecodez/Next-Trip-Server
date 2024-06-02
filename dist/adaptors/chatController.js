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
class chatController {
    constructor(chatUseCase, Jwt) {
        this.chatUseCase = chatUseCase;
        this.Jwt = Jwt;
    }
    newConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sender = this.Jwt.verifyToken(req.cookies.traveler);
                if (sender) {
                    const receiverId = req.query.hostId;
                    const newConversation = yield this.chatUseCase.newConversation(sender.id, receiverId);
                    res.status(200).json(newConversation);
                }
                else {
                    res.json({ message: "Didn't verify traveler token." }).status(401);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.chatUseCase.getMessages(req.body.conversationId);
                res.status(200).json(messages);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.userId;
                const conversations = yield this.chatUseCase.getConversations(id);
                res.status(200).json(conversations.data);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const message = yield this.chatUseCase.addMessage(data);
                res.status(200).json(message.data);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                const who = req.body.who;
                const found = yield this.chatUseCase.findUserById(userId, who);
                res.status(200).json(found);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = chatController;
