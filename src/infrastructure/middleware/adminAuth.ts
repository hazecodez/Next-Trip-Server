import { Request, Response, NextFunction } from "express";
import Jwt from "../utils/jwt";

const jwt = new Jwt();

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      res.json({ status: false, message: "no token found" }).status(401);
    } else {
      const decode = jwt.verifyToken(token);
      if (decode && decode.role !== "admin") {
        return { status: false, message: "Can't access." };
      } else {
        next();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
