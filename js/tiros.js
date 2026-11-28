const terminal = document.getElementById("terminal");
const outputDiv = terminal.querySelector("#output");
const promptDiv = terminal.querySelector("#prompt");
const inputDiv = terminal.querySelector("#input");

let theme = '#00ccff';
let pwd = '~';

let prompt = "Enter username: ";
let firstLine = true;

function enterInput() {
	let input = inputDiv.value;

	if (firstLine) {
		firstLine = false;
		let name = input.trim()
			.replaceAll(' ', '-')
			.replace(/[^a-zA-Z0-9\-]/g, '')
			.replace(/[-]+/g, '-')
			.substring(0, 40) || "guest";
		prompt = `${name}@tiros:${pwd}$ `;
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
		outputDiv.innerHTML += `<span style="color: ${theme}">${prompt}</span>${input}\n${handleInput(input)}\n`;
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

function handleInput(input) {
	let parsed = parseCommand(input.toLowerCase());
	input = input.toLowerCase();
	if (input === 'help') {
		return `Welcome to TIROS, the ultimate database for all things TIR!
Here are the commands available to you:
- tables: list the tables inside the database
- list (alias l): list the contents within a table
- inspect (alias i): inspect a record
As a non-admin, you only have read permissions.
`;
	}
	if (input === 'rm -rf /') {
		terminal.remove();
		return;
	}
	return 'Unknown command.'
}

function parseCommand(line) {
	let pipes = [];
	let parts = line.trim().split('|');
	for (let z = 0; z < parts.length; z++)
		pipes.push(parts[z].trim().split(' ').filter(Boolean));
	console.log(pipes);

	return pipes.filter(Boolean);
}
// if quotes detected, say "no i dont parse quotes who do you think i am"
