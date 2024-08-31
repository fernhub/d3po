import { errorHandler } from "./error-handler";
import { requestMethod } from "./requestMethod";
import { authenticationHandler } from "./authenticationHandler";
export const globalMiddlewares = {
  errorHandler,
  requestMethod,
  authenticationHandler,
};
