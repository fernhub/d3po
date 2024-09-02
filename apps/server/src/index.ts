import express, { type Request, type Response, type Application } from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { pdfRouter } from "./api/pdf/router";
import { userRouter } from "./api/user/router";
import { globalMiddlewares } from "./common/middlewares";
import { documentRouter } from "./api/documents/router";

dotenv.config();
const port = process.env.PORT;

const app: Application = express();
console.log(process.env.NODE_ENV);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server running");
});

app.use(pdfRouter.ROOT, pdfRouter);
app.use(userRouter.ROOT, userRouter);
app.use(documentRouter.ROOT, documentRouter);

app.use(globalMiddlewares.errorHandler);

app.listen(port, () => {
  console.log(`[server] Server running at http://localhost:${port}`);
});
