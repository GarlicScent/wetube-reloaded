import express from "express";
import {
	postEdit,
	watch,
	getEdit,
	getUpload,
	postUpload,
	deleteVideo,
} from "../controllers/videoController";
import { protectMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
	.route("/:id([0-9a-f]{24})/edit")
	.all(protectMiddleware)
	.get(getEdit)
	.post(postEdit);
videoRouter
	.route("/:id([0-9a-f]{24})/delete")
	.all(protectMiddleware)
	.get(deleteVideo);
videoRouter
	.route("/upload")
	.all(protectMiddleware)
	.get(getUpload)
	.post(
		videoUpload.fields([
			{ name: "video", maxCount: 1 },
			{ name: "thumb", maxCount: 1 },
		]),
		postUpload
	);
//uploadFiles.single("video") "video"는 form안의 video를 받는 input name이다.
export default videoRouter;
