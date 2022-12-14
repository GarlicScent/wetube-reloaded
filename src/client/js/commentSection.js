const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
	event.preventDefault();
	const textarea = form.querySelector("textarea");
	const text = textarea.value;
	const videoId = videoContainer.dataset.id;
	if (text === "") {
		return;
	}
	fetch(`/api/videos/${videoId}/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		//headers 설정으로 json을 보내는 것을 알려주지 않으면 express.json()이 그냥 string을 보내는 것으로 안다.
		body: JSON.stringify({ text }),
	});
	textarea.value = "";
};

if (form) {
	form.addEventListener("submit", handleSubmit);
}
