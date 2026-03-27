const width = 1200;
const height = 600;
let font12 = 12, font16 = 16, font20 = 20;

// D3 / Graph elements
let simulation, linkGroup, link, linkLabel1, linkLabel2, nodeGroup, node, nodeLabel, bigG;

// Filtering state
let focusCh = '', depth = 1, hideMinor = false;

// DOM elements
const chInput = document.getElementById('chInput');
const depthInput = document.getElementById('depthInput');
const depthDisplay = document.getElementById('depth');
const hideMinorInput = document.getElementById('hide-minor');
const stepsResults = document.getElementById('steps-results');
const chNumDisplay = document.getElementById('chNum');
const linkNumDisplay = document.getElementById('linkNum');
const selects = document.querySelectorAll('.select');

const focusDiv = document.getElementById('focus');
const connectionsDiv = document.getElementById('connections');

// --- Build stepsGraph ---
let stepsGraph = {};
for (let r of data.rel) {
	const { source: aName, rel1: aRel = '', target: bName, rel2: bRel = '' } = r;
	if (!stepsGraph[aName]) stepsGraph[aName] = [];
	if (!stepsGraph[bName]) stepsGraph[bName] = [];
	stepsGraph[aName].push({ name: bName, rel: bRel });
	stepsGraph[bName].push({ name: aName, rel: aRel });
}

// --- Populate select fields ---
for (let ch of data.ch.sort((a, b) => a.id.localeCompare(b.id)).map(c => c.id)) {
	let option = document.createElement('option');
	option.innerText = ch;
	option.value = ch;
	document.getElementById('chInput').appendChild(option);
}

for (let select of selects) {
	for (let ch of Object.keys(stepsGraph).sort((a, b) => a.localeCompare(b))) {
		let option = document.createElement('option');
		option.innerText = ch;
		option.value = ch;
		select.appendChild(option);
	}
}

// --- D3 SVG setup ---
const svg = d3.select("#graph")
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [-width / 2, -height / 2, width, height])
	.call(d3.zoom().on("zoom", (event) => {
		bigG.attr("transform", event.transform);

		font12 = Math.min(12, 12 / event.transform.k);
		font16 = Math.min(16, 16 / event.transform.k);
		font20 = Math.min(20, 20 / event.transform.k);

		linkLabel1?.attr('font-size', font12);
		linkLabel2?.attr('font-size', font12);
		nodeLabel?.attr('font-size', font16);
	}));

bigG = svg.append('g');

setFocus('none', depth, hideMinor);

// --- Graph update function ---
function updateGraph({ ch: nodes, rel: links }) {
	bigG.selectAll('*').remove();

	simulation = d3.forceSimulation(nodes)
		.force("link", d3.forceLink(links).id(d => d.id).distance(200))
		.force("charge", d3.forceManyBody().strength(-400))
		.force("x", d3.forceX())
		.force("y", d3.forceY());

	linkGroup = bigG.append("g").selectAll("g").data(links).join("g");

	link = linkGroup.append("line")
		.attr("stroke", "var(--text)")
		.attr('opacity', 0.1)
		.attr("stroke-width", 2);

	linkLabel1 = linkGroup.append("text")
		.attr("text-anchor", "middle")
		.attr("fill", d => d.source.color)
		.attr("font-size", font12)
		.attr('opacity', 0.3)
		.style('user-select', 'none')
		.text(d => d.rel1);

	linkLabel2 = linkGroup.append("text")
		.attr("text-anchor", "middle")
		.attr("fill", d => d.target.color)
		.attr("font-size", font12)
		.attr('opacity', 0.3)
		.style('user-select', 'none')
		.text(d => d.rel2);

	nodeLabel = bigG.append("g").selectAll("text").data(nodes).join("text")
		.attr("text-anchor", "middle")
		.attr('font-size', font16)
		.attr('font-weight', 'bold')
		.attr("dy", 32)
		.text(d => d.id)
		.attr("fill", "var(--text)")
		.attr('opacity', 0.5)
		.style('user-select', 'none');

	node = bigG.append("g").selectAll("a").data(nodes).join("a")
		.attr("xlink:href", d => `../${d.id.toLowerCase()}/`)
		.attr("target", "_blank")
		.append("svg:image")
		.attr('width', 40)
		.attr('height', 40)
		.attr("xlink:href", d => d.img)
		.on("pointerover", handlePointerOver)
		.on("pointerout", handlePointerOut)
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended)
		);

	simulation.on("tick", () => {
		link.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y);

		node.attr('x', d => d.x - 20)
			.attr('y', d => d.y - 20);

		nodeLabel.attr("x", d => d.x)
			.attr("y", d => d.y);

		linkLabel1.attr("x", d => (d.source.x + d.target.x) / 2)
			.attr("y", d => (d.source.y + d.target.y) / 2 - ((d.rel1 === d.rel2) ? 0 : 5));

		linkLabel2.attr("x", d => (d.source.x + d.target.x) / 2)
			.attr("y", d => (d.source.y + d.target.y) / 2 + ((d.rel1 === d.rel2) ? 0 : 10));
	});
}

// --- Pointer handlers ---
function handlePointerOver(e, d) {
	d3.select(this).style('z-index', 9);
	nodeLabel.filter(l => l === d)
		.transition().duration(200).ease(d3.easeCubicInOut)
		.attr('opacity', 1).attr('font-size', font20).attr('dy', 36)
		.style('z-index', 9);

	linkLabel1.filter(l => l.source === d)
		.transition().duration(200).ease(d3.easeCubicInOut)
		.attr('opacity', 1).attr('font-size', font16).style('z-index', 9);

	linkLabel2.filter(l => l.target === d)
		.transition().duration(200).ease(d3.easeCubicInOut)
		.attr('opacity', 1).attr('font-size', font16).style('z-index', 9);

	link.filter(l => l.source === d || l.target === d)
		.transition().duration(200).ease(d3.easeCubicInOut)
		.attr('opacity', 0.3);
}

function handlePointerOut(e, d) {
	d3.select(this).style('z-index', 0);
	nodeLabel.filter(l => l === d)
		.transition().duration(200).ease(d3.easeCubicInOut)
		.attr('opacity', 0.5).attr('font-size', font16).attr('dy', 32).style('z-index', 0);

	linkLabel1.filter(l => l.source === d)
		.transition().duration(200).ease(d3.easeCubicInOut)
		.attr('opacity', 0.3).attr('font-size', font12).style('z-index', 0);

	linkLabel2.filter(l => l.target === d)
		.transition().duration(200).ease(d3.easeCubicInOut)
		.attr('opacity', 0.3).attr('font-size', font12).style('z-index', 0);

	link.filter(l => l.source === d || l.target === d)
		.transition().duration(200).ease(d3.easeCubicInOut)
		.attr('opacity', 0.1);
}

// --- Drag handlers ---
function dragstarted(event) {
	if (!event.active) simulation.alphaTarget(0.3).restart();
	event.subject.fx = event.subject.x;
	event.subject.fy = event.subject.y;
}

function dragged(event) {
	event.subject.fx = event.x;
	event.subject.fy = event.y;
}

function dragended(event) {
	if (!event.active) simulation.alphaTarget(0);
	event.subject.fx = null;
	event.subject.fy = null;
}

// --- Focus/filtering ---
function setFocus(ch, d, hide) {
	if ((focusCh === ch && depth === d && hideMinor === hide) || (focusCh === 'none' && ch === 'none' && hideMinor === hide)) return;

	focusCh = ch;
	depth = d;
	hideMinor = hide;

	if (focusCh === 'none') {
		const relNew = hideMinor ? data.rel.filter(r => !r.minor) : data.rel;
		depthInput.disabled = true;
		chNumDisplay.textContent = `${data.ch.length} character${data.ch.length === 1 ? '' : 's'}`;
		linkNumDisplay.textContent = `${relNew.length} connection${relNew.length === 1 ? '' : 's'}`;
		updateGraph({ ch: data.ch, rel: relNew });
	} else {
		depthInput.disabled = false;
		depthDisplay.textContent = depth;

		let chNew = data.ch.filter(c => c.id === focusCh);
		let relNew = hideMinor ? data.rel.filter(r => !r.minor) : data.rel;

		for (let z = 0; z < depth; z++) {
			chNew.push(...data.ch.filter(c =>
				relNew.some(r => chNew.some(c2 =>
					(c.id === r.source.id && c2.id === r.target.id) || (c.id === r.target.id && c2.id === r.source.id)
				)) && !chNew.includes(c)
			));
		}

		relNew = filterRels(chNew, relNew);
		chNumDisplay.textContent = `${chNew.length} character${chNew.length === 1 ? '' : 's'}`;
		linkNumDisplay.textContent = `${relNew.length} connection${relNew.length === 1 ? '' : 's'}`;
		updateGraph({ ch: chNew, rel: relNew });
	}
}

function filterRels(chs, rels) {
	return rels.filter(r => chs.some(c => c.id === r.source.id) && chs.some(c => c.id === r.target.id));
}

// --- Reset ---
function reset() {
	chInput.value = 'none';
	depthInput.value = "1";
	depthDisplay.textContent = "1";
	hideMinorInput.checked = false;
	stepsResults.textContent = '';
	setFocus('none', 1, false, true);
	updateGraph(data);
}

// --- Event listeners ---
chInput.onchange = e => setFocus(e.target.value, depth, hideMinor);
depthInput.oninput = e => setFocus(focusCh, e.target.value, hideMinor);
hideMinorInput.onchange = e => setFocus(focusCh, depth, e.target.checked);

// --- Connections ---
function calculateSteps() {
	stepsResults.textContent = '';
	const [ch1, ch2] = [selects[0].value, selects[1].value];
	if (!ch1 || !ch2) return stepsResults.textContent = 'Please select two characters!';

	const result = findRelationshipPath(stepsGraph, ch1, ch2);
	if (result === 'none') return stepsResults.textContent = 'No connection found. Sorry!', updateGraph(data);
	if (result.length === 1) return stepsResults.textContent = 'These two characters are the same!', updateGraph(data);

	stepsResults.textContent = `Characters in-between: ${result.length - 2}!`;
	const newCh = data.ch.filter(ch => result.includes(ch.id));
	updateGraph({ ch: newCh, rel: filterRels(newCh, data.rel) });
}

function findRelationshipPath(graph, start, end) {
	if (start === end) return data.ch.filter(ch => ch.id === start);

	const visited = new Set();
	const queue = [{ name: start, path: [] }];

	while (queue.length) {
		const { name, path } = queue.shift();
		if (visited.has(name)) continue;
		visited.add(name);

		const neighbors = graph[name] || [];
		for (const neighbor of neighbors) {
			const newPath = [...path, name];
			if (neighbor.name === end) return [...newPath, end];
			queue.push({ name: neighbor.name, path: newPath });
		}
	}
	return 'none';
}

// --- Mode selection ---
document.getElementById('no-mode').onchange = () => {
	reset();
	focusDiv.style.display = 'none';
	connectionsDiv.style.display = 'none';
};

document.getElementById('focus-mode').onchange = () => {
	reset();
	focusDiv.style.display = 'block';
	connectionsDiv.style.display = 'none';
};

document.getElementById('connections-mode').onchange = () => {
	reset();
	focusDiv.style.display = 'none';
	connectionsDiv.style.display = 'block';
};
