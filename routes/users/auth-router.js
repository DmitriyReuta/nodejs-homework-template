import express from "express";

import authController from "../../controllers/auth-controller.js";

import {isEmptyBody, authenticate} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import { userRegisterSchema, userLoginSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/users/register", isEmptyBody, validateBody(userRegisterSchema), authController.register);

authRouter.post("/users/login", isEmptyBody, validateBody(userLoginSchema), authController.login);

authRouter.get("/users/current", authenticate, authController.getCurrent);

authRouter.post("/users/logout", authenticate, authController.logout);

export default authRouter;