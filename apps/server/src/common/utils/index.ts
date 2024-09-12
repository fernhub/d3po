import { env } from "$/config";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

/**
 * Get cookie by name from string of cookies, helpful wrt socket cookies since http requests are handled by cookieParser
 * @param cookies
 * @param name
 * @returns
 */
export function getCookieByName(cookies: string, name: string) {
  // Get name followed by anything except a semicolon
  var cookiestring = RegExp(name + "=[^;]+").exec(cookies);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}

export function validateAuthToken(authToken: string | null): string {
  if (authToken === null || authToken === undefined) {
    console.log("no auth token found on cookies");
    throw new Error("unable to locate avalid authToken for user");
  }
  console.log("token exists, decoding");
  console.log(authToken);
  const decoded = jwt.verify(authToken, env.JWT_SECRET!) as JwtPayload;
  if (!decoded.userId) {
    console.log("userid not decoded from jwt");
    throw new Error("invalid jwt");
  }
  return decoded.userId;
}
