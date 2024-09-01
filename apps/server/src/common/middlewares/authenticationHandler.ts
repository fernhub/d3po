import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus } from "shared/enums/http-status.enums";
import { HttpError } from "shared/exceptions/HttpError";

interface JwtPayload {
  userId: string;
}

export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
  console.log(req.cookies);
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  console.log("token exists, decoding");
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  console.log(`decoded`);
  if (!decoded.userId) {
    console.log("throwing error from inside auth handler");
    throw new HttpError({ message: "access denied", code: HttpStatus.UNAUTHORIZED });
  }
  req.user = decoded.userId;
  console.log("going to next");
  next();
}
