import express from "express";
import {
	edit,
	finishGithubLogin,
	finishKakaoLogin,
	logout,
	see,
	startGithubLogin,
	startKakaoLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/:id(\\d+)", see);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
export default userRouter;
