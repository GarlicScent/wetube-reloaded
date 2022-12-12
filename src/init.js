import "dotenv/config";
// require("dotenv").config();를 윗줄처럼 변경 가능하다.
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

app.listen(PORT, () =>
	console.log(`Server listening on port http://localhost:${PORT} 🚀`)
);
