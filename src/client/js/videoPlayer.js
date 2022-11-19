const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreenBtn");

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

const formatTime = (sec) => {
	return new Date(sec * 1000).toISOString().slice(14, 19);
	// Date 객체를 활용한 시간 편집하기. 꿀팁이다.
};

const handleLoadedMetadata = () => {
	totalTime.innerText = formatTime(Math.floor(video.duration));
	timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
	currentTime.innerText = formatTime(Math.floor(video.currentTime));
	timeline.value = Math.floor(video.currentTime);
};

const handleTimeLineChange = (event) => {
	const {
		target: { value },
	} = event;
	video.currentTime = value;
};

const handleFullScreen = () => {
	const fullscreen = document.fullscreenElement;
	if (fullscreen) {
		fullScreenBtn.innerText = "Exit Full Screen";
		document.exitFullscreen();
	} else {
		videoContainer.requestFullscreen();
		fullScreenBtn.innerText = "Enter Full Screen";
		//video.requestFullscreen(); 하면 비디오만 풀화면되고, 콘트롤러들은 안보이게된다.
		//videoContainer로 원하는 요소들을 감싼다음에 풀스크린해줘야된다.
	}
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimeLineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
