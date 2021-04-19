const title = "Consumption of Major Food Categories per Person"

var width = 400;
var height = 400;
var radius = 30;

// SVG variables
var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

var g1 = svg.append("g"); // background
var g2 = svg.append("g"); // pie charts

// Load the csv file

d3.csv("./data/lebensmittelgruppen.csv")
    .then(function(data) {

      data.forEach(function(d) {
        d.population = +d.population;
      });
    })

var data = [2, 8, 8, 10];

// SVG

var svg = d3.select("svg"),
    width = svg.attr("width"),
    height = svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

// Generate the pie
var pie = d3.pie();

// Generate the arcs
var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

//Generate groups
var arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc")

//Draw arc paths
arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr("d", arc);

// attach title
svg.append("text")
  .attr("id", "chart-title")
  .attr("x", margin.left)
  .attr("y", 0)
  .attr("dy", "1.5em")  // line height
  .text(title);

// attach data


