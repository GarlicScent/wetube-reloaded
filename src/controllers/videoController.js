import Video from "../models/Video";
import User from "../models/User";

// Video.find({}, (error, videos) => {
// 	console.log("search finished");
// 	return res.render("home", { pageTitle: "Home", videos });
// });
export const home = async (req, res) => {
	try {
		const videos = await Video.find({}).sort({ createdAt: "desc" });
		return res.render("home", { pageTitle: "Home", videos });
	} catch (error) {
		return res.render("server-error", error);
	}
};

export const watch = async (req, res) => {
	const { id } = req.params;

	const video = await Video.findById(id);
	const owner = await User.findById(video.owner);
	//video 에 저장된 owner 아이디를 가져와서 다시 유저 정보를 찾는다. 하지만 populate를 사용하면 이렇게 하지 않아도 된다.
	console.log("vid:", video);
	console.log("owner:", owner);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}
	return res.render("Watch", { pageTitle: video.title, video, owner });
};
export const getEdit = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	console.log("getEdit: ", video);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found" });
	}
	return res.render("Edit", { pageTitle: `Editing`, video });
};

export const postEdit = async (req, res) => {
	const { id } = req.params;
	const { title, description, hashtags } = req.body;

	const video = await Video.exists({ _id: id });
	console.log("postEdit: ", video);
	if (!video) {
		return res.render("404", { pageTitle: "Video not found" });
	}
	await Video.findByIdAndUpdate(id, {
		title,
		description,
		hashtags: Video.formatHashtags(hashtags),
	});
	return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
	// const {
	// 	user: { _id },
	// } = req.session;
	// const { path: fileUrl } = req.file;
	// const { title, hashtags, description } = req.body;

	const {
		session: {
			user: { _id },
		},
		file: { path: fileUrl },
		body: { title, hashtags, description },
	} = req;
	try {
		await Video.create({
			fileUrl,
			owner: _id,
			title,
			description,
			hashtags: Video.formatHashtags(hashtags),
		});
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
	const { id } = req.params;
	//delete video.
	//여기서 작성자만 삭제할 수 있게 변경이 필요한데, 추후 강의 진행하며 진행 필요.
	try {
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
		});
	}
	return res.render("search", { pageTitle: "Search", videos });
};
