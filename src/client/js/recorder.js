import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
let video = document.getElementById("preview");
const div = document.querySelector("div");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
	const ffmpeg = createFFmpeg({ log: true });
	await ffmpeg.load();

	ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

	await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
	//링크를 생성해서 녹화한 비디오를 다운로드할 수 있게한다.
	const a = document.createElement("a");
	a.href = videoFile;
	a.download = "MyRecording.webm";
	document.body.appendChild(a);
	a.click();
	//body에 축한뒤에 클릭되게 해줘야 링크 다운로드가 작동된다.

	//video 촬영 멈추고, 비디오 화면을 없애기.
	const videoTrack = stream.getVideoTracks();
	videoTrack.forEach((track) => track.stop());

	video.remove();
	stream = null;
	video = null;
	recorder = null;

	//다시 반복을 위해서 이벤트리스너 제거 및 추가.
	startBtn.innerText = "Start Recording";
	startBtn.removeEventListener("click", handleDownload);
	startBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
	startBtn.innerText = "Download Recording";
	startBtn.removeEventListener("click", handleStop);
	startBtn.addEventListener("click", handleDownload);
	recorder.stop();
};

const init = async () => {
	stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: { width: 200, height: 300 }, //true
	});
	video.srcObject = stream;
	video.play();
};

const handleStart = () => {
	if (video === null) {
		video = document.createElement("video");
		div.prepend(video);
	}
	startBtn.innerText = "Stop Recording";
	startBtn.removeEventListener("click", handleStart);
	startBtn.addEventListener("click", handleStop);
	if (stream === null) {
		init();
	}
	recorder = new MediaRecorder(stream);
	//다운로드 받고 다시 start하면 뭔가 오류가 있다. 이부분 확인이 필요하다.
	recorder.ondataavailable = (event) => {
		videoFile = URL.createObjectURL(event.data);
		//.createObjectURL()은 브라우저 메모리에서만 사용 가능한 url을 생성해준다. 이 url은 파일을 가르킨다. 브라우저 yes. server no!
		video.srcObject = null;
		//처음 시작할때 유저미디어 videotrack을 스트림으로 넣었는데, 이것을 빈값으로 넣어준것이다. 그래서 저장한 영상을 반복재생해서 보여줄 수 있도록 하기 위함이다.
		video.src = videoFile;
		video.loop = true;
		video.play();
	};
	recorder.start();
};

init();

startBtn.addEventListener("click", handleStart);
