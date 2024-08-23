import express from "express";
import { userController } from "./controller";

const router = express.Router();
router.route("/").post(userController.registerUser);
router.route("/login").post(userController.loginUser);

export const userRouter = Object.assign(router, { ROOT: "/users" });
