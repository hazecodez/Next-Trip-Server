import { JwtPayload } from "jsonwebtoken";

interface IJwt {
  createToken(id: string | undefined, role: string): string;
  verifyToken(token: string): JwtPayload | null;
}

export default IJwt;
