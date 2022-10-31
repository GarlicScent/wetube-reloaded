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
	const user = await User.findOne({ username, socialOnly: false });
	if (!user) {
		return res.status(400).render("login", {
			pageTitle,
			errorMessage: "An account with this username does not exists",
		});
	}

	//check if password correct
	const ok = await bcrypt.compare(password, user.password);
	console.log("this is login ok", ok);
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
		//in operator를 사용하여 access_token이 있는지 check한다.
		const { access_token } = tokenRequest;
		const apiUrl = "https://api.github.com";
		const userData = await (
			await fetch(`${apiUrl}/user`, {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		).json();

		// console.log("this is userData from github", userData);
		const emailData = await (
			await fetch(`${apiUrl}/user/emails`, {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		).json();
		// console.log("이거슨 깃헙 이멜", emailData);
		const emailObj = emailData.find(
			(email) => email.primary === true && email.verified === true
		);

		if (!emailObj) {
			return res.redirect("/login");
		}
		let user = await User.findOne({ email: emailObj.email });

		if (!user) {
			user = await User.create({
				name: userData.name,
				username: userData.login,
				email: emailObj.email,
				password: "",
				socialOnly: true,
				location: userData.location,
				avatarUrl: userData.avatar_url,
			});
		}

		req.session.loggedIn = true;
		req.session.user = user;

		return res.redirect("/");
	} else {
		return res.redirect("/login");
	}
};
export const logout = (req, res) => {
	req.session.destroy();
	// kakao logout방법:
	// curl -v -X POST "https://kapi.kakao.com/v1/user/logout" \
	// -H "Content-Type: application/x-www-form-urlencoded" \
	// -H "Authorization: Bearer ${ACCESS_TOKEN}"

	return res.redirect("/");
};

export const startKakaoLogin = (req, res) => {
	// GET: /oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code
	// Host: kauth.kakao.com
	const baseUrl = "https://kauth.kakao.com/oauth/authorize";
	const config = {
		client_id: process.env.KAKAO_CLIENT,
		redirect_uri: "http://localhost:4000/users/kakao/finish",
		response_type: "code",
		//response_type=code로 고정.
	};
	const params = new URLSearchParams(config).toString();
	console.log(params);
	const finalUrl = `${baseUrl}?${params}`;
	return res.redirect(finalUrl);
};
export const finishKakaoLogin = async (req, res) => {
	const baseUrl = "https://kauth.kakao.com/oauth/token";
	const config = {
		grant_type: "authorization_code",
		client_id: process.env.KAKAO_CLIENT,
		redirect_uri: "http://localhost:4000/users/kakao/finish",
		code: req.query.code,
		client_secret: process.env.KAKAO_SECRET,
	};
	const params = new URLSearchParams(config).toString();
	const finalUrl = `${baseUrl}?${params}`;

	const kakaoTokenRequest = await (
		await fetch(finalUrl, {
			method: "POST",
			headers: {
				"Content-type":
					"application/x-www-form-urlencoded;charset=utf-8",
			},
		})
	).json();
	// console.log("이것은 토큰값 받은 것:", kakaoTokenRequest);

	// GET/POST /v2/user/me HTTP/1.1
	// Host: kapi.kakao.com
	// Authorization: Bearer ${ACCESS_TOKEN}/KakaoAK ${APP_ADMIN_KEY}
	// Content-type: application/x-www-form-urlencoded;charset=utf-8
	if ("access_token" in kakaoTokenRequest) {
		const { access_token } = kakaoTokenRequest;
		const apiUrl = "https://kapi.kakao.com";
		const userData = await (
			await fetch(`${apiUrl}/v2/user/me`, {
				headers: {
					Authorization: `Bearer ${access_token}`,
					// "Content-type":
					// 	"application/x-www-form-urlencoded;charset=utf-8",
				},
			})
		).json();

		// console.log("카카오 유저 정보:", userData);

		const { kakao_account } = userData;
		const { profile } = kakao_account;

		if (!kakao_account.is_email_valid && !kakao_account.is_email_verified) {
			return res.redirect("/login");
		}
		let user = await User.findOne({ email: kakao_account.email });

		if (!user) {
			user = await User.create({
				name: profile.nickname,
				username: kakao_account.email.split("@")[0],
				//2가지 방법이 있을 것 같다. 정규표현식 그리고 split하여 추출.
				email: kakao_account.email,
				password: "",
				socialOnly: true,
				avatarUrl: profile.profile_image_url,
			});
		}
		// console.log("카카오이메일로 찾은 유저 정보 혹은 생성한 정보:", user);
		req.session.loggedIn = true;
		req.session.user = user;

		return res.redirect("/");
	} else {
		return res.redirect("/login");
	}
};
export const getEdit = (req, res) => {
	return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
	const {
		session: {
			user: {
				_id,
				username: currentUserName,
				email: currentEmail,
				avatarUrl,
			},
		},
		body: {
			email: updatedEmail,
			name,
			username: updatedUsername,
			location,
		},
		file,
	} = req;
	//this is ES6 구조 분해 할당!! 와우!!! 완전 멋져~

	//code challenge:
	// 1. username이 기존 다른 데이터와 겹치는 것 해결,
	//  - 유저가 입력한 유저네임과(req.body) 현재 user의 유저네임과(req.session.user) 다르다면 그때 디비에서 체크. Model.exists() 사용하면 될듯.
	if (currentUserName !== updatedUsername) {
		const checkBoolean = Boolean(
			await User.exists({ username: updatedUsername })
		);
		console.log("✅checkBoolean:", checkBoolean);
		if (checkBoolean) {
			return res.status(400).render("edit-profile", {
				pageTitle: "Edit Profile",
				errorMessage:
					"An account with this username already exists. Please use another one",
			});
		}
	}
	// 2. email이 겹치는 것 해결.
	if (currentEmail !== updatedEmail) {
		const checkBoolean = Boolean(
			await User.exists({ email: updatedEmail })
		);
		console.log("✅checkBoolean:", checkBoolean);
		if (checkBoolean) {
			return res.status(400).render("edit-profile", {
				pageTitle: "Edit Profile",
				errorMessage:
					"An account with this email already exists. Please use another one",
			});
		}
	}

	const updatedUser = await User.findByIdAndUpdate(
		_id,
		{
			avatarUrl: file ? file.path : avatarUrl,
			email: updatedEmail,
			name,
			username: updatedUsername,
			location,
		},
		{ new: true }
		//new: true로 하지 않으면, update 전 내용이 반환된다. mongoose doc 참조!
	);

	req.session.user = updatedUser;
	// req.session.user = {
	// 	...req.session.user,
	// 	email,
	// 	name,
	// 	username,
	// 	location,
	// };
	// ...req.session.user 는 안의 내용을 꺼내서 넣게 해준다.
	return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
	if (req.session.user.socialOnly === true) {
		return res.redirect("/");
	}
	res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
		body: { oldPassword, newPassword, newPasswordConfirm },
	} = req;

	const user = await User.findById(_id);
	const ok = await bcrypt.compare(oldPassword, user.password);
	//bcrypt.compare로 입력받은 비밀번호와 해싱된 비밀번호를 비교해서 맞는지 확인한다.
	if (!ok) {
		return res.status(400).render("users/change-password", {
			pageTitle: "Change Password",
			errorMessage: "The current password is incorrect",
		});
	}

	if (newPassword !== newPasswordConfirm) {
		return res.status(400).render("users/change-password", {
			pageTitle: "Change Password",
			errorMessage: "The password does not match the confirmation",
		});
	}
	user.password = newPassword;
	await user.save();
	res.redirect("/users/logout");
};
export const see = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).render("404", { pageTitle: "User Not Found" });
	}
	return res.render("users/profile", {
		pageTitle: `${user.name}'s Profile`,
		user,
	});
};
