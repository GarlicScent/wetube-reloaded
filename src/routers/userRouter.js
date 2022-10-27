import express from "express";
import {
	finishGithubLogin,
	finishKakaoLogin,
	getChangePassword,
	getEdit,
	logout,
	postChangePassword,
	postEdit,
	see,
	startGithubLogin,
	startKakaoLogin,
} from "../controllers/userController";
import { protectMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectMiddleware, logout);
userRouter.route("/edit").all(protectMiddleware).get(getEdit).post(postEdit);
userRouter
	.route("/change-password")
	.all(protectMiddleware)
	.get(getChangePassword)
	.post(postChangePassword);

//github REST api login, oauth2.0
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
//kakao REST api login, oauth2.0
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);

userRouter.get("/:id(\\d+)", see);

export default userRouter;
