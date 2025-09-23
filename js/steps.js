let selects = document.querySelectorAll('.select');
let resultsDiv = document.getElementById('results');
const chs = Object.keys(rel).sort((a, b) => a.localeCompare(b));
for (let z = 0; z < selects.length; z++) {
	for (let x = 0; x < chs.length; x++) {
		selects[z].appendChild(elt('option', { value: chs[x] }, chs[x]));
	}
}

function calculate() {
	let ch1 = selects[0].value;
	let ch2 = selects[1].value;
	if (!(ch1 && ch2)) {
		resultsDiv.innerHTML = '';
		resultsDiv.appendChild(elt('p', {}, 'Please select two characters!'));
		return;
	}
	let result = findRelationshipPath(rel, ch1, ch2);
	if (result === 'none') {
		resultsDiv.innerHTML = '';
		resultsDiv.appendChild(elt('p', {}, 'No connection found. Sorry!'));
		return;
	}
	if (result === 'self') {
		resultsDiv.innerHTML = '';
		resultsDiv.appendChild(elt('p', {}, 'These two characters are the same!'));
		return;
	}
	resultsDiv.innerHTML = '';
	let p = elt('div', { className: 'results' });
	for (let z = 0; z < result.length; z++) {
		p.innerHTML += `<a href="../../characters/${result[z].name.toLowerCase()}/">${result[z].name}</a>`;
		if (z != result.length - 1)
			p.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>(${result[z].rel || 'has connection to'}) `;
	}
	resultsDiv.appendChild(p);
	resultsDiv.appendChild(elt('p', {}, `Characters in-between: ${result.length - 2}!`))
}

function findRelationshipPath(graph, start, end) {
	if (start === end) return 'self';
	let visited = new Set();
	let queue = [{ name: start, path: [] }];
	while (queue.length > 0) {
		let { name, path } = queue.shift();
		if (visited.has(name)) continue;
		visited.add(name);
		let neighbors = graph[name] || [];
		for (let neighbor of neighbors) {
			let newPath = [...path, { name, rel: neighbor.rel }];
			if (neighbor.name === end) return [...newPath, { name: end, rel: null }];
			queue.push({ name: neighbor.name, path: newPath });
		}
	}
	return 'none';
}

function facts() {
	let longestPath = 0, none = 0, total = 0;
	let middleCount = {};
	for (let z = 0; z < chs.length; z++) {
		for (let x = z + 1; x < chs.length; x++) {
			let result = findRelationshipPath(rel, chs[z], chs[x]);
			total++;
			if (result === 'none') {
				none++;
				continue;
			}
			if (result.length > longestPath) longestPath = result.length;
			for (let c = 1; c < result.length - 1; c++) {
				middleCount[result[c].name] = (middleCount[result[c].name] || 0) + 1;
			}
		}
	}
	let maxMiddle = 0, maxName = '', minMiddle = 999999, minName = '';
	for (let [name, num] of Object.entries(middleCount)) {
		if (num > maxMiddle) {
			maxMiddle = num;
			maxName = name
		}
		if (num < minMiddle) {
			minMiddle = num;
			minName = name;
		}
	}
	let factsDiv = document.getElementById('facts');
	factsDiv.appendChild(elt('p', {}, `Out of the ${total} possible unique combinations (excluding useless self-connections), there are ${none} possible combinations where no connection can be found. I want to get that number down to zero.`));
	factsDiv.appendChild(elt('p', {}, `The longest path has ${longestPath - 2} characters in-between. Can you find it? (There might be more than one. I haven't checked. Nor have I found any for that matter. I could let the program tell me, but what's the fun in that?)`));
	factsDiv.appendChild(elt('p', {}, `The character that appears most frequently as an intermediary is ${maxName} at ${maxMiddle} times. Conversely, the least is ${minName} at ${minMiddle} times.`));
	factsDiv.appendChild(elt('p', {}, `The BFS algorithm that I `, elt('s', {}, `copied off the internet`), ` totally wrote myself only looks for the first shortest path found, so the characters that appear most and least frequently as an intermediary is based off of that only.`));
	document.getElementById('facts-button').outerHTML = '<h2>Interesting facts</h2>';
}

function elt(type, props, ...children) {
	let dom = document.createElement(type);
	if (props) Object.assign(dom, props);
	for (let child of children) {
		if (typeof child != "string") dom.appendChild(child);
		else dom.appendChild(document.createTextNode(child));
	}
	return dom;
}