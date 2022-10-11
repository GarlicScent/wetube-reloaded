import Video from "../models/Video";

// Video.find({}, (error, videos) => {
// 	console.log("search finished");
// 	return res.render("home", { pageTitle: "Home", videos });
// });
export const home = async (req, res) => {
	try {
		const videos = await Video.find({});
		return res.render("home", { pageTitle: "Home", videos });
	} catch (error) {
		return res.render("server-error", error);
	}
};

export const watch = async (req, res) => {
	const { id } = req.params;

	const video = await Video.findById(id);
	if (!video) {
		return res.render("404", { pageTitle: "Video not found" });
	}
	return res.render("Watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	console.log("getEdit: ", video);
	if (!video) {
		return res.render("404", { pageTitle: "Video not found" });
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
		hashtags,
	});
	return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
	const { title, hashtags, description } = req.body;
	try {
		await Video.create({
			title,
			description,
			hashtags,
		});
	} catch (error) {
		console.log(error);
		res.render("upload", {
			pageTitle: "Upload Video",
			errorMessage: error._message,
		});
	}

	return res.redirect("/");
};
