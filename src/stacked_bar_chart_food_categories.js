const stackedBarChartFoodCategories = () => {
const title_stacked_bar = "Dietary composition"

  d3.select("#stacked_bar_chart_food_categories").append("svg")
    .attr("id", "stacked")
    .attr("width", 1200)
    .attr("height", 600);

  const svg_food_cat = d3.select("#stacked"),
    margin_food_cat = {top: 80, right: 240, bottom: 60, left: 240},
    width_food_cat = +svg_food_cat.attr("width") - margin_food_cat.left - margin_food_cat.right,
    height_food_cat = +svg_food_cat.attr("height") - margin_food_cat.top - margin_food_cat.bottom,

    g_food_categories = svg_food_cat.append("g").attr("transform", "translate(" + margin_food_cat.left + "," + margin_food_cat.top + ")");

  function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i)
  t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
  }

  var y = d3.scaleBand()
    .rangeRound([0, height_food_cat])
    .padding(0.2)  // Padding between balken
//    .align(middle)

  var x = d3.scaleLinear()
    .rangeRound([0, width_food_cat])

  var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
        //    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  d3.csv("./data/lebensmittelkategorieneu.csv", type, function (data) {

    var keys = data.columns.slice(2);

    // chart with default selection
    var currentCountries = ["Switzerland", "Germany", "Madagascar", "North Korea", "Zimbabwe", "Italy"]
    var currentYear = 2013

    data = data.filter(d => Number(d.Year) === currentYear); // all country in 2013
    data = data.filter(d => currentCountries.includes(String(d.Entity)));
    console.log(data);

    // List of all countries
    var countriesDomain = data.map(d => String(d.Entity))

    data.sort(function(a, b) { return b.total - a.total; });

    y.domain(countriesDomain);
    x.domain([0, d3.min(data, function(d) { return d.total; })]).nice();
    colorScale.domain(keys);

    g_food_categories.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
      .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
      .data(function (d) {
        return d;
      })
      .enter().append("rect")
      .attr("y", d => y(d.data.Entity))
      .attr("x", d => x(d[0]))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth());

    g_food_categories.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height_food_cat + ")")
      .call(d3.axisBottom(x));

// y-axis
    g_food_categories.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))

//***************************************************
//title of stacked bar chart
var main_title = g_food_categories.append("text")
    .attr("id", "chart-title")
    .attr("x", width_food_cat / 2)
    .attr("y", 0 - margin_food_cat.top)
    .attr("dy", "1.5em")
    .style("text-anchor", "middle")
    .text(title_stacked_bar);

// text label for x and y axis
var x_title = g_food_categories.append("text")
    .attr("class", "label-text")
    .attr("y", height_food_cat + margin_food_cat.bottom)
    .attr("x", width_food_cat / 2)
    .style("text-anchor", "middle")
    .text("Average number of kcal per person per day");

var y_title = g_food_categories.append("text")
//    .attr("transform", "rotate(-90)")
    .attr("class", "label-text")
    .attr("x", -20)
    .attr("y", 0-10)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text("Country");

//*******************************************************************
// Legend

/*
var legend_food_categories = g_food_categories.append("g")
  .attr("text-anchor", "start")
  .selectAll("g")
  .data(keys.slice().reverse())
  .enter().append("g")
  .attr("transform", function (d, i) {
    return "translate(0," + i * 30 + ")";
  });

legend_food_categories.append("rect")
  .attr("x", width_food_cat + 40)
  .attr("width", 18)
  .attr("height", 18)
  .attr("fill", colorScale);

legend_food_categories.append("text")
  .attr("x", width_food_cat + 65)
  .attr("y", 9)
  .attr("dy", "0.35em")
  .text(function (d) {
    return d;
  });


  */


//*****************************************************************
// Year-Slider

const minYear = 1961
const maxYear = 2013

//attach #year-slider
const g_food_categories2 = d3.select("#stacked_bar_chart_food_categories")
                     .append("g")
                     .attr("id", "year-slider");

// Year-Slider fuctions
let updateCurrentYearFoodCat = () => {
g_food_categories2.append("text")
  .attr("id", "year")
  .text(currentYear)
}

let updateYearAndDiagramFoodCat = () => {
  d3.select("#year").remove()
  updateCurrentYearFoodCat()
//  updateDiagram()
}

//Show currentYear
  let setCurrentYearToNewValueFoodCat = () => {
    var val = document.getElementById("slider1").value;
    document.getElementById("year").innerHTML = val;
    currentYear = Number(val)
    updateYearAndDiagram()
    console.log(currentYear)
  }

//init
updateCurrentYearFoodCat();

g_food_categories2.append("input")
.attr("id", "slider1")
.attr("type", "range")
.attr("min", minYear)
.attr("max", maxYear)
.attr("step", 1)
.attr("value", currentYear)
.on("input", d => setCurrentYearToNewValueFoodCat());

//**************************************************************************
//Entity-Chooser

//attach #entity-chooser
  const g_food_categories3 = d3.select("#stacked_bar_chart_food_categories").append("g")
    .attr("id", "entity-chooser");

  d3.csv("./data/lebensmittelkategorieneu.csv").then(function (data) {
    const countriesDomain = [...new Set(data.map(d => String(d.Entity)))]
    console.log(countriesDomain)

    //****************************
    //define checkboxes & labels
    g_food_categories2.append("div")
      .attr("class", "selectionDiv").append("ul").selectAll("li")
      .data(countriesDomain)
      .enter()
      .append("li")
      .append("label")
      .text(d => d + " ")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", d => "checkbox_" + d)
      .property("checked", d => currentCountries.includes(d))
      .on("click", (event, d) => funct(d));
  });

});

}

