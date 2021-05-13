const stackedBarChartFoodCategories = () => {
const title_stacked_bar = "Dietary composition"

//size of svg
d3.select("#stacked_bar_chart_food_categories").append("svg")
    .attr("id", "stacked")
    .attr("width", 1200)
    .attr("height", 600);

// size of chart area and margin
    const svg_food_cat = d3.select("#stacked"),
    margin_food_cat = {top: 80, right: 240, bottom: 60, left: 160},
    width_food_cat = +svg_food_cat.attr("width") - margin_food_cat.left - margin_food_cat.right,
    height_food_cat = +svg_food_cat.attr("height") - margin_food_cat.top - margin_food_cat.bottom,

//attach chart area
g_food_categories = svg_food_cat.append("g")
    .attr("transform", "translate(" + margin_food_cat.left + "," + margin_food_cat.top + ")");

//y axis - paddings of balken
  var y = d3.scaleBand()
    .rangeRound([0, height_food_cat])
    .padding(0.2)

//x axis
  var x = d3.scaleLinear()
    .rangeRound([0, width_food_cat])

//color of categories
  var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
        //    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  //stacked bars
    function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i)
    t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
    }


    // chart with default selection
    var currentCountriesFoodCat = ["Switzerland", "Germany", "Madagascar", "North Korea", "Zimbabwe", "Italy"]
    var currentYearFoodCat = 2010

let updateDiagramFoodCat = () =>  d3.csv("./data/lebensmittelkategorieneu.csv", type, function (error, data) {
    if (error) throw error;

    var keys = data.columns.slice(2);

    data = data.filter(d => Number(d.Year) === currentYearFoodCat); // all country in 2013
    data = data.filter(d => currentCountriesFoodCat.includes(String(d.Entity)));
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
      .attr("height", y.bandwidth())
      // hover effect
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 5;
          var yPosition = d3.mouse(this)[1] - 5;
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          tooltip.select("text").text(d[1]-d[0]);
    });


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


});

//*****************************************************************
// Year-Slider

const minYear = 1961
const maxYear = 2013

//attach #year-slider
const g_food_categories2 = d3.select("#stacked_bar_chart_food_categories")
                     .append("g")
                     .attr("transform", "translate(" + margin_food_cat.left + "," + margin_food_cat.top + ")");
//                     .attr("id", "year-slider");

// Year-Slider fuctions
let updateCurrentYearFoodCat = () => {
    g_food_categories2.append("text")
      .attr("id", "yearFoodCat")
      .text(currentYearFoodCat)
}

let updateYearAndDiagramFoodCat = () => {
      d3.select("#yearFoodCat").remove()
      updateCurrentYearFoodCat()
      updateDiagramFoodCat()
}

//Show currentYear
let setCurrentYearToNewValueFoodCat = () => {
    var valFoodCat = document.getElementById("sliderFoodCat").value;
    document.getElementById("year").innerHTML = valFoodCat;
    currentYearFoodCat = Number(valFoodCat)
    updateYearAndDiagramFoodCat()
    console.log(currentYearFoodCat)
}

//init
updateDiagramFoodCat();

g_food_categories2.append("input")
.attr("id", "sliderFoodCat")
.attr("type", "range")
.attr("min", minYear)
.attr("max", maxYear)
.attr("step", 1)
.attr("value", currentYearFoodCat)
.on("input", d => setCurrentYearToNewValueFoodCat());

//**************************************************************************
//Entity-Chooser

//attach #entity-chooser
  const g_food_categories3 = d3.select("#stacked_bar_chart_food_categories").append("g")
    .attr("id", "entity-chooser");

  d3.csv("./data/lebensmittelkategorieneu.csv", function (data) {
    const countriesDomain = [...new Set(data.map(d => String(d.Entity)))]
    console.log(countriesDomain)

    //****************************
    //define checkboxes & labels
    g_food_categories3.append("div")
      .attr("class", "selectionDiv").append("ul").selectAll("li")
      .data(countriesDomain)
      .enter()
      .append("li")
      .append("label")
      .text(d => d + " ")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", d => "checkbox_" + d)
      .property("checked", d => currentCountriesFoodCat.includes(d))
      .on("click", (event, d) => funct(d));
  });

//******************************************************
// Prep the tooltip bits, initial display is hidden
var tooltip = g_food_categories.append("g")
  .attr("class", "tooltip")

tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 1);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

}