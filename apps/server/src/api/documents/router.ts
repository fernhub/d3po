import { globalMiddlewares } from "$/common/middlewares";
import express from "express";
import { documentController } from "./controller";

const router = express.Router();
router
  .route("/presignedPutUrl")
  .post(globalMiddlewares.authenticationHandler, documentController.getPresignedPutUrl);

router
  .route("/createDocumentPointer")
  .post(globalMiddlewares.authenticationHandler, documentController.createDocumentPointer);

export const documentRouter = Object.assign(router, { ROOT: "/documents" });
