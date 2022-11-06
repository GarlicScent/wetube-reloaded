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
	if (this.isModified("password")) {
		//this.isModified() 아무것도 전달안하면 모든 변경점에 대해서 true를 반환하고,
		//"password"를 전달해주면, Schema의 password가 변경할 때만 true를 반환한다.
		this.password = await bcrypt.hash(this.password, 7);
	}
});
const User = mongoose.model("User", userSchema);

export default User;
