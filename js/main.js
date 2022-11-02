
//Networks Graph Reference: https://observablehq.com/@d3/force-directed-graph & https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811
//Spider Chart Reference: https://d3-graph-gallery.com/spider

// ----------CONSTANTS FOR PAGE SETUP----------------
import data from "/data/fakeData.json" assert { type: "json" };

import realData from "/data/data.json" assert { type: "json" };

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
.attr('r', 10)
.on("mouseenter", node_hover_over)
.on("mousemove", node_move)
.on("mouseleave", node_hover_out)
.attr('fill', 'red');

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

function node_hover_over(event, d) {
  // add 'hover' functionality
  // on mouseover, change to green  
  d3.select(event.currentTarget)
  .style("fill", "green");
  
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
// -----------------PLOT 2----------------

function submitClicked() {
  const songTitle = document.getElementById('information').value; // gets the information from the textbox
  document.getElementById('information').value = ""; // sets textbox to "" 
  
  
  console.log(findInformationWithSong(songTitle))
  const id = findInformationWithSong(songTitle)

  draw(id);
 
}

function findInformationWithSong(songTitle) {
  for (let i = 0; i < realData.nodes.length; i++) {
    // console.log(realData.nodes[i].title_track)
    if(realData.nodes[i].title_track == songTitle) {
      return realData.nodes[i]
    }
  }
}

function draw(id) {
  const acoustincness = id.acousticness;
  const danceability = id.danceability;
  const energy = id.energy;
  const instrumentalness = id.instrumentalness;
  const liveness = id.liveness;
  const speechiness = id.speechiness;
  const valence = id.valence;

  // removed tempo becasue it's not from 0 - 1 

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


  const svg = d3.select("#col1")
    .append("svg")
    .attr("width", 650)
    .attr("height", 650);


  let radialScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 250]);
  let ticks = [2, 4, 6, 8, 10];




  ticks.forEach(t =>
    svg.append("circle")
      .attr("cx", 300)
      .attr("cy", 300)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("r", radialScale(t))
  );

  ticks.forEach(t =>
    svg.append("text")
      .attr("x", 305)
      .attr("y", 300 - radialScale(t))
      .text((t / 10).toString())
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
      .attr("stroke", "black");

    //draw axis label
    svg.append("text")
      .attr("x", label_coordinate.x)
      .attr("y", label_coordinate.y)
      .text(ft_name);
  }

  let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
  let colors = ["blue"];


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
      .attr("opacity", .7);
  }
}


document.getElementById("button").addEventListener("click", submitClicked);



// Food 
// Electric Ave 
// This World
