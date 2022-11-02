
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

const FRAME1 = d3.select("#vis1")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");


  const simulation = d3
                      .forceSimulation()
                        .force('charge', d3.forceManyBody().strength(-20))
                        .force('center', d3.forceCenter(FRAME_HEIGHT / 2, FRAME_WIDTH / 2))
                        .force('link', d3.forceLink()
                        .id(link => link.id));

                      
  const nodeElements = FRAME1.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', 10);

  const linkElements = FRAME1.append('g')
      .selectAll('line')
      .attr("class", "link")
      .data(links)
      .enter()
      .append('line')
        .attr('stroke-width', 2)
        .attr('stroke', '#E5E5E5')

// ---------FUNCTION TO BUILD BOTH PLOTS-------------
function build_plots() {

    // -----------------PLOT 1-----------------
    simulation.nodes(nodes).on('tick', ticked);

  simulation.force('link').links(linkElements);

  function ticked() {
    nodeElements
      .attr('cx', node => node.x)
      .attr('cy', node => node.y)
    linkElements
      .attr('x1', link => link.Source.x)
      .attr('y1', link => link.Source.y)
      .attr('x2', link => link.Target.x)
      .attr('y2', link => link.Target.y)
  }
    // -----------------PLOT 2----------------
   
};

build_plots();






