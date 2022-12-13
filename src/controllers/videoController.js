import Video from "../models/Video";
import User from "../models/User";

// Video.find({}, (error, videos) => {
// 	console.log("search finished");
// 	return res.render("home", { pageTitle: "Home", videos });
// });
export const home = async (req, res) => {
	try {
		const videos = await Video.find({})
			.sort({ createdAt: "desc" })
			.populate("owner");
		return res.render("home", { pageTitle: "Home", videos });
	} catch (error) {
		return res.render("server-error", error);
	}
};

export const watch = async (req, res) => {
	const { id } = req.params;

	const video = await Video.findById(id).populate("owner");
	//이렇게 모델들끼리 데이터를 연결할 수 있다.! mysql에서 join과 같은 느낌이네.

	console.log("vid:", video);

	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}
	return res.render("Watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	//req.session.user._id
	const { id } = req.params;
	const video = await Video.findById(id);
	// console.log("getEdit: ", video);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}
	if (String(video.owner) !== String(_id)) {
		req.flash("error", "Not authorized");
		return res.status(403).redirect("/");
		//403은 forbidden을 의미한다.
		//비디오를 업로드한 사용자 본인이 아니라면 접속할 수 없게 설정.
	}
	return res.render("Edit", { pageTitle: `Editing`, video });
};

export const postEdit = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	const { id } = req.params;
	const { title, description, hashtags } = req.body;

	const video = await Video.exists({ _id: id });
	console.log("postEdit: ", video);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}
	if (String(video.owner) !== String(_id)) {
		req.flash("error", "You are not the the owner of the video.");
		return res.status(403).redirect("/");
	}
	await Video.findByIdAndUpdate(id, {
		title,
		description,
		hashtags: Video.formatHashtags(hashtags),
	});
	req.flash("success", "Changes saved.");
	return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	const { video, thumb } = req.files;
	const { title, hashtags, description } = req.body;
	// const {
	// 	session: {
	// 		user: { _id },
	// 	},
	// 	files: { video, thumb },
	// 	body: { title, hashtags, description },
	// } = req;

	try {
		const newVideo = await Video.create({
			fileUrl: video[0].path,
			thumbUrl: thumb[0].path,
			owner: _id,
			title,
			description,
			hashtags: Video.formatHashtags(hashtags),
		});

		const user = await User.findById(_id);
		user.videos.push(newVideo._id);
		user.save();
	} catch (error) {
		console.log(error);
		res.status(400).render("upload", {
			pageTitle: "Upload Video",
			errorMessage: error._message,
		});
	}

	return res.redirect("/");
};

export const deleteVideo = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	const { id } = req.params;

	const video = await Video.findById(id);
	//비디오가 없다면 404로 넘어가고, 있다면 로그인한 사람과 비디오의 owner가 같은지 체크해서, 다르다면 forbidden하여 홈으로 돌려보낸다.
	if (!video) {
		return res.render("404", { pageTitle: "Video not found" });
	}
	if (String(video.owner) !== String(_id)) {
		req.flash("error", "You are not the the owner of the video.");
		return res.status(403).redirect("/");
	}

	try {
		//video를 삭제하는 부분
		const result = await Video.findByIdAndDelete(id);
		console.log("this is result", result);
	} catch (error) {
		console.log(error);
	}

	return res.redirect("/");
};

export const search = async (req, res) => {
	let { keyword } = req.query;
	// console.log(keyword);

	let videos = [];

	if (keyword) {
		videos = await Video.find({
			title: {
				$regex: new RegExp(keyword, "i"),
				//^keyword -> keyword로 시작하는 것만 필터링한다.
				//keyword$ -> keyword로 끝나는 것만 필터링한다.
			},
		}).populate("owner");
	}
	return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	if (!video) {
		return res.sendStatus(404);
		//그냥 status(404)하면 상태를 보내지는게 아니라 상태만 설정한 것이고, 404상태를 보내려면 .sendStatus(404)를 사용해야한다.
	}
	video.meta.views = video.meta.views + 1;
	await video.save();
	return res.sendStatus(200);
};

export const createComment = (req, res) => {
	console.log(req.body);
	console.log(req.body.text);
	console.log(req.params);
	return res.end();
};
