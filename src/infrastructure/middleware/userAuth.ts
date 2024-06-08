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
    const token = req.headers.authorization as string;  
    if (!token) {
      res.status(401).json({
        blocked: true,
        role: "traveler",
        message: "No token found!!!",
      });
    } else {
      const decode = jwt.verifyToken(token);

      if (decode) {
        if (decode.role !== "traveler") {
          return { status: false, message: "Can't access." };
        } else {
          const travelerData = await traveler.findTravelerById(decode.id);
          if (
            (traveler && travelerData?.isBlocked) ||
            !travelerData?.isVerified
          ) {
            res.status(401).json({
              blocked: true,
              message: "Can't access",
              role: decode.role,
            });
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
