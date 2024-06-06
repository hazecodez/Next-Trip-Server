import express from "express";
import cors from "cors";
import travelerRoute from "../routes/travelerRoute";
import hostRoute from "../routes/hostRoute";
import adminRoute from "../routes/adminRoute";
import cookieParser from "cookie-parser";
import http from "http";
import socketConfiguration from "./socket";
require("dotenv").config();

export const createServer = () => {
  try {
    const app = express();
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    app.use(cookieParser());

    app.use(
      cors({
        origin: "https://furnicube.shop",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
      })
    );

    app.use("/", travelerRoute);
    app.use("/host", hostRoute);
    app.use("/admin", adminRoute);

    const server = http.createServer(app);
    socketConfiguration(server);

    return server;
  } catch (error: any) {
    console.log(error.message);
  }
};
