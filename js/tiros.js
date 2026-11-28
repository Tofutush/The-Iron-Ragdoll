const terminal = document.getElementById("terminal");
const outputDiv = terminal.querySelector("#output");
const promptDiv = terminal.querySelector("#prompt");
const inputDiv = terminal.querySelector("#input");

let theme = '#00ccff';
let pwd = '~';

let prompt = "Enter username: ";
let firstLine = true;
let hist = [];
let histIdx = 0;

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
		if (hist.length == 0 || hist[hist.length - 1] !== input) {
			hist.push(input);
			histIdx = hist.length;
		}
		outputDiv.innerHTML += `<span class="colored">${prompt}</span>${input}\n${handleInput(input)}\n`;
	}

	terminal.scrollTop = terminal.scrollHeight;
	inputDiv.value = '';
	inputDiv.focus();
}

inputDiv.addEventListener("keydown", event => {
	if (event.key == "Enter") {
		event.preventDefault();
		enterInput();
	} else if (event.key == 'ArrowUp') {
		event.preventDefault();
		if (hist.length == 0) return;
		histIdx -= 1;
		if (histIdx >= 0 && histIdx < hist.length)
			inputDiv.value = hist[histIdx];
		else
			histIdx = Math.min(Math.max(histIdx, 0), hist.length);
	} else if (event.key == 'ArrowDown') {
		event.preventDefault();
		histIdx += 1;
		if (histIdx >= 0 && histIdx < hist.length)
			inputDiv.value = hist[histIdx];
		else
			histIdx = Math.min(Math.max(histIdx, 0), hist.length);
		if (histIdx >= hist.length) inputDiv.value = '';
	}
});

terminal.addEventListener("click", event => {
	if (event.target.closest("a")) return;
	if (window.getSelection().toString()) return;
	inputDiv.focus();
});

inputDiv.focus();

const commands = [
	{
		name: ['help'],
		execute: s => {
			return `Welcome to TIROS, the ultimate database for all things TIR!
Here are the database commands available to you:
- tables: list the tables inside the database
- list (alias l): list the contents within a table
- inspect (alias i): inspect a record
- manual (alias man): check the documentation of a command or filter
Use "man [command]" to learn more about a specific command.
TIROS is a custom build of Ubuntu. As a non-admin, you only have read permissions.
`;
		}
	},
	{
		name: ['rm'],
		execute: s => {
			if (s[1] == '-rf' && s[2] == '/') {
				terminal.remove();
				return;
			}
			return `${s.join(' ')}: Permission denied.`
		}
	}
];

function handleInput(input) {
	let parsed = parseCommand(input.toLowerCase());
	for (let z = 0; z < parsed.length; z++) {
		let curr = parsed[z];
		let command = commands.find(c => c.name.includes(curr[0]));
		if (!command) return `${curr[0]}: command not found.`
		return command.execute(curr);
	}
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
