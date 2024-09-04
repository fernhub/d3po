import { globalMiddlewares } from "$/common/middlewares";
import express from "express";
import { documentController } from "./controller";

const router = express.Router();

router.route("/").get(globalMiddlewares.authenticationHandler, documentController.getAll);

router
  .route("/beginUpload")
  .post(globalMiddlewares.authenticationHandler, documentController.beginUpload);

router
  .route("/updateDocument")
  .post(globalMiddlewares.authenticationHandler, documentController.updateDocument);

export const documentRouter = Object.assign(router, { ROOT: "/documents" });
