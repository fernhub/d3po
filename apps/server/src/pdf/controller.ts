import { type Request, type Response } from "express";
import { query } from "../db/db";
import {
  SIMPLE_MODELS,
  type RAGApplication,
  RAGApplicationBuilder,
  PdfLoader,
} from "@llm-tools/embedjs"; //ignore import error
import { HNSWDb } from "@llm-tools/embedjs/vectorDb/hnswlib"; //ignore import error
import path from "path";

var RAG: RAGApplication;

async function getAll(req: Request, res: Response) {
  const queryResult = await query("SELECT * FROM pdf", []);
  res.status(201).send({
    rows: queryResult.rowCount,
  });
}

async function getRAGBuilder(req: Request, res: Response) {
  const ragApplication: RAGApplication = await new RAGApplicationBuilder()
    .setModel(SIMPLE_MODELS.OPENAI_GPT4_TURBO)
    .setVectorDb(new HNSWDb())
    .addLoader(
      new PdfLoader({
        filePathOrUrl: path.resolve("./src/Residential-Lease-Agreement.pdf"),
      })
    )
    .build();
  await ragApplication.query("please read the document.");
  RAG = ragApplication;
  console.log(RAG !== null ? "rag initialized" : "oops");
  res.status(200).send({ msg: "built rag" });
}

async function queryRAG(req: Request, res: Response) {
  console.log(RAG !== null ? "rag initialized" : "oops");
  const query = req.body.query;
  if (query === "") {
    res.status(500).send({
      error: "INVALID_QUERY",
      message: "Cannot pass an empty query",
    });
  } else {
    const queryRes = await RAG.query(query);
    res.status(200).send({ answer: queryRes.content });
  }
}

export const pdfController = {
  getAll,
  getRAGBuilder,
  queryRAG,
};
