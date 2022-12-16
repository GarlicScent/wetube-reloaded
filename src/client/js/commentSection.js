const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const commentContainer = document.querySelector(".video__comments");
const deleteIconAll = commentContainer.querySelectorAll(".fa-trash");

const addComment = (text, id) => {
	const videoComments = document.querySelector(".video__comments ul");
	const newComment = document.createElement("li");
	newComment.dataset.id = id;
	newComment.className = "video__comment";
	const icon = document.createElement("i");
	icon.className = "fas fa-comment";
	const span = document.createElement("span");
	span.innerText = `${text.trim()}`;
	const deleteIcon = document.createElement("i");
	deleteIcon.className = "fas fa-trash";
	newComment.appendChild(icon);
	newComment.appendChild(span);
	newComment.appendChild(deleteIcon);

	deleteIcon.addEventListener("click", handleDeleteComment);

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
	const response = await fetch(`/api/videos/${videoId}/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		//headers 설정으로 json을 보내는 것을 알려주지 않으면 express.json()이 그냥 string을 보내는 것으로 안다.
		body: JSON.stringify({ text }),
	});

	if (response.status === 201) {
		const { newCommentId } = await response.json();
		addComment(text, newCommentId);
	}
	textarea.value = "";
};

if (form) {
	form.addEventListener("submit", handleSubmit);
}

const handleDeleteComment = async (event) => {
	const { id: commentId } = event.path[1].dataset;

	const { status } = await fetch(`/api/comments/${commentId}`, {
		method: "DELETE",
	});

	if (status === 404) {
		return;
	}
	if (status === 200) {
		event.target.removeEventListener("click", handleDeleteComment);
		event.path[1].remove();
	}
};

if (deleteIconAll) {
	deleteIconAll.forEach((val) =>
		val.addEventListener("click", handleDeleteComment)
	);
}
