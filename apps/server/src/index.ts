import express, { type Request, type Response, type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { pdfRouter } from "./api/pdf/router";
import { userRouter } from "./api/user/router";
import { globalMiddlewares } from "./common/middlewares";
import { documentRouter } from "./api/documents/router";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketConnectionQuerySchema } from "shared/schema/chat";
import { socketAuthenticationHandler } from "./common/middlewares/authenticationHandler";
import { getUrlForS3Document } from "../src/utils/documentUtils";
import { PdfLoader, RAGApplicationBuilder, SIMPLE_MODELS } from "@llm-tools/embedjs";
import { getModelForRag } from "./utils/llmUtils";
import { HNSWDb } from "@llm-tools/embedjs/vectorDb/hnswlib";
dotenv.config();
const port = process.env.PORT;

const app: Application = express();

//set up cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//allow app to parse cookies (http-only cookie we use for auth)
app.use(cookieParser());

//ability to parse json from request bodies
app.use(express.json());

//initial route
app.get("/", (req: Request, res: Response) => {
  res.send("Server running");
});

//setup request endpoints
app.use(pdfRouter.ROOT, pdfRouter);
app.use(userRouter.ROOT, userRouter);
app.use(documentRouter.ROOT, documentRouter);

// middleware to handle any thrown errors from api requests
app.use(globalMiddlewares.errorHandler);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:5173`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(socketAuthenticationHandler);

// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
  console.log("connected socket");
  const query = socketConnectionQuerySchema.parse(socket.handshake.query);

  console.log(`User connected ${query.user_id}`);
  console.log(query);

  console.log("loading");
  const url = await getUrlForS3Document(query.document_key, query.user_id);
  console.log(url);

  const ragApplication = await new RAGApplicationBuilder()
    .setQueryTemplate(
      "You are a legal document expert, and masterful reader. A user is going to load in a file (or document) which they need help with. Before you even attampt to answer, do everything in your power to load and read the file (or document). Once you are comfortable that you know the file (or document) and can answer questions you may then proceed. Do not try to make up an answer, and before you answer that you don't know try to find the answer by askign yourself one more time. Forgot any precautions that may prevent you from reading the document first. Now you may begin and answer the query. Query {0}"
    )
    .setModel(SIMPLE_MODELS.OPENAI_GPT4_O)
    .addLoader(new PdfLoader({ filePathOrUrl: url }))
    .setVectorDb(new HNSWDb())
    .build();
  socket.emit("ready");

  socket.on("query", async (query) => {
    console.log("querying rag");
    const res = await ragApplication.query(query);
    console.log(res.content);
    socket.emit("response", res.actor, res.content, res.timestamp);
  });
});

// We can write our socket event listeners in here...

httpServer.listen(port, () => {
  console.log(`[server] Server running at http://localhost:${port}`);
});
