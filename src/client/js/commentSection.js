const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
	const videoComments = document.querySelector(".video__comments ul");
	const newComment = document.createElement("li");
	newComment.className = "video__comment";
	const icon = document.createElement("i");
	icon.className = "fas fa-comment";
	const span = document.createElement("span");
	span.innerText = ` ${text}`;
	newComment.appendChild(icon);
	newComment.appendChild(span);

	videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
	event.preventDefault();
	const textarea = form.querySelector("textarea");
	const text = textarea.value;
	const videoId = videoContainer.dataset.id;
	if (text === "") {
		return;
	}
	const { status } = await fetch(`/api/videos/${videoId}/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		//headers 설정으로 json을 보내는 것을 알려주지 않으면 express.json()이 그냥 string을 보내는 것으로 안다.
		body: JSON.stringify({ text }),
	});

	if (status === 201) {
		console.log("create fake comment");
		addComment(text);
	}
	textarea.value = "";
};

if (form) {
	form.addEventListener("submit", handleSubmit);
}
