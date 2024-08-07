import express, { type Request, type Response, type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pdfRouter } from "./pdf/router";

dotenv.config();
const port = process.env.PORT;

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: "*",
  })
);

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Server running");
});

app.use(pdfRouter.ROOT, pdfRouter);

app.listen(port, () => {
  console.log(`[server] Server running at http://localhost:${port}`);
});
