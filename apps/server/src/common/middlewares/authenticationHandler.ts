import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.cookies);
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ error: "Access denied" });
    }
    console.log("token exists, decoding");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log(`decoded ${decoded}`);
    console.log(decoded.userId);
    req.user = decoded.userId;
    console.log("going to next");
    next();
  } catch (error) {
    console.log("thrown error");
    res.status(401).send({ error: "Invalid token" });
  }
}
