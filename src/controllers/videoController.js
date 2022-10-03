const fakeUser = {
	username: "Nico",
	loggedIn: false,
};
const videos = [
	{
		title: "first video",
		rating: 5,
		comments: 2,
		createdAt: "2 minutes ago",
		views: 58,
		id: 1,
	},
	{
		title: "second video",
		rating: 5,
		comments: 2,
		createdAt: "2 minutes ago",
		views: 58,
		id: 1,
	},
	{
		title: "third video",
		rating: 5,
		comments: 2,
		createdAt: "2 minutes ago",
		views: 58,
		id: 1,
	},
];
export const trending = (req, res) =>
	res.render("home", { pageTitle: "Home", fakeUser, videos });
export const see = (req, res) => {
	console.log(req.params);
	res.render("Watch", { pageTitle: "구구까까" });
};
export const edit = (req, res) => {
	console.log(req.params);
	return res.send("Edit");
};
export const search = (req, res) => res.send("Search video");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
	console.log(req.params);
	return res.send("Delete Video");
};
