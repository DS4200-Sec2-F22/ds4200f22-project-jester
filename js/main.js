
//Networks Graph Reference: https://observablehq.com/@d3/force-directed-graph & https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811
//Spider Chart Reference: https://d3-graph-gallery.com/spider

// ----------CONSTANTS FOR PAGE SETUP----------------
import data from "/data/fakeData.json" assert { type: "json" };

const nodes = data.nodes; 
const links = data.links; 

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };
const SCALE = 50;
const PADDING = 20;

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

// ----------SETTING THE FRAME FOR BOTH VISUALIZATIONS----------------

// -----------------PLOT 1-----------------

const FRAME1 = d3.select("#vis1")
.append("svg")
.attr("height", FRAME_HEIGHT)
.attr("width", FRAME_WIDTH)
.attr("class", "frame");


const simulation = d3
.forceSimulation(nodes)
.force('charge', d3.forceManyBody().strength(-20))
.force('center', d3.forceCenter(FRAME_HEIGHT / 2, FRAME_WIDTH / 2))
.force("link", d3.forceLink(links).id(d => d.id))
.on('tick', ticked);

simulation.force('link', d3.forceLink()
  .strength(link => link.strength));

const linkElements = FRAME1
.append('g')
.attr("class", "links")
.attr("fill", "none")
.attr('stroke-width', 2)
.selectAll('line')
.data(links)
.enter()
.append('line')
.attr('stroke', 'black');

const nodeElements = FRAME1
.append('g')
.selectAll('circle')
.data(nodes)
.enter()
.append('circle')
.attr('r', 10);

const textElements = FRAME1
.append("g")
.selectAll("text")
.data(nodes)
.enter()
.append("text")
.attr('pointer-events', 'none')
.text(d => d.id);

function ticked() {
    linkElements
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeElements.attr("cx", d => d.x).attr("cy", d => d.y);

    textElements
      .attr("x", d => d.x - 5)
      .attr("y", d => d.y + 5);
  }
// -----------------PLOT 2----------------






