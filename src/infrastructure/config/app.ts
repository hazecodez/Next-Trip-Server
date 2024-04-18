import express, { urlencoded } from "express";
import cors from "cors";
import travelerRoute from "../routes/travelerRoute";
import hostRoute from "../routes/hostRoute";
import adminRoute from "../routes/adminRoute";
import cookieParser from "cookie-parser";

export const createServer = () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(
      cors({
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
      })
    );

    app.use("/", travelerRoute);
    app.use("/host", hostRoute);
    app.use("/admin", adminRoute);

    return app;
  } catch (error: any) {
    console.log(error.message);
  }
};
