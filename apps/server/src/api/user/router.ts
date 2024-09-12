import express, { Router } from "express";
import { userController } from "./controller";
import { globalMiddlewares } from "../../common/middlewares";

const router = express.Router();
router.route("/signup").post(userController.signupUser);
router.route("/me").get(globalMiddlewares.authenticationHandler, userController.getUserInfo);
router.route("/login").post(userController.loginUser);
router.route("/logout").post(globalMiddlewares.authenticationHandler, userController.logoutUser);

export const userRouter: Router & { ROOT: string } = Object.assign(router, { ROOT: "/users" });
