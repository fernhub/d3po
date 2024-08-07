import express from "express";
import { pdfController } from "./controller";

const router = express.Router();

router.route("/").get(pdfController.getAll);

export const pdfRouter = Object.assign(router, { ROOT: "/pdfs" });
