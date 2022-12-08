import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		uppercase: true,
		trim: true,
		maxLength: 80,
	},
	fileUrl: { type: String, required: true },
	thumbUrl: { type: String, required: true },
	description: { type: String, required: true, trim: true, minLength: 2 },
	createdAt: { type: Date, required: true, default: Date.now },
	hashtags: [{ type: String, trim: true }],
	meta: {
		views: { type: Number, required: true, default: 0 },
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	//ObjectId is come only from mongoose. reference as ref: ''. 해당 모델의 아이디를 연결하기 위함이다.
	//ObjectId는 유저 모델에서 가져온 것이다. 이것은 populate를 사용하기 위함이다.
});

videoSchema.static("formatHashtags", function (hashtags) {
	return hashtags
		.split(",")
		.map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
