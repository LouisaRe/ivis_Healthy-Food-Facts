
const scatterPlotSugarDiabetes = () => {

// set the dimensions and margins of the graph
var margin_scatter_plot = {top: 80, right: 240, bottom: 60, left: 240},
    width_scatter_plot = 1200 - margin_scatter_plot.left - margin_scatter_plot.right,
    height_scatter_plot = 600 - margin_scatter_plot.top - margin_scatter_plot.bottom;

// append the svg object to the body of the page
var g_scatter_plot = d3.select("#scatter_plot_sugar_diabetes")
    .append("svg")
    .attr("width", width_scatter_plot + margin_scatter_plot.left + margin_scatter_plot.right)
    .attr("height", height_scatter_plot + margin_scatter_plot.top + margin_scatter_plot.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin_scatter_plot.left + "," + margin_scatter_plot.top + ")");

// ***************************************************************
// load the data from csv
d3.csv("./data/DiabetesZuckverbrauch2017.csv", function(data) {

//data = data.filter(function(d,i) { return i<10 } )
//data = data.filter(function(d) { return d.Entity == "Switzerland" } )
var countriesDomain = data.map(d => String(d.Entity))

//************************************************
// Select Button
d3.select()

d3.select("#selectButton")
  .selectAll('myOptions')
   .data(countriesDomain)
  .enter()
   .append('option')
  .text(function (d) { return d; })
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

// *****************************************************
// update the chart
function update(selectedGroup) {
// var dataFilter = data.map(d => d.Entity == selectedGroup)
   var dataFilter =  data.filter(function(d) { return d.Entity == "Angola" } )

    path
       .data(dataFilter)
       .attr("r", 6)
       .attr("stroke", "#FF0000")
  }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

//**********************************************
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 25])
    .range([0, width_scatter_plot]);
  g_scatter_plot.append("g")
    .attr("transform", "translate(0," + height_scatter_plot + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 500])
    .range([height_scatter_plot, 0]);
  g_scatter_plot.append("g")
    .call(d3.axisLeft(y));

// text label for x and y axis
var x_title = g_scatter_plot.append("text")
    .attr("class", "label-text")
    .attr("y", height_scatter_plot + margin_scatter_plot.bottom)
    .attr("x", width_scatter_plot / 2)
    .style("text-anchor", "middle")
    .text("Diabetes in %");

var y_title = g_scatter_plot.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "label-text")
    .attr("x", 0 - height_scatter_plot/2)
    .attr("y", 0 - margin_scatter_plot.left/4)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Sugar in kcal/capita/day");

//*******************************************************
// Add dots
var tooltip = d3.select('#scatter_plot_sugar_diabetes')
     .append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

var path =  g_scatter_plot.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.Diabetes) )
      .attr("cy", d => y(d.Sugar) )
      .attr("r", 4)  // Size of dots
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("fill", "#ffffff")

      //hovering effects
      .on("mouseover", function (d, i) {
           d3.select(this).transition()
                .duration(100)
                .attr("r", 6)
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 1.5)
                .attr("fill", "#69b3a2")
          tooltip.transition()
                .duration(100)
                .style("opacity", 1);
      })
      .on("mouseout", function (d, i) {
           d3.select(this).transition()
                .duration(200)
                .attr("r", 4)
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 1.5)
                .attr("fill", "#ffffff")
           tooltip.transition()
                .duration(200)
                .style("opacity", 0);
           tooltip.html(d.Entity + "<br/> (" + d.Sugar + ", " + d.Diabetes + ")")
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
      });



})

}

