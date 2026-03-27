const width = 1200;
const height = 600;
let font12 = 12, font16 = 16, font20 = 20;
// stuff in the graph, for updating
let simulation, linkGroup, link, linkLabel1, linkLabel2, nodeGroup, node, nodeLabel, bigG;
// stuff for filtering
let focusCh = '', depth = 1, hideMinor = false;

// steps data
let stepsGraph = {};
for (let r of data.rel) {
	let aName = r.source;
	let aRel = r.rel1 || '';
	let bName = r.target;
	let bRel = r.rel2 || '';
	if (!stepsGraph[aName]) stepsGraph[aName] = [];
	if (!stepsGraph[bName]) stepsGraph[bName] = [];
	stepsGraph[aName].push({ name: bName, rel: bRel });
	stepsGraph[bName].push({ name: aName, rel: aRel });
}

// add ch to select fields
// focus
for (let ch of data.ch.sort((a, b) => a.id.localeCompare(b.id)).map(ch => ch.id)) {
	document.getElementById('chInput').appendChild(elt('option', { value: ch }, ch));
}
// connections
for (let select of document.querySelectorAll('.select')) {
	for (let ch of Object.keys(stepsGraph).sort((a, b) => a.localeCompare(b))) {
		select.appendChild(elt('option', { value: ch }, ch));
	}
}

///////// D3 stuff

// Create the SVG container.
const svg = d3.select("#graph")
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [-width / 2, -height / 2, width, height])
	.call(d3.zoom()
		.on("zoom", (event) => {
			bigG.attr("transform", event.transform);
			// font size
			font12 = Math.min(12, 12 / event.transform.k);
			font16 = Math.min(16, 16 / event.transform.k);
			font20 = Math.min(20, 20 / event.transform.k);
			linkLabel1.attr('font-size', font12);
			linkLabel2.attr('font-size', font12);
			nodeLabel.attr('font-size', font16);
		}));

// zoom wrapper
bigG = svg.append('g');

setFocus('none', depth, hideMinor);

function updateGraph(data) {
	const links = [...data.rel];
	const nodes = [...data.ch];

	// clear
	if (bigG) bigG.selectAll('*').remove();

	// Create a simulation with several forces.
	simulation = d3.forceSimulation(nodes)
		.force("link", d3.forceLink(links).id(d => d.id).distance(200))
		.force("charge", d3.forceManyBody().strength(-400))
		.force("x", d3.forceX())
		.force("y", d3.forceY());

	linkGroup = bigG.append("g")
		.selectAll("g")
		.data(links)
		.join("g");

	// link lines
	link = linkGroup.append("line")
		.attr("stroke", "var(--text)")
		.attr('opacity', 0.1)
		.attr("stroke-width", 2);

	// link labels
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

	// node labels & circles
	nodeLabel = bigG.append("g")
		.selectAll("text")
		.data(nodes)
		.join("text")
		.attr("text-anchor", "middle")
		.attr('font-size', font16)
		.attr('font-weight', 'bold')
		.attr("dy", 32)
		.text(d => d.id)
		.attr("fill", "var(--text)")
		.attr('opacity', 0.5)
		.style('user-select', 'none');
	// circle come after label so its layered top
	node = bigG.append("g")
		.selectAll("a")
		.data(nodes)
		.join("a")
		.attr("xlink:href", d => `../${d.id.toLowerCase()}/`)
		.attr("target", "_blank")
		.append("svg:image")
		.join("svg:image")
		.attr('width', 40)
		.attr('height', 40)
		.attr("xlink:href", d => d.img)
		// .attr("r", 8)
		// .attr('stroke', 'var(--bg)')
		// .attr('stroke-width', 2)
		// .attr("fill", d => d.color)
		.on("pointerover", function (e, d) {
			d3.select(this)
				.style('z-index', 9);
			nodeLabel.filter(l => l === d)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr('opacity', 1)
				.attr('font-size', font20)
				.style('z-index', 9)
				.attr('dy', 36);
			linkLabel1.filter(l => l.source === d)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr('opacity', 1)
				.attr('font-size', font16)
				.style('z-index', 9);
			linkLabel2.filter(l => l.target === d)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr('opacity', 1)
				.attr('font-size', font16)
				.style('z-index', 9);
			link.filter(l => l.source === d || l.target === d)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr('opacity', .3);
		})
		.on("pointerout", function (e, d) {
			d3.select(this)
				.style('z-index', 0);
			nodeLabel.filter(l => l === d)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr('opacity', .5)
				.attr('font-size', font16)
				.style('z-index', 0)
				.attr('dy', 32);
			linkLabel1.filter(l => l.source === d)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr('opacity', .3)
				.attr('font-size', font12)
				.style('z-index', 0);
			linkLabel2.filter(l => l.target === d)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr('opacity', .3)
				.attr('font-size', font12)
				.style('z-index', 0);
			link.filter(l => l.source === d || l.target === d)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr('opacity', .1);
		});

	// Add a drag behavior.
	node.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));

	// Set the position attributes of links and nodes each time the simulation ticks.
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

// Reheat the simulation when drag starts, and fix the subject position.
function dragstarted(event) {
	if (!event.active) simulation.alphaTarget(0.3).restart();
	event.subject.fx = event.subject.x;
	event.subject.fy = event.subject.y;
}

// Update the subject (dragged node) position during drag.
function dragged(event) {
	event.subject.fx = event.x;
	event.subject.fy = event.y;
}

// Restore the target alpha so the simulation cools after dragging ends.
// Unfix the subject position now that it’s no longer being dragged.
function dragended(event) {
	if (!event.active) simulation.alphaTarget(0);
	event.subject.fx = null;
	event.subject.fy = null;
}

///////// focus stuff

// filtering for character and depth
function setFocus(ch, d, hide) {
	if ((focusCh === ch && depth === d && hideMinor === hide) || focusCh === 'none' && ch === 'none' && hideMinor === hide) return;
	focusCh = ch;
	depth = d;
	hideMinor = hide;
	if (focusCh === 'none') {
		let relNew = [];
		if (hideMinor) relNew = data.rel.filter(r => !r.minor);
		else relNew = data.rel;
		document.getElementById('depthInput').disabled = true;
		document.getElementById('chNum').innerHTML = data.ch.length + ' character' + (data.ch.length === 1 ? '' : 's');
		document.getElementById('linkNum').innerHTML = relNew.length + ' connection' + (data.rel.length === 1 ? '' : 's');
		updateGraph({
			ch: data.ch,
			rel: relNew
		});
	} else {
		document.getElementById('depth').innerHTML = depth;
		document.getElementById('depthInput').disabled = false;
		// filter out this character. filter bc we need color as well
		let chNew = data.ch.filter(c => c.id === focusCh);
		let relNew = [];
		if (hideMinor) relNew = data.rel.filter(r => !r.minor);
		else relNew = data.rel;
		// characters. loop once for each depth
		for (let z = 0; z < depth; z++) {
			// finds every character that has a link to the current list
			chNew.push(...data.ch.filter(c =>
				relNew.some(r => chNew.some(c2 =>
					(c.id === r.source.id && c2.id === r.target.id)
					|| (c.id === r.target.id && c2.id === r.source.id))
				)
				&& !chNew.includes(c)
			));
		}
		// find rels whose source and target are both in the list
		relNew = relNew.filter(r =>
			chNew.some(c => c.id === r.source.id)
			&& chNew.some(c => c.id === r.target.id)
		);
		document.getElementById('chNum').innerHTML = chNew.length + ' character' + (chNew.length === 1 ? '' : 's');
		document.getElementById('linkNum').innerHTML = relNew.length + ' connection' + (relNew.length === 1 ? '' : 's');
		updateGraph({
			ch: chNew,
			rel: relNew
		});
	}
}

function resetFocus() {
	document.getElementById('chInput').value = 'none';
	document.getElementById('depthInput').value = "1";
	document.getElementById('depth').innerHTML = "1";
	document.getElementById('hide-minor').checked = false;
	setFocus('none', 1, false, true);
}

document.getElementById('chInput').onchange = e => setFocus(e.target.value, depth, hideMinor);
document.getElementById('depthInput').oninput = e => setFocus(focusCh, e.target.value, hideMinor);
document.getElementById('hide-minor').onchange = e => setFocus(focusCh, depth, e.target.checked);

///////// connections stuff

function calculateSteps() {
	let message = document.getElementById('steps-results');
	let ch1 = selects[0].value;
	let ch2 = selects[1].value;
	if (!(ch1 && ch2)) {
		message.innerText = 'Please select two characters!';
		return;
	}
	let result = findRelationshipPath(rel, ch1, ch2);
	if (result === 'none') {
		message.innerText = 'No connection found. Sorry!';
		return;
	}
	if (result === 'self') {
		message.innerText = 'These two characters are the same!';
		return;
	}
	// resultsDiv.innerHTML = '';
	// let p = elt('div', { className: 'results' });
	// for (let z = 0; z < result.length; z++) {
	// 	p.innerHTML += `<a href="../../characters/${result[z].name.toLowerCase()}/">${result[z].name}</a>`;
	// 	if (z != result.length - 1)
	// 		p.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>(${result[z].rel || 'has connection to'}) `;
	// }
	// resultsDiv.appendChild(p);
	// resultsDiv.appendChild(elt('p', {}, `Characters in-between: ${result.length - 2}!`))
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

///////// mode select

const focusDiv = document.getElementById('focus');
const connectionsDiv = document.getElementById('connections');

document.getElementById('no-mode').onchange = e => {
	resetFocus();
	focusDiv.style.display = 'none';
	connectionsDiv.style.display = 'none';
}
document.getElementById('focus-mode').onchange = e => {
	resetFocus();
	focusDiv.style.display = 'block';
	connectionsDiv.style.display = 'none';
}
document.getElementById('connections-mode').onchange = e => {
	resetFocus();
	focusDiv.style.display = 'none';
	connectionsDiv.style.display = 'block';
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
