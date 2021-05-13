// https://www.d3-graph-gallery.com/graph/scatter_basic.html

const scatterPlotSugarDiabetes = () => {

const title_scatter_plot = "Is Sugar Consumption linked to Diabetes?"

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
//var hallo = data.filter(function(d) { return d.Entity == "Switzerland" } ) // Switzerland Object
//
//var hallo3 = data = data.filter(function(d) {
//        return d['Entity'] == 'Switzerland' || d['Entity'] == 'China';
//});  // Objekt von Schweiz und China
//
//var inputValue = d3.select(“#selectButton”).property("value");
//var filteredCountry = data.filter(function(d) { return  d.Entity.includes("Switzerland")});

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
    .domain([0, 600])
    .range([height_scatter_plot, 0]);
  g_scatter_plot.append("g")
    .call(d3.axisLeft(y));

// title of scatter plot
var main_title = g_scatter_plot.append("text")
    .attr("id", "chart-title")
    .attr("x", height_scatter_plot + margin_scatter_plot.top / 2)
    .attr("y", -20)
    .attr("dy", "1.5em")  // line height
    .style("text-anchor", "middle")
    .text(title_scatter_plot);

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
    .text("Sugar (kcal/capita/day)");

//*******************************************************
// Add dots
var tooltip = d3.select('#scatter_plot_sugar_diabetes')
     .append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

updateOldChart()

// *****************************************************
// update the chart
function updateChart(dataFilter) {
// update the oldchart
updateOldChart()

var selectedpath =  g_scatter_plot.append('g')
    .selectAll("dot")
    .data(dataFilter)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.Diabetes) )
      .attr("cy", d => y(d.Sugar) )
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
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
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
                .attr("r", 4)
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 1.5)
                .attr("fill", "#ffffff")
          tooltip.transition()
                .duration(100)
                .style("opacity", 1);
      })
      .on("mousemove", function (d, i) {
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
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
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

})


}

