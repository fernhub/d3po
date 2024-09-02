import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus } from "shared/enums/http-status.enums";
import { HttpError } from "shared/exceptions/HttpError";

interface JwtPayload {
  userId: string;
}

export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
  console.log("Authenticating request");
  const token = req.cookies.authToken;
  if (!token) {
    console.log(req.cookies);
    console.log("no cookie found");
    return res.status(401).json({ error: "Access denied" });
  }
  console.log("token exists, decoding");
  console.log(token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (!decoded.userId) {
    console.log("userid not decoded from jwt");
    throw new HttpError({ message: "access denied", code: HttpStatus.UNAUTHORIZED });
  }
  req.user = decoded.userId;
  console.log("authentication passed");
  next();
}
