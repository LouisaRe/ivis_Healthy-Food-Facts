//svg size and margin.
const canvHeight = 300;
const canvWidth = 400;
const margin = {top: 50, right: 20, bottom: 30, left: 60};

//size actual chart area.
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;

const svg = d3.select("body").append("svg")
  .attr("width", canvWidth)
  .attr("height", canvHeight)
  .style("border", "1px solid");

