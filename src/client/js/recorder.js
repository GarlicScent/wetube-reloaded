import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");
const div = document.querySelector("div");

let stream;
let recorder;
let videoFile;

const files = {
	input: "recording.webm",
	output: "output.mp4",
	thumb: "thumbnail.jpg",
	flag: 0,
};

const downloadFile = (fileUrl, fileName) => {
	const a = document.createElement("a");
	a.href = fileUrl;
	a.download = fileName;
	document.body.appendChild(a);
	//body에 추가한 뒤에 클릭되게 해줘야 링크 다운로드가 작동된다.
	a.click();
	files.flag = 1;
};

const handleDownload = async () => {
	actionBtn.removeEventListener("click", handleDownload);

	actionBtn.innerText = "Transcoding...";

	actionBtn.disabled = true;

	const ffmpeg = createFFmpeg({ log: true });
	await ffmpeg.load();

	ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
	// videoFile의 파일을 fetchFile() 사용하여 files.input 이름의 파일을 생성한다.
	await ffmpeg.run("-i", files.input, "-r", "60", files.output);
	//링크를 생성해서 녹화한 비디오를 다운로드할 수 있게한다. "-r", "60" -> record 60 frames per sec
	await ffmpeg.run(
		"-i",
		files.input,
		"-ss",
		"00:00:01",
		"-frames:v",
		"1",
		files.thumb
	);

	const mp4File = ffmpeg.FS("readFile", files.output);
	const thumbFile = ffmpeg.FS("readFile", files.thumb);

	const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
	//what is Unit8Array.buffer? Unit8Array의 raw data 즉 binary data에 접근하려면 buffer를 사용해야한다.
	const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

	const mp4Url = URL.createObjectURL(mp4Blob);
	const thumbUrl = URL.createObjectURL(thumbBlob);

	downloadFile(mp4Url, "MyRecording.mp4");
	downloadFile(thumbUrl, "Mythumbnail.jpg");

	ffmpeg.FS("unlink", files.input);
	ffmpeg.FS("unlink", files.output);
	ffmpeg.FS("unlink", files.thumb);

	URL.revokeObjectURL(mp4Url);
	URL.revokeObjectURL(thumbUrl);
	URL.revokeObjectURL(videoFile);

	actionBtn.disabled = false;
	actionBtn.innerText = "Record Again";
	actionBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
	actionBtn.innerText = "Recording";
	actionBtn.disabled = true;
	actionBtn.removeEventListener("click", handleStart);

	if (files.flag) {
		video.src = null;
		video.srcObject = stream;
		video.play();
	}

	recorder = new MediaRecorder(stream);
	recorder.ondataavailable = (event) => {
		videoFile = URL.createObjectURL(event.data);
		//.createObjectURL()은 브라우저 메모리에서만 사용 가능한 url을 생성해준다. 이 url은 파일을 가르킨다. 브라우저 yes. server no!
		video.srcObject = null;
		//처음 시작할때 유저미디어 videotrack을 스트림으로 넣었는데, 이것을 빈값으로 넣어준것이다. 그래서 저장한 영상을 반복재생해서 보여줄 수 있도록 하기 위함이다.
		video.src = videoFile;
		video.loop = true;
		video.play();
		actionBtn.innerText = "Download";
		actionBtn.disabled = false;
		actionBtn.addEventListener("click", handleDownload);
	};
	recorder.start();

	setTimeout(() => {
		recorder.stop();
	}, 5000);
};

const init = async () => {
	console.log(stream);
	stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			width: 1024,
			height: 576,
		}, //true
	});
	video.srcObject = stream;
	video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
