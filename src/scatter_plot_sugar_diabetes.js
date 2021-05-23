import "../lib/d3/d3.js"

// https://www.d3-graph-gallery.com/graph/scatter_basic.html
// https://www.d3-graph-gallery.com/graph/scatter_tooltip.html

const scatterPlotSugarDiabetes = () => {


const title_scatter_plot = "Is Sugar Consumption Linked to Diabetes?"

// create svg canvas
const canvHeight = 600, canvWidth = 1200;
const svg = d3.select("#scatter_plot_sugar_diabetes").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight);

// calc the width and height depending on margins.
const margin = {top: 80, right: 240, bottom: 60, left: 240};
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;

// chart title
svg.append("text")
    .attr("y", 0)
    .attr("x", margin.left)
    .attr("dy", "1.5em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "24px")
    .style("text-anchor", "left")
    .text(title_scatter_plot);

// create parent group and add left and top margin
const g = svg.append("g")
    .attr("id", "chart-area")
    .attr("transform", "translate(" +margin.left + "," + margin.top + ")");

// text label for the x axis
g.append("text")
    .attr("y", height + margin.bottom / 2)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Diabetes in %");

 // text label for the y axis
g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left/4)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Sugar (kcal/capita/day)");

// load the data from the cleaned csv file.
// note: the call is done asynchronous.
// That is why you have to load the data inside of a
// callback function.
d3.csv("./data/DiabetesZuckverbrauch2017.csv").then(function(data) {
    const heightDomain = d3.extent(data, d => Number(d.Diabetes));
    const weightDomain = d3.extent(data, d => Number(d.Sugar));

var countriesDomain = data.map(d => String(d.Entity))

//************************************************
// Select Button
var selectButtonValue = d3.select("#selectButton")
  .selectAll('myOptions')
   .data(countriesDomain)
  .enter()
   .append('option')
  .text(function (d) { return d; })
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // 1. create scales for x and y direction and for the color coding
    const xScale = d3.scaleLinear()
        .domain([0, 25])
        .rangeRound([0, width])
        .nice(5);

    const yScale = d3.scaleLinear()
        .domain([0, 600])
        .rangeRound([height, 0])
        .nice(5);

    // 2. create and append
    //    a. x-axis
    const xAxis = d3.axisBottom(xScale);
    g.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0, "+ height +")")
        .call(xAxis);

    //    b. y-axis
    const yAxis = d3.axisLeft(yScale);
    g.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    // 5. Create tooltip
var tooltip = d3.select('#scatter_plot_sugar_diabetes')
     .append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

updateOldChart();

//****************************************
// update the chart
function updateChart(dataFilter) {
//update the oldchart
updateOldChart()
// 3. add data-points (circle) // mit Animation
var data_points = g.selectAll("dot")
    .data(dataFilter)
    .enter();
data_points.append("circle")
        .attr("class", "person_data_point")
        .attr("cx", d=> xScale(d.Diabetes))
        .attr("cy", d=> yScale(d.Sugar))
        .attr("r", 4)  // Size of dots
        .attr("stroke", "#ff0000")
        .attr("stroke-width", 1.5)
        .attr("fill", "#ffffff")
   //hovering effects
    .on("mouseover", function (d, i) {
         d3.select(this).transition()
              .duration(100)
              .attr("r", 4)
              .attr("stroke", "#ff0000")
              .attr("stroke-width", 1.5)
              .attr("fill", "#ffffff")
        tooltip.transition()
              .duration(100)
              .style("opacity", 1);
    })
    .on("mousemove", function (d, i) {
     var position = d3.pointer(event, d);

         d3.select(this).transition()
              .duration(100)
              .attr("r", 6)
              .attr("stroke", "#ff0000")
              .attr("stroke-width", 1.5)
              .attr("fill", "#ff0000")
         tooltip.transition()
              .duration(100)
              .style("opacity", 1);
         tooltip.html("<b>"+d.Entity+"</b>"+"<br/>Sugar: "+d.Sugar+" kcal/capita/day<br/>Diabetes: "+d.Diabetes+"%")
              .style("left", margin.left + position[0] + "px")
              .style("top", position[1] - 28 + "px");
    })
  .on("mouseout", function (d, i) {
         d3.select(this).transition()
              .duration(100)
              .attr("r", 4)
              .attr("stroke", "#ff0000")
              .attr("stroke-width", 1.5)
              .attr("fill", "#ffffff")
       tooltip.transition()
            .duration(200)
            .style("opacity", 0);
  });

}
// Select Button
  d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      console.log(selectedOption)

      let dataFilter = data.filter(function (d) {
          return d.Entity === selectedOption;
      })
      console.log(dataFilter)
      updateChart(dataFilter);
  })


function updateOldChart() {
var path = g.selectAll("dot")
    .data(data)
    .enter();
path.append("circle")
        .attr("class", "person_data_point")
        .attr("cx", d=> xScale(d.Diabetes))
        .attr("cy", d=> yScale(d.Sugar))
        .attr("r", 4)  // Size of dots
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("fill", "#ffffff")
   //hovering effects
    .on("mouseover", function (d, i) {
         d3.select(this).transition()
              .duration(100)
              .attr("r", 4)
              .attr("stroke", "#69b3a2")
              .attr("stroke-width", 1.5)
              .attr("fill", "#ffffff")
        tooltip.transition()
              .duration(100)
              .style("opacity", 1);
    })
    .on("mousemove", function (d, i) {
     var position = d3.pointer(event, d);

         d3.select(this).transition()
              .duration(100)
              .attr("r", 6)
              .attr("stroke", "#69b3a2")
              .attr("stroke-width", 1.5)
              .attr("fill", "#69b3a2")
         tooltip.transition()
              .duration(100)
              .style("opacity", 1);
         tooltip.html("<b>"+d.Entity+"</b>"+"<br/>Sugar: "+d.Sugar+" kcal/capita/day<br/>Diabetes: "+d.Diabetes+"%")
              .style("left", margin.left + position[0] + "px")
              .style("top", position[1] - 28 + "px");
    })
  .on("mouseout", function (d, i) {
         d3.select(this).transition()
              .duration(100)
              .attr("r", 4)
              .attr("stroke", "#69b3a2")
              .attr("stroke-width", 1.5)
              .attr("fill", "#ffffff")
       tooltip.transition()
            .duration(200)
            .style("opacity", 0);
  });
}

});

}

export default scatterPlotSugarDiabetes
