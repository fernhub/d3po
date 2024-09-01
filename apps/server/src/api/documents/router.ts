import { globalMiddlewares } from "$/common/middlewares";
import express from "express";
import { documentController } from "./controller";

const router = express.Router();
router
  .route("/getUploadUrl")
  .get(globalMiddlewares.authenticationHandler, documentController.getPresignedUploadLink);
