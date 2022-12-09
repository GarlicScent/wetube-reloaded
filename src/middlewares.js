import multer from "multer";

export const localsMiddleware = (req, res, next) => {
	//res.locals는 pug와 express가 서로 공유하는 데이터이다. template에 변수를 globally 보낼 수 있다.
	// console.log("🚀", req.session.loggedIn);
	// console.log("🚀", req.session.user);
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.siteName = "Wetube";
	res.locals.loggedInUser = req.session.user || {};
	next();
};

export const protectMiddleware = (req, res, next) => {
	if (req.session.loggedIn) {
		next();
	} else {
		req.flash("error", "Log in first");
		return res.redirect("/login");
	}
};
export const publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		next();
	} else {
		req.flash("error", "Not authorized");
		return res.redirect("/");
	}
};

export const avatarUpload = multer({
	dest: "uploads/avatars/",
	limits: { fileSize: 3000000 },
});
export const videoUpload = multer({
	dest: "uploads/videos/",
	limits: { fileSize: 15000000 },
});
