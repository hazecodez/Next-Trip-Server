import { Request, Response, NextFunction } from "express";
import Jwt from "../utils/jwt";
import HostRepo from "../repository/hostRepo";

const jwt = new Jwt();
const host = new HostRepo();

export const hostAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.host;
    if (!token) {
      res.json({ status: false, message: "No token found!!!" }).status(401);
    } else {
      const decode = jwt.verifyToken(token);

      if (decode) {
        if (decode.role !== "host") {
          return { status: false, message: "Can't access." };
        } else {
          const hostData = await host.findHostById(decode.id);

          if (
            host &&
            hostData?.isBlocked &&
            !hostData.isVerified &&
            !hostData.emailVerified
          ) {
            res.status(401).json({ blocked: true });
          } else {
            next();
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
