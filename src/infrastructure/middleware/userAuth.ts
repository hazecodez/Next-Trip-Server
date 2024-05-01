import { Request, Response, NextFunction } from "express";
import Jwt from "../utils/jwt";
import TravelerRepo from "../repository/travelerRepo";

const jwt = new Jwt();
const traveler = new TravelerRepo();

export const travelerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.traveler;
    if (!token) {
      res
        .json({ status: false, blocked: true, message: "No token found!!!" })
        .status(401);
    } else {
      const decode = jwt.verifyToken(token);
      if (decode) {
        if (decode.role !== "traveler") {
          return { status: false, blocked: true, message: "Can't access." };
        } else {
          const travelerData = await traveler.findTravelerById(decode.id);
          if (traveler && travelerData?.isBlocked && !travelerData.isVerified) {
            res
              .json({ status: false, blocked: true, message: "Can't access" })
              .status(401);
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
