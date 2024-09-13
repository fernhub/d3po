import express, { type Request, type Response, type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./api/user/router";
import { globalMiddlewares } from "./common/middlewares";
import { documentRouter } from "./api/documents/router";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketConnectionQuerySchema } from "shared/schema/chat";
import { socketAuthenticationHandler } from "./common/middlewares/authenticationHandler";
import { getUrlForS3Document } from "../src/utils/documentUtils";
import { PdfLoader, RAGApplicationBuilder } from "@llm-tools/embedjs";
import { getModelForRag, QUERY_TEMPLATE } from "./utils/llmUtils";
import { env } from "./config";
import { MongoDb } from "@llm-tools/embedjs/vectorDb/mongodb";
import path from "path";

const app: Application = express();
console.log("configuring cors for: ", env.CLIENT_URL);
//set up cors
app.use(
  cors({
    origin: env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["Set-cookie"],
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
app.use(userRouter.ROOT, userRouter);
app.use(documentRouter.ROOT, documentRouter);

// middleware to handle any thrown errors from api requests
app.use(globalMiddlewares.errorHandler);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(socketAuthenticationHandler);

// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
  try {
    console.log("connected socket");
    const query = socketConnectionQuerySchema.parse(socket.handshake.query);

    console.log(`User connected ${query.user_id}`);

    console.log("loading");
    const url = await getUrlForS3Document(query.document_key, query.user_id);
    console.log(url);

    console.log(path.resolve("/db"));
    const ragApplication = await new RAGApplicationBuilder()
      .setQueryTemplate(QUERY_TEMPLATE)
      .setModel(getModelForRag(query.model_source, query.model_key))
      .addLoader(new PdfLoader({ filePathOrUrl: url }))
      .setVectorDb(
        new MongoDb({
          connectionString:
            "mongodb+srv://d3po:Q0MKX6h2vUUjWCwk@vector-store.wc8fe.mongodb.net/?retryWrites=true&w=majority&appName=vector-store",
        })
      )
      .build();

    console.log(`rag for ${query.model_source} ${query.model_key} ready`);
    socket.emit("ready");

    socket.on("query", async (query) => {
      try {
        console.log("querying rag");
        const res = await ragApplication.query(query);
        socket.emit("response", res.actor, res.content, res.timestamp);
      } catch (e) {
        if (e instanceof Error) {
          console.log("error type error");
          console.log(e.message);
          socket.emit("error", {
            msg: e.message,
          });
        } else {
          socket.emit("error", {
            msg: "Error loading model",
          });
        }
      }
    });

    socket.on("disconnect", async (reason) => {
      console.log("disconnecting socket");
      const embeddings = await ragApplication.getEmbeddingsCount();
      console.log(embeddings);
      const embeddingsDeleted = await ragApplication.deleteAllEmbeddings(true);
      const embeddings2 = await ragApplication.getEmbeddingsCount();
      console.log("rag embeddings deleted: ", embeddingsDeleted);
      console.log("new embeddings count: ", embeddings2);
    });
  } catch (e) {
    console.log("socket: error in socket");
    console.log(e);
    if (e instanceof Error) {
      socket.emit("error", {
        msg: e.message,
      });
    } else {
      socket.emit("error", {
        msg: "Error initializing socket connection",
      });
    }
  }
});

httpServer.listen(env.PORT, () => {
  console.log(`[server] Server running at ${env.API_URL}:${env.PORT}`);
});
