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
const connectDB_1 = require("./infrastructure/config/connectDB");
const app_1 = require("./infrastructure/config/app");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env") });
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, connectDB_1.connectDB)();
        const app = (0, app_1.createServer)();
        app === null || app === void 0 ? void 0 : app.listen(5050, () => {
            console.log(`Server running on ${"http://localhost:5050"}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
