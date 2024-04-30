import { sign, JwtPayload, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

class Jwt {
  private secret: string;
  constructor() {
    this.secret = process.env.JWT_SECRET || "";
  }
  createToken(id: string | undefined, role: string): string {  
    
    try {
      let payload = { id, role };
      const token = sign(payload, this.secret, { expiresIn: "1d" });
      return token;
    } catch (error) {
      console.log("Error occured when creating JWT token :", error);
      throw error;
    }
  }
  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      console.log("Error occured when verifying JWT token");
      return null;
    }
  }
}

export default Jwt;
