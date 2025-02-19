const width = 800;
const height = 600;
const links = [...data.rel];
const nodes = [...data.ch];
// Create a simulation with several forces.
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-150))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

// Create the SVG container.
const svg = d3.select("#graph")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

const linkGroup = svg.append("g")
    .selectAll("g")
    .data(links)
    .join("g");

const link = linkGroup.append("line")
    .attr("stroke", "var(--box)")
    .attr("stroke-width", 2);

// link labels
const linkLabel1 = linkGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("fill", d => d.source.color)
    .attr("font-size", "12px")
    .style('user-select', 'none')
    .text(d => d.rel1);

const linkLabel2 = linkGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("fill", d => d.target.color)
    .attr("font-size", "12px")
    .style('user-select', 'none')
    .text(d => d.rel2);

// node circles
const nodeLabel = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("text-anchor", "middle")
    .attr("dy", 28)
    .text(d => d.id)
    .attr("fill", "var(--text)")
    .style('user-select', 'none');

const node = svg.append("g")
    .selectAll("a")
    .data(nodes)
    .join("a")
    .attr("xlink:href", d => `../${d.id.toLowerCase()}`)
    .attr("target", "_blank")
    .append("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 8)
    .attr('stroke', 'var(--bg)')
    .attr('stroke-width', 2)
    .attr("fill", d => d.color)
    .on("mouseover", function (e, d) {
        d3.select(this)
            .transition().duration(150)
            .attr("r", 12);
    })
    .on("mouseout", function (e, d) {
        d3.select(this)
            .transition().duration(150)
            .attr("r", 8);
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
        .attr("cy", d => d.y);

    nodeLabel.attr("x", d => d.x)
        .attr("y", d => d.y);

    linkLabel1
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2 - 8);

    linkLabel2
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2 + 8);
});

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
