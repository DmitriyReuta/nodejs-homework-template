import express from "express";

import authController from "../../controllers/auth-controller.js";

import {isEmptyBody, authenticate, upload} from "../../middlewares/index.js";

import {validateBody} from "../../decorators/index.js";

import { userRegisterSchema, userLoginSchema, userEmailSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userRegisterSchema), authController.register);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", isEmptyBody, validateBody(userEmailSchema), authController.resendVerifyEmail);

authRouter.post("/login", isEmptyBody, validateBody(userLoginSchema), authController.login);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar)

export default authRouter;