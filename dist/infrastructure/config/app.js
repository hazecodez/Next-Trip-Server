"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const travelerRoute_1 = __importDefault(require("../routes/travelerRoute"));
const hostRoute_1 = __importDefault(require("../routes/hostRoute"));
const adminRoute_1 = __importDefault(require("../routes/adminRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./socket"));
require("dotenv").config();
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json({ limit: "50mb" }));
        app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            origin: "https://furnicube.shop",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
        }));
        app.use("/", travelerRoute_1.default);
        app.use("/host", hostRoute_1.default);
        app.use("/admin", adminRoute_1.default);
        const server = http_1.default.createServer(app);
        (0, socket_1.default)(server);
        return server;
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.createServer = createServer;
