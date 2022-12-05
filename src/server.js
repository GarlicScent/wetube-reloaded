import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);

app.use(express.urlencoded({ extended: true }));

//session 설정 middleware
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: true,
		saveUninitialized: true,
		cookie: {
			maxAge: 2000000,
			//ms으로 20초 후에 세션 쿠키가 만료되게 설정한다.
		},
		store: MongoStore.create({
			mongoUrl: process.env.DB_URL,
		}),
		//store: MongoStore.create({mongoUrl:'...'}) 하면 세션아이디가 이제 몽고디비에 저장된다. 서버를 껐다켜도 로그인이 유지된다.
	})
);

app.use((req, res, next) => {
	res.header("Cross-Origin-Embedded-Policy", "required-corp");
	res.header("Cross-Origin-Opener-Policy", "same-origin");
	next();
});

app.use((req, res, next) => {
	req.sessionStore.all((error, sessions) => {
		// console.log(sessions);
		next();
	});
});

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
