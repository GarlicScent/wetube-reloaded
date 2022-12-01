const { Body } = require("node-fetch");

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
	const a = document.createElement("a");
	a.href = videoFile;
	a.download = "MyRecording.webm";
	document.body.appendChild(a);
	a.click();
};

const handleStop = () => {
	startBtn.innerText = "Download Recording";
	startBtn.removeEventListener("click", handleStop);
	startBtn.addEventListener("click", handleDownload);
	recorder.stop();
};

const handleStart = () => {
	startBtn.innerText = "Stop Recording";
	startBtn.removeEventListener("click", handleStart);
	startBtn.addEventListener("click", handleStop);

	recorder = new MediaRecorder(stream);
	recorder.ondataavailable = (event) => {
		videoFile = URL.createObjectURL(event.data);
		//.createObjectURL()은 브라우저 메모리에서만 사용 가능한 url을 생성해준다. 이 url은 파일을 가르킨다. 브라우저 yes. server no!
		video.srcObject = null;
		video.src = videoFile;
		video.loop = true;
		video.play();
	};
	recorder.start();

	setTimeout(() => {
		recorder.stop();
	}, 10000);
};

const init = async () => {
	stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: { width: 200, height: 300 }, //true
	});
	video.srcObject = stream;
	video.play();
};

init();

startBtn.addEventListener("click", handleStart);
