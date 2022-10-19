export const localsMiddleware = (req, res, next) => {
	//res.locals는 pug와 express가 서로 공유하는 데이터이다. template에 변수를 globally 보낼 수 있다.
	// console.log("🚀", req.session.loggedIn);
	// console.log("🚀", req.session.user);
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.siteName = "Wetube";
	res.locals.loggedInUser = req.session.user;
	next();
};
