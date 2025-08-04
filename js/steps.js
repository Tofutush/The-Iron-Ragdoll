let selects = document.querySelectorAll('.select');
let resultsDiv = document.getElementById('results');
for (let z = 0; z < selects.length; z++) {
	for (let ch of Object.keys(rel).sort((a, b) => a.localeCompare(b))) {
		selects[z].appendChild(elt('option', { value: ch }, ch));
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

function elt(type, props, ...children) {
	let dom = document.createElement(type);
	if (props) Object.assign(dom, props);
	for (let child of children) {
		if (typeof child != "string") dom.appendChild(child);
		else dom.appendChild(document.createTextNode(child));
	}
	return dom;
}