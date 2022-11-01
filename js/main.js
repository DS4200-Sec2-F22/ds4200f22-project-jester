import data from "/data/fakeData.json" assert { type: "json" };


const nodes = data.nodes; 
const links = data.links; 

// const links = data.links.map(d => Object.create(d));
// const nodes = data.nodes.map(d => Object.create(d));

console.log(nodes);
console.log(links);


const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };
const SCALE = 50;
const PADDING = 20;

// visualization size with margins in mind
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

  const FRAME1 = d3.select("#col1")
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




