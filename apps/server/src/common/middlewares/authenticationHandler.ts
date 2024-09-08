import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus } from "shared/enums/http-status.enums";
import { HttpError } from "shared/exceptions/HttpError";
import { getCookieByName, validateAuthToken } from "../utils";
import { Socket } from "socket.io";
import cookieParser from "cookie-parser";
export function authenticationHandler(req: Request, res: Response, next: NextFunction) {
  console.log("validating auth token on request");
  console.log(req.cookies);
  try {
    const token = req.cookies.authToken;
    const userId = validateAuthToken(token);
    req.user = userId;
    next();
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpError({ message: e.message, code: HttpStatus.UNAUTHORIZED });
    } else {
      throw new HttpError({ message: "user not authorized", code: HttpStatus.UNAUTHORIZED });
    }
  }
}

export function socketAuthenticationHandler(socket: Socket, next: any) {
  console.log("validating authToken on socket event");
  console.log(socket.handshake.headers);
  try {
    if (socket.handshake.headers.cookie === undefined) {
      throw new Error("error");
    }
    const authToken = getCookieByName(socket.handshake.headers.cookie, "authToken");
    console.log(authToken);
    console.log("socket auth validated");
    next();
  } catch (e) {
    next(new Error("unable to authorize user for accesssing chat"));
  }
}
