import express from "express";
import { userController } from "./controller";
import { globalMiddlewares } from "../common/middlewares";

const router = express.Router();
router.route("/").post(userController.registerUser);
router.route("/me").get(globalMiddlewares.authenticationHandler, userController.getUserInfo);
router.route("/login").post(userController.loginUser);
router.route("/logout").post(globalMiddlewares.authenticationHandler, userController.logoutUser);

export const userRouter = Object.assign(router, { ROOT: "/users" });
