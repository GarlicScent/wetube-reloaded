const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const handleStart = async () => {
	const constraints = {
		audio: false,
		video: true, //{ width: 200, height: 100 }
	};
	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	console.log(stream);
	video.srcObject = stream;
	video.play();
};

startBtn.addEventListener("click", handleStart);
