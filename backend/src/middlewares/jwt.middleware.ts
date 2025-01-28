import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }

    try {
      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const decoded = jwt.verify(token, secretKey);

      // console.log("at middleware: ", decoded);

      // Attach decoded token to the request object
      req["user"] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
