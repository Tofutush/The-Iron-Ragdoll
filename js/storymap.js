// ----- //
// Setup //
// ----- //

// create our builder and turn the raw data into a graph
const builder = d3.graphStratify();
const graph = builder(data);

// -------------- //
// Compute Layout //
// -------------- //

// set the layout functions
const nodeRadius = 20;
// use this to render our edges
const line = d3.line().curve(d3.curveMonotoneY);
// here's the layout operator, uncomment some of the settings
const layout = d3
    .sugiyama()
    //.layering(d3dag.layeringLongestPath())
    //.decross(d3dag.decrossOpt())
    //.coord(d3dag.coordGreedy())
    //.coord(d3dag.coordQuad())
    .nodeSize([nodeRadius * 2, nodeRadius * 2])
    .gap([nodeRadius, nodeRadius])

// actually perform the layout and get the final size
const { width, height } = layout(graph);

// --------- //
// Rendering //
// --------- //

// global
const svg = d3
    .select("#svg")
    // pad a little for link thickness
    .style("width", width + 4)
    .style("height", height + 4);
const trans = svg.transition().duration(750);

// nodes
svg
    .select("#nodes")
    .selectAll("g")
    .data(graph.nodes())
    .join((enter) =>
        enter
            .append("g")
            .attr("transform", ({ x, y }) => `translate(${x}, ${y})`)
            .attr("opacity", 0)
            .call((enter) => {
                enter
                    .append("a")
                    .attr("href", n => n.data.url.replace("/stories/", "../"))
                    .append("title").text(n => n.data.id);
                enter
                    .selectAll("a")
                    .append("circle")
                    .attr("r", nodeRadius)
                    .attr("fill", "var(--c)");
                enter.transition(trans).attr("opacity", 1);
            })
    );

// link paths
svg
    .select("#links")
    .selectAll("path")
    .data(graph.links())
    .join((enter) =>
        enter
            .append("path")
            .attr("d", ({ points }) => line(points))
            .attr("stroke-width", 3)
            .attr("stroke", "var(--c)")
            .attr("fill", "none")
            .attr("opacity", 0)
            .call((enter) => enter.transition(trans).attr("opacity", 1))
    );

function wrap(text, width) {
    text.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.5; // em
        const y = text.attr("y") || 0;
        const dy = 0;

        let tspan = text.text(null)
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", dy + "em");

        let word;
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}
