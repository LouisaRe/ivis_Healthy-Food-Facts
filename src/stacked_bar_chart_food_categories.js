const title = "Consumption of Major Food Categories per Person"

//size and margin of svg
const canvHeight = 800;
const canvWidth = 1200;
const margin = {top: 50, right: 20, bottom: 60, left: 60};

//size of chart area.
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;

//attach svg
const svg = d3.select("body").append("svg")
  .attr("width", canvWidth)
  .attr("height", canvHeight);

//attach #chart-area
const g = svg.append("g")
  .attr("id", "chart-area")
  .attr("transform", `translate(${margin.left},${margin.top})`);

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.25)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(['#d53e4f','#fc8d59','#fee08b','#ffffbf','#e6f598','#99d594','#3288bd','#322323','#321276','#326533']);

// Data

d3.csv("./data/lebensmittelkategorien.csv", function(d, i, columns) {
/*
  d.filter(d => String(d.Code) === "SWE")
      .filter(d => Number(d.Year) === 2013)
      .sort(function(a, b) { return b.total - a.total; });

*/

  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(3);

  x.domain(data.map(function(d) { return d.Type; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

// Balken

  var bars = g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Type); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("kilocalories per person per day");


// Legende

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});