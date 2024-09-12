import { globalMiddlewares } from "$/common/middlewares";
import express, { Router } from "express";
import { documentController } from "./controller";

const router = express.Router();

router
  .route("/")
  .get(globalMiddlewares.authenticationHandler, documentController.getAll)
  .delete(globalMiddlewares.authenticationHandler, documentController.deleteDocument);

router
  .route("/beginUpload")
  .post(globalMiddlewares.authenticationHandler, documentController.beginUpload);

router
  .route("/updateDocument")
  .put(globalMiddlewares.authenticationHandler, documentController.updateDocument);

export const documentRouter: Router & { ROOT: string } = Object.assign(router, {
  ROOT: "/documents",
});
