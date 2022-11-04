import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	avatarUrl: { type: String },
	socialOnly: { type: Boolean, default: false },
	username: { type: String, required: true, unique: true },
	password: { type: String },
	name: { type: String, required: true },
	location: String,
	videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
	// console.log("users password: ", this.password);
	this.password = await bcrypt.hash(this.password, 7);
	// console.log("hashed password: ", this.password);
});
const User = mongoose.model("User", userSchema);

export default User;
