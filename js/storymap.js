import * as d3 from "https://cdn.skypack.dev/d3@7.8.4";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";

// ----- //
// Setup //
// ----- //

// create our builder and turn the raw data into a graph
const builder = d3dag.graphStratify();
const graph = builder(data);

// -------------- //
// Compute Layout //
// -------------- //

// set the layout functions
const nodeRadius = 20;
const nodeSize = [nodeRadius * 2, nodeRadius * 2];
// use this to render our edges
const line = d3.line().curve(d3.curveMonotoneY);
// here's the layout operator, uncomment some of the settings
const layout = d3dag
    .sugiyama()
    //.layering(d3dag.layeringLongestPath())
    //.decross(d3dag.decrossOpt())
    //.coord(d3dag.coordGreedy())
    //.coord(d3dag.coordQuad())
    .nodeSize(nodeSize)
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
                    .append("circle")
                    .attr("r", nodeRadius)
                    .attr("fill", (n) => "var(--c)");
                enter
                    .append("text")
                    .text((d) => d.data.id)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .attr("fill", "var(--text)");
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
            .attr("opacity", 0)
            .call((enter) => enter.transition(trans).attr("opacity", 1))
    );
