
//Networks Graph Reference: https://observablehq.com/@d3/force-directed-graph & https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811
//Spider Chart Reference: https://d3-graph-gallery.com/spider

// ----------CONSTANTS FOR PAGE SETUP----------------
import realData from "../data/data.json" assert { type: "json" };
import data from "../data/fakeData.json" assert { type: "json" };

const nodes = data.nodes; 
const links = data.links;

const nodes2 = realData.nodes;
const links2 = realData.links;

console.log(links);
console.log(links2);

const FRAME_HEIGHT = 700;
const FRAME_WIDTH = 700;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };
const SCALE = 50;
const PADDING = 20;

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

// ----------SETTING THE FRAME FOR BOTH VISUALIZATIONS----------------

// -----------------PLOT 1-----------------

let activeNodes = nodes; //todo: set as empty
let neighborNodes = [];
let activeLinks = links;

console.log(activeLinks);
console.log(realData.links);

let NETWORKFRAME = d3.select("#vis1")
.append("svg")
.attr("height", FRAME_HEIGHT)
.attr("width", FRAME_WIDTH)
.attr("class", "frame");

let simulation = d3.forceSimulation(activeNodes)
.nodes(activeNodes)
.force('charge', d3.forceManyBody().strength(-250))
.force('centerX', d3.forceX(FRAME_WIDTH / 2))
.force('centerY', d3.forceY(FRAME_HEIGHT / 2))
.force('link', d3.forceLink(activeLinks).id(d => d.id))
.on('tick', ticked);

simulation.force('link', d3.forceLink()
.strength(link => link.strength));

let linkElements = NETWORKFRAME
.append('g')
.attr("fill", "none")
.attr('stroke-width', 2)
.selectAll('line')
.data(activeLinks)
.enter()
.append('line')
.attr('stroke', 'white');

let nodeElements = NETWORKFRAME
.append('g')
.selectAll('circle')
.data(activeNodes)
.enter()
.append('circle')
.attr('r', 10)
.on("mouseenter", node_hover_over)
.on("mousemove", node_move)
.on("mouseleave", node_hover_out)
.on("click", point_clicked)
.attr('fill', 'yellow')
.call(d3
  .drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended));
  
  let textElement = NETWORKFRAME
  .append("g")
  .selectAll("text")
  .data(activeNodes)
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
    
    textElement
    .attr("x", d => d.x - 5)
    .attr("y", d => d.y + 5);
  }
  
  let tooltip = d3.select("#vis1")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "lightgrey")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("width", "125px")
  .style("height", "72px")
  .style("text-align", "center")
  .style("font-size", "12px");
  
  document.getElementById("button").addEventListener("click", buttonClicked);
  
  function node_hover_over(event, d) {
    // add 'hover' functionality
    // on mouseover, change to green  
    d3.select(event.currentTarget)
    .style("fill", "orange");
    
    tooltip.style("opacity", 1);
  }
  
  function node_move(event, d) {
    // add 'hover' tooltop movement functionality and text to the tooltip
    tooltip.html("Category: " + d.id + "<p>Value: " + d.genre_top + "</p><p>Listens: " + d.listens + "</p>");
    
    // moves the tooltip with the mouse
    tooltip.style("transform", "translate(" + d3.pointer(event)[0] + "px," + (-620 + d3.pointer(event)[1]) + "px)");
  }
  
  function node_hover_out(event, d) {
    // on mouseleave, change back to the original color 
    d3.select(event.currentTarget)
    .style("fill", "red");
    
    // hides the tooltip
    tooltip.style("opacity", 0);
  }
  
  
  
  const svg = d3.select("#vis2")
  .append("svg")
  .attr("width", 650)
  .attr("height", 650);
  
  const node = findInformationWithSong("Food")
  draw(node, svg); //todo: this can be removed when we integrate linking
  addNode(node);
  
  function buttonClicked() {
    const songTitle = document.getElementById('information').value; // gets the information from the textbox
    document.getElementById('information').value = ""; // sets textbox to "" 
    
    if (findInformationWithSong(songTitle) != -1) {
      const node = findInformationWithSong(songTitle)
      draw(node, svg); //todo: this can be removed when we integrate linking
      addNode(node);
    } else {
      alert("Song not found :(");
    }
  }
  
  function addNode(node) {
    console.log(node);
    if (!activeNodes.reduce((prev, curr) => (curr.id == node.id) || (prev), false)) {
      console.log("made it");
      activeNodes.push(node); //adds node to graph
      document.getElementById("songTitle").innerHTML = "Song Added: " + node.title_track;
    }
    console.log(activeLinks);
    resetLinks(node);
    console.log(activeLinks);
    resetVis();
  }
  
  function addNeighbor(node) {
    addNode(node);
    neighborNodes.push(node);
    //resetSpiderVis(); todo: create this function when we do linking
  }
  
  function resetVis() {
    
    NETWORKFRAME.selectAll('circle').remove();
    NETWORKFRAME.selectAll('line').remove();
    NETWORKFRAME.selectAll('text').remove();
    
    simulation = simulation.nodes(activeNodes)
    .force('charge', d3.forceManyBody().strength(-250))
    .force('centerX', d3.forceX(FRAME_WIDTH / 2))
    .force('centerY', d3.forceY(FRAME_HEIGHT / 2))
    .on('tick', ticked)
    .restart();
    
    simulation.force("link", d3.forceLink(activeLinks).id(d => d.id));
    
    simulation.force('link', d3.forceLink()
    .strength(link => link.strength));
    
    linkElements = NETWORKFRAME
    .attr('stroke-width', 2)
    .selectAll('line')
    .data(activeLinks)
    .enter()
    .append('line')
    .attr('stroke', 'white');
    
    nodeElements = NETWORKFRAME
    .selectAll('circle')
    .data(activeNodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .on("mouseenter", node_hover_over)
    .on("mousemove", node_move)
    .on("mouseleave", node_hover_out)
    .on("click", point_clicked)
    .attr('fill', 'white')
    .call(d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));
      
      textElement = NETWORKFRAME
      .selectAll("text")
      .data(activeNodes)
      .enter()
      .append("text")
      .attr('pointer-events', 'none')
      .text(d => d.id)
      .attr("stroke", "orange")
      .attr("opacity", .8);
      
      console.log(activeLinks);
    }
    
    function findInformationWithSong(songTitle) {
      for (let i = 0; i < realData.nodes.length; i++) {
        // console.log(nodes[i].title_track)
        if(realData.nodes[i].title_track == songTitle) {
          return realData.nodes[i]
        }
      }
      return -1;
    }
    
    function point_clicked(event, d) {
      // css toggle; when point is clicked, 'yes_border' is activated
      d3.select(this).classed("yes_border", d3.select(this).classed("yes_border") ? false : true); //todo: should class everything in neighborNodes after resetVis
      
      const id = d.id;
      
      neighborNodes = [];
      const tempNodes = realData.nodes;
      const tempLinks = realData.links;
      
      for (let i = 0; i < tempLinks.length; i++) {
        if(tempLinks[i].source == id) {
          console.log("matched source");
          
          for (let j = 0; j < tempNodes.length; j++) {
            if (tempLinks[i].target == tempNodes[j].id) {
              addNeighbor(tempNodes[j]);
            }
          }
        }
      }
    }
    
    function resetLinks(node) {
      
      for (let i = 0; i < activeNodes.length; i++) {
        for (let k = 0; k < realData.links.length; k++) {
          if (realData.links[k].source == activeNodes[i].id && realData.links[k].target == node.id) {
            activeLinks.push(realData.links[k]);
          } else if (realData.links[k].target == activeNodes[i].id && realData.links[k].source == node.id) {
            activeLinks.push(realData.links[k]);
          }
        }
      }
    }
    
    // restarts visual when drag actions starts
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fy = d.y;
      d.fx = d.x;
    }
    
    //axes change as node gets dragged
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    //the targeted node is released when the drag action ends
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // -----------------PLOT 2----------------
    
    
    
    
    
    function draw(id) {
      
      svg.selectAll("*").remove();
      
      const acoustincness = id.acousticness;
      const danceability = id.danceability;
      const energy = id.energy;
      const instrumentalness = id.instrumentalness;
      const liveness = id.liveness;
      const speechiness = id.speechiness;
      const valence = id.valence;
      
      // removed tempo because it's not from 0 - 1 
      
      let features = ["Acousticness", "Danceability", "Energy", "Instrumentalness", "Liveness", "Speechiness", "Valence"];
      let information = [acoustincness, danceability, energy, instrumentalness, liveness, speechiness, valence];
      
      console.log(information)
      
      let data = [];
      
      let point = {};
      point["Acousticness"] = information[0] * 10;
      point["Danceability"] = information[1] * 10;
      point["Energy"] = information[2] * 10;
      point["Instrumentalness"] = information[3] * 10;
      point["Liveness"] = information[4] * 10;
      point["Speechiness"] = information[5] * 10;
      point["Valence"] = information[6] * 10;
      
      data.push(point);
      
      
      
      
      let radialScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, 250]);
      let ticks = [2, 4, 6, 8, 10];
      
      
      
      ticks.forEach(t =>
        svg.append("circle")
        .attr("cx", 300)
        .attr("cy", 300)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("r", radialScale(t))
        );
        
        ticks.forEach(t =>
          svg.append("text")
          .attr("x", 305)
          .attr("y", 300 - radialScale(t))
          .text((t / 10).toString())
          .attr("stroke", "white")
          .attr("stroke-width", 1.3)
          );
          
          
          function angleToCoordinate(angle, value) {
            let x = Math.cos(angle) * radialScale(value);
            let y = Math.sin(angle) * radialScale(value);
            return { "x": 300 + x, "y": 300 - y };
          }
          
          for (let i = 0; i < features.length; i++) {
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            let line_coordinate = angleToCoordinate(angle, 10);
            let label_coordinate = angleToCoordinate(angle, 10.5);
            
            //draw axis line
            svg.append("line")
            .attr("x1", 300)
            .attr("y1", 300)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke", "white");
            
            //draw axis label
            svg.append("text")
            .attr("x", label_coordinate.x)
            .attr("y", label_coordinate.y)
            .text(ft_name)
            .attr("stroke", "white")
            .attr("stroke-width", 1.3);
            
          }
          
          let line = d3.line()
          .x(d => d.x)
          .y(d => d.y);
          let colors = ["red"];
          
          
          function getPathCoordinates(data_point) {
            let coordinates = [];
            for (let i = 0; i < features.length; i++) {
              let ft_name = features[i];
              let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
              coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
            }
            return coordinates;
          }
          
          for (let i = 0; i < data.length; i++) {
            let d = data[i];
            let color = colors[i];
            let coordinates = getPathCoordinates(d);
            
            //draw the path element
            svg.append("path")
            .datum(coordinates)
            .attr("d", line)
            .attr("stroke-width", 1)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("stroke-opacity", 1)
            .attr("opacity", .6)
          }
          
        }