import User from "../models/User";

export const getJoin = (req, res) => {
	return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
	console.log("this is req body of post join", req.body);
	const { name, email, username, password, location } = req.body;

	await User.create({
		email,
		username,
		password,
		name,
		location,
	});

	return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
