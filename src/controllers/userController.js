import User from "../models/User";

export const getJoin = (req, res) => {
	return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
	console.log("this is req body of post join", req.body);
	const { name, email, username, password, password2, location } = req.body;
	const pageTitle = "Join";
	if (password !== password2) {
		res.status(400).render("join", {
			pageTitle,
			errorMessage: "Password confirmation does not match.",
		});
	}
	const exits = await User.exists({
		$or: [{ username }, { email }],
		//mongoose에서 각각따로 찾는 방법. username이 존재하는지, email이 존재하는지 각각 검색하게됨.
	});
	if (exits) {
		return res.status(400).render("join", {
			pageTitle,
			errorMessage: "This username/email is already taken",
		});
	}

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
