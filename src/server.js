import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const handleHome = (req, res) => {
    return res.send("<h1>I Love Middleware!!</h1>");
}

const handleLogin = (req, res) => {
    return res.send("<h1>You are logged in</h1>")
}

app.use(logger);
app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () => console.log(`✅ Serever Listening on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
