const terminal = document.getElementById("terminal");
const outputDiv = terminal.querySelector("#output");
const promptDiv = terminal.querySelector("#prompt");
const inputDiv = terminal.querySelector("#input");

let theme = '#00ccff';

let prompt = "Enter username: ";
let firstLine = true;

function enterInput() {
	let input = inputDiv.value;

	if (firstLine) {
		firstLine = false;
		let name = input.trim()
			.replaceAll(' ', '-')
			.replace(/[^a-zA-Z0-9]/g, '')
			.replace(/[-]+/g, '-') || "guest";
		prompt = `${name}@tiros:~$ `;
		promptDiv.innerHTML = prompt;
		promptDiv.style.color = theme;
		outputDiv.innerHTML = `
 ________  ______  _______            ______    ______
/        |/      |/       \\          /      \\  /      \\
████████/ ██████/ ███████  |        /██████  |/██████  |
   ██ |     ██ |  ██ |__██ | ______ ██ |  ██ |██ \\__██/
   ██ |     ██ |  ██    ██< /      |██ |  ██ |██      \\
   ██ |     ██ |  ███████  |██████/ ██ |  ██ | ██████  |
   ██ |    _██ |_ ██ |  ██ |        ██ \\__██ |/  \\__██ |
   ██ |   / ██   |██ |  ██ |        ██    ██/ ██    ██/
   ██/    ██████/ ██/   ██/          ██████/   ██████/

Hello, ${name}! Type "help" to get started!
`;
	} else {
		outputDiv.innerHTML += `<span style="color: ${theme}">${prompt}</span>${input}\n`;
	}

	terminal.scrollTop = terminal.scrollHeight;
	inputDiv.value = '';
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
