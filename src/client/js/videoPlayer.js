const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
	if (video.paused) {
		video.play();
	} else {
		video.pause();
	}
	playBtn.innerText = video.paused ? "Play" : "Paused";
};

const handleMute = (e) => {
	if (video.muted) {
		//음소거인데 버튼 클릭했을 때
		video.muted = false;
	} else {
		//음소거 아닌데 버튼 클릭했을 때
		video.muted = true;
	}
	muteBtn.innerText = video.muted ? "Unmute" : "Mute";
	volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
	console.log(event.target.value);
	const {
		target: { value },
	} = event;

	if (video.muted) {
		video.muted = false;
		muteBtn.innerText = "Mute";
	}
	volumeValue = value;
	video.volume = value;
};

const handleLoadedMetadata = () => {
	const vidTime = Math.floor(video.duration);
	totalTime.innerText = `${parseInt(vidTime / 60)}:${vidTime % 60}`;
};

const handleTimeUpdate = () => {
	const { currentTime: vidCurrentTime } = video;
	const minute =
		parseInt(vidCurrentTime / 60) < 10
			? `0${parseInt(vidCurrentTime / 60)}`
			: `${parseInt(vidCurrentTime / 60)}`;
	const sec =
		vidCurrentTime % 60 < 10
			? `0${parseInt(vidCurrentTime % 60)}`
			: `${parseInt(vidCurrentTime % 60)}`;
	//분과 초가 00:00으로 표현되게 수정하였다.
	currentTime.innerText = `${minute}:${sec}`;
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
