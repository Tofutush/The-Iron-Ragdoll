const terminal = document.getElementById("terminal");
const outputDiv = terminal.querySelector("#output");
const promptDiv = terminal.querySelector("#prompt");
const inputDiv = terminal.querySelector("#input");

let theme = '#00ccff';

let prompt = "Enter username: ";
let firstLine = true;

function enterInput() {
	let value = inputDiv.value;
	outputDiv.textContent += prompt + value + "\n";
	inputDiv.value = "";

	if (firstLine) {
		firstLine = false;
		let name = value.trim()
			.replaceAll(' ', '-')
			.replace(/[^a-zA-Z0-9]/g, '')
			.replace(/[-]+/g, '-') || "guest";
		prompt = `${name}@tiros:~$ `;
		promptDiv.innerHTML = prompt;
		promptDiv.style.color = theme;
	}
	terminal.scrollTop = terminal.scrollHeight;
	inputDiv.focus();
}

inputDiv.addEventListener("keydown", event => {
	if (event.key == "Enter") {
		event.preventDefault();
		enterInput();
	}
});

terminal.addEventListener("click", event => {
	if (event.target.closest("a")) return;
	if (window.getSelection().toString()) return;
	inputDiv.focus();
});

inputDiv.focus();
