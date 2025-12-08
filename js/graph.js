const width = 1200;
const height = 600;
let font12 = 12, font16 = 16, font20 = 20;
// stuff in the graph, for updating
let simulation, linkGroup, link, linkLabel1, linkLabel2, nodeGroup, node, nodeLabel, bigG;
// stuff for filtering
let focusCh = "", depth = 1;

// Create the SVG container.
const svg = d3.select("#graph")
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [-width / 2, -height / 2, width, height])
	.call(d3.zoom()
		.on("zoom", (event) => {
			bigG.attr("transform", event.transform);
			// font size
			font12 = 12 / event.transform.k;
			font16 = 16 / event.transform.k;
			font20 = 20 / event.transform.k;
			linkLabel1.attr('font-size', font12);
			linkLabel2.attr('font-size', font12);
			nodeLabel.attr('font-size', font16);
		}));

// zoom wrapper
bigG = svg.append('g');

setFocus('none', 1);

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
		.data(nodes)
		.join("svg:image")
		.attr('width', 40)
		.attr('height', 40)
		.attr("xlink:href", d => imgs[d.id])
		// .attr("r", 8)
		// .attr('stroke', 'var(--bg)')
		// .attr('stroke-width', 2)
		// .attr("fill", d => d.color)
		.on("pointerover", function (e, d) {
			d3.select(this)
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr("r", 12)
				.attr('stroke-width', 3)
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
				.transition()
				.ease(d3.easeCubicInOut)
				.duration(200)
				.attr("r", 8)
				.attr('stroke-width', 2)
				.style('z-index', 0);
			nodeLabel.filter(l => l === d)
				.transition()
				.ease(d3.easeQuadInOut)
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

		node.attr("cx", d => d.x)
			.attr("cy", d => d.y)
			.attr('x', d => d.x - 20)
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

// filtering for character and depth
function setFocus(ch, d) {
	if ((focusCh === ch && d === depth) || focusCh === 'none' && ch === 'none') return;
	focusCh = ch;
	depth = d;
	if (focusCh === 'none') {
		document.getElementById('depth').innerHTML = '(Not applicable)';
		updateGraph(data);
	} else {
		document.getElementById('depth').innerHTML = depth;
		// filter out this character. filter bc we need color as well
		let chNew = data.ch.filter(c => c.id === focusCh);
		// characters. loop once for each depth
		for (let z = 0; z < depth; z++) {
			// finds every character that has a link to the current list
			chNew.push(...data.ch.filter(c =>
				data.rel.some(r => chNew.some(c2 =>
					(c.id === r.source.id && c2.id === r.target.id)
					|| (c.id === r.target.id && c2.id === r.source.id))
				)
				&& !chNew.includes(c)
			));
		}
		// find rels whose source and target are both in the list
		let relNew = [];
		relNew = data.rel.filter(r =>
			chNew.some(c => c.id === r.source.id)
			&& chNew.some(c => c.id === r.target.id)
			&& !relNew.includes(r)
		);
		updateGraph({
			ch: chNew,
			rel: relNew
		});
	}
}

document.getElementById('chInput').onchange = e => setFocus(e.target.value, depth);
document.getElementById('depthInput').oninput = e => setFocus(focusCh, e.target.value);
