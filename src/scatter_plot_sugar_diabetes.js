import "../lib/d3/d3.js"

// https://www.d3-graph-gallery.com/graph/scatter_basic.html
// https://www.d3-graph-gallery.com/graph/scatter_tooltip.html


const scatterPlotSugarDiabetes = () => {

const title_scatter_plot = "Relationship Sugar and Diabetes"

//***********************************************
// Button with dropdown for selecting country

const g0_sugar_diabetes = d3.select("#scatter_plot_sugar_diabetes_select").append("g")
    .attr("id", "sug-dia-field");

g0_sugar_diabetes.append("text")
    .text("Where do you live?");

g0_sugar_diabetes.append("select")
    .attr('class', 'selectButton inputbox')

//*********************************************
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
    .attr("id", "chart-title")
    .attr("y", 30)
    .attr("x", canvWidth/2)
    .attr("dy", "1.5em")
    .style("text-anchor", "middle")
    .text(title_scatter_plot);

// create parent group and add left and top margin
const g = svg.append("g")
    .attr("id", "chart-area")
    .attr("transform", "translate(" +margin.left + "," + margin.top + ")");

// text label for the x axis
g.append("text")
    .attr("class", "label-text")
    .attr("y", height + margin.bottom / 2)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Diabetes in %");

 // text label for the y axis
g.append("text")
    .attr("class", "label-text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -margin.bottom-10)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .html("Sugar in kcal/capita/day");


d3.csv("./data/DiabetesZuckverbrauch2017.csv").then(function(data) {
    const heightDomain = d3.extent(data, d => Number(d.Diabetes));
    const weightDomain = d3.extent(data, d => Number(d.Sugar));

var countriesDomain = data.map(d => String(d.Entity))

//************************************************
// Select Button
var selectButtonValue = d3.select(".selectButton")
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

var dp = data_points.append("circle")
        .attr("class", "person_data_point")
        .attr("cx", d=> xScale(d.Diabetes))
        .attr("cy", d=> yScale(d.Sugar))
        .attr("r", 8)  // Size of dots
        .attr("stroke", "darkred")
        .attr("stroke-width", 1.5)
        .attr("fill", "darkred")

  dp.transition().duration(1000).attr("r",4)

  //hovering effects
  dp.on("mousemove", function (event, d) {
     var position = d3.pointer(event, d);
     d3.select(this)
       .transition()
      .duration(100)
      .attr("r", 8)
      .attr("stroke", "darkred")
      .attr("stroke-width", 1.5)
      .attr("fill", "darkred")
   })

  dp.on("mouseout", function (event, d) {
    d3.select(this)
      .transition()
      .duration(100)
      .attr("r", 4)
      .attr("stroke", "darkred")
      .attr("stroke-width", 1.5)
      .attr("fill", "darkred")
  })

  //Tooltip:
  dp.append("title").text(d => `${d.Entity}: Sugar: ${d.Sugar}  kcal/capita/day; Diabetes: ${d.Diabetes} %`);

}


// Select Button
  d3.select(".selectButton").on("change", function(d) {
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
var cir = path.append("circle")
        .attr("class", "person_data_point")
        .attr("cx", d=> xScale(d.Diabetes))
        .attr("cy", d=> yScale(d.Sugar))
        .attr("r", 4)  // Size of dots
        .attr("stroke", "#9ACCD3")
        .attr("stroke-width", 1.5)
        .attr("fill", "#9ACCD3")

        //Tooltip:
        cir.append("title")
          .text(d => `${d.Entity}: Sugar: ${d.Sugar}  kcal/capita/day; Diabetes: ${d.Diabetes} %`);

        //hovering effects
       cir.on("mousemove", function (event, d) {
         var position = d3.pointer(event, d);
        d3.select(this).transition()
           .duration(100)
           .attr("r", 6)
       })
       cir.on("mouseout", function (event, d) {
       d3.select(this).transition()
          .duration(100)
          .attr("r", 4)
       })
}

});

}

export default scatterPlotSugarDiabetes
