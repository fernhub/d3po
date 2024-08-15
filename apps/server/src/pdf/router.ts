import express from "express";
import { pdfController } from "./controller";

const router = express.Router();

router.route("/").get(pdfController.getAll);
router.route("/rag").get(pdfController.getRAGBuilder);
router.route("/query").post(pdfController.queryRAG);

export const pdfRouter = Object.assign(router, { ROOT: "/pdfs" });
