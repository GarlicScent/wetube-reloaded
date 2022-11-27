const startBtn = document.getElementById("startBtn");

const handleStart = async () => {
	const constraints = {
		audio: true,
		video: true,
	};
	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	console.log(stream);
};

startBtn.addEventListener("click", handleStart);
