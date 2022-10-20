import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
	return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
	// console.log("this is req body of post join", req.body);
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
	try {
		await User.create({
			email,
			username,
			password,
			name,
			location,
		});
		return res.redirect("/");
	} catch (error) {
		return res.status(400).render("join", {
			pageTitle: "Upload Video",
			errorMessage: error._message,
		});
	}
};

export const getLogin = (req, res) => {
	return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
	const { username, password } = req.body;
	const pageTitle = "Login";
	//check if account exists
	const user = await User.findOne({ username });
	if (!user) {
		return res.status(400).render("login", {
			pageTitle,
			errorMessage: "An account with this username does not exists",
		});
	}

	//check if password correct
	const ok = await bcrypt.compare(password, user.password);
	//bcrypt에서 사용자가 입력한 비밀번호와 hash된 비밀번호를 비교해서 맞는지 확인한다.
	if (!ok) {
		return res.status(400).render("login", {
			pageTitle,
			errorMessage: "Wrong password",
		});
	}
	req.session.loggedIn = true;
	req.session.user = user;
	return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
	const baseUrl = "https://github.com/login/oauth/authorize";
	const config = {
		client_id: process.env.GH_CLIENT,
		allow_signup: false,
		scope: "read:user user:email",
	};
	const params = new URLSearchParams(config).toString();
	//new URLSearchParams(config).toString(); -> 연결해서 보여준다.
	const finalUrl = `${baseUrl}?${params}`;
	res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
	const baseUrl = "https://github.com/login/oauth/access_token";
	const config = {
		client_id: process.env.GH_CLIENT,
		client_secret: process.env.GH_SECRET,
		code: req.query.code,
	};
	const params = new URLSearchParams(config).toString();
	const finalUrl = `${baseUrl}?${params}`;

	const tokenRequest = await (
		await fetch(finalUrl, {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
		})
	).json();

	if ("access_token" in tokenRequest) {
		//access api...
		const { access_token } = tokenRequest;
		const userRequest = await (
			await fetch("https://api.github.com/user", {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		).json();
		console.log(userRequest);
		return res.redirect("/");
	} else {
		return res.redirect("/login");
	}
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
