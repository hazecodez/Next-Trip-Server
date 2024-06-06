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
const socket_io_1 = require("socket.io");
require("dotenv").config();
function socketConfiguration(server) {
    const socketIO = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
        },
    });
    let users = [];
    const addUser = (userId, socketId) => {
        const existUser = users.find((user) => user.userId === userId);
        if (existUser) {
            existUser.socketId = socketId;
            existUser.online = true;
        }
        else {
            users.push({ userId, socketId, online: true });
        }
        socketIO.emit("userOnline", users.filter((user) => user.online));
    };
    const removeUser = (socketId) => __awaiter(this, void 0, void 0, function* () {
        const user = users.find((user) => user.socketId === socketId);
        if (user) {
            user.online = false;
        }
        socketIO.emit("userOnline", users.filter((user) => user.online));
    });
    const getUser = (userId) => users.find((user) => user.userId === userId);
    socketIO.on("connection", (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            socketIO.emit("getUsers", users);
        });
        socket.on("sendMessage", ({ senderId, receiverId, text, senderName }) => {
            const user = getUser(receiverId);
            if (user) {
                socketIO.to(user.socketId).emit("getMessage", { senderId, text });
                socketIO
                    .to(user.socketId)
                    .emit("getNotification", { senderId, text, senderName });
            }
        });
        socket.on("videoCallInitiated", (data) => {
            console.log(data.receiverId);
            const user = getUser(data.receiverId);
            if (user) {
                socketIO.to(user === null || user === void 0 ? void 0 : user.socketId).emit("videoCallAccept", {
                    username: data.username,
                    roomId: data.roomId,
                });
            }
            console.log("emmitted the call event to", user === null || user === void 0 ? void 0 : user.socketId);
        });
        socket.on("disconnect", () => {
            console.log("🔥: A user disconnected");
            removeUser(socket.id).catch((err) => console.log("error during removal of user :", err));
            socketIO.emit("userOnline", users.filter((user) => user.online));
        });
    });
}
exports.default = socketConfiguration;
