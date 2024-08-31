import express from "express";
import { pdfController } from "./controller";
import { globalMiddlewares } from "$/common/middlewares";
const router = express.Router();

router.route("/").get(globalMiddlewares.authenticationHandler, pdfController.getAll);
router.route("/rag").get(globalMiddlewares.authenticationHandler, pdfController.getRAGBuilder);
router.route("/query").post(globalMiddlewares.authenticationHandler, pdfController.queryRAG);

export const pdfRouter = Object.assign(router, { ROOT: "/pdfs" });
