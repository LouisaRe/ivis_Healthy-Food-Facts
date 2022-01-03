import "../lib/d3/d3.js"
import {
  getHeight,
  getWidth,
  createSliderGroup,
  updateYear,
  createSlider
} from "./diagramFunctionality.js";

const lifeExpectancyMalNutrition = () => {
  const title = "Life expectancy vs. Malnutrition"

//size and margin of svg
  const canvHeight = getHeight();
  const canvWidth  = getWidth();
  const margin     = {top: 80, right: 240, bottom: 60, left: 240};

//size of chart area.
  const width  = canvWidth - margin.left - margin.right;
  const height = canvHeight - margin.top - margin.bottom;

//attach svg
  const svg1 = d3.select("#histogram_lifeExpectancy-malNutrition").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .attr("style", "background: transparent; border-radius: 8px; outline: 1px solid transparent;");

//attach #chart-area
  const chartAreaGroup = svg1.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//**************************************************************************
//Title and Labels

//attach #chart-title
  svg1.append("text")
    .attr("id", "chart-title")
    .attr("x", canvWidth/2)
    .attr("y", 0)
    .attr("dy", "1.5em")  // line height
    .style("text-anchor", "middle")
    .text(title);

//x axis - text label
  chartAreaGroup.append("text")
    .attr("class", "label-text")
    .attr("y", height + margin.bottom / 2)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Age");

//y axis - text label
  chartAreaGroup.append("text")
    .attr("class", "label-text")
    .attr("x", -20)
    .attr("y", -10)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text("Area");

//**************************************************************************
//Scales

  const colorDomain = [1, 10, 100, 1000]
  const colorScale = ["#CBDDDF", "#96BABF", "#6298A0", "#2E7681"]
  //colorScale
  const linearColorScale = d3.scaleLinear().domain(colorDomain).range(colorScale);

  var currentYear = 2017
  var currentCountries = ["Bangladesh", "Egypt", "Ethiopia", "Samoa", "Switzerland", "United States", "World"]

  let updateDiagram = () => d3.csv("./data/LifeExpectancy-Malnutrition.csv").then(function (data) { //load data from cleaned csv file asynchronous

    // sort data
    data.sort(function(b, a) {
      return b.DeathsFromMalnutrition - a.DeathsFromMalnutrition;
    });

    d3.select("#gDiagram").remove() //if allready a diagram group exists, it will be deleted...
    const gDiagram = chartAreaGroup.append("g").attr("id", "gDiagram") //and then new one cerated

    //****************************
    //define Scales
    data = data.filter(d => currentCountries.includes(String(d.Entity)));
    const lifeExpactencyDomainForAllYears = d3.extent(data, d => Number(d.LifeExpectancy))

    data = data.filter(d => Number(d.Year) === currentYear);
    const countriesDomain = [...new Set(data.map(d => String(d.Entity)))]

    //xScale
    const xScale = d3.scaleLinear().rangeRound([0, width])
      .domain([d3.min(lifeExpactencyDomainForAllYears) - 5, d3.max(lifeExpactencyDomainForAllYears) + 2]);

    //yScale
    const yScale = d3.scaleBand().rangeRound([0, height]).padding(0.2)
      .domain(countriesDomain);

    //****************************
    //attach Scales

    console.log("g", gDiagram)

    const xAxis = d3.axisBottom(xScale);
    gDiagram.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    gDiagram.append("g")  // create a group and add axis
      .attr("class", "y-axis")
      .call(yAxis);

    //****************************
    //attach data & tooltip
    attachDataAndTooltip(data, gDiagram, xScale, yScale)


  });

  var numberOfCountries = currentCountries.length

  let attachDataAndTooltip = (data, gDiagram, xScale, yScale) => {

    var rectangles = gDiagram.selectAll("rect") //show data with transition
      .data(data)
      .enter().append("rect")
      .attr("id", d => "bar_" + d.Entity.toLowerCase())
      .attr("class", "bar")
      .attr("x", 1)
      .attr("y", d => yScale(d.Entity))
      .style("fill", d => linearColorScale(d.DeathsFromMalnutrition))
      .attr("height", yScale.bandwidth());

    rectangles.append("title")
      .text(d => `Deaths from mal-nutrition: ${roundtoDecimalPlaces(d.DeathsFromMalnutrition, 2)}`); //Tooltip text

    if(numberOfCountries !== currentCountries.length) { // countries changed
      numberOfCountries = currentCountries.length

      rectangles
        .transition()
        .duration(200)
        .attr("width", d => xScale(d.LifeExpectancy)-1);
    }else { // year changed
      rectangles
        .attr("width", d => xScale(d.LifeExpectancy)-1);
    }
  }

//init
  updateDiagram()

//**************************************************************************
//helper functions

  let roundtoDecimalPlaces = (number, decPLaces) => {
    var decimalPlaceShifter = Math.pow(10, decPLaces)  // * (10^2)
    var interimNum = number * decimalPlaceShifter

    if (interimNum % Math.round(interimNum) < 0.5) {
      return (Math.round(interimNum) / decimalPlaceShifter);       // round off
    } else {
      return ((Math.round(interimNum) + 1) / decimalPlaceShifter); // round up
    }
  }

//**************************************************************************
//legend

  let createLegend = (colorDomain) => {
    const legend = svg1.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + (canvWidth - margin.right + 10) + "," + margin.top + ")")

    const legend_entry = legend.selectAll("rect")
      .data(colorDomain)
      .enter();

    legend_entry.append("rect")
      .attr("x", 10)
      .attr("y", (d, i) => 30 * i + 10)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", d => linearColorScale(d-1));

    legend_entry.append("text")
      .attr("class", "text")
      .attr("x", 40)
      .attr("y", (d, i) => 30 * i + 25)
      .text(d => d);

    legend.append("foreignObject")
      .attr("class", "legend-text-wrapper")
      .attr("x", 10)
      .attr("y", 30 * colorDomain.length + 10)
      .attr("width", 140)
      .attr("height", 100)
      .html("<text class=legend-text>Deaths from protein-energy malnutrition per 100'000 people.</text>")
  }

//****************************
//init legend
  createLegend(colorDomain);


//**************************************************************************
//Year-Slider

  const minYear = 1990
  const maxYear = 2017

//attach .year-slider
  const sliderGroup = createSliderGroup("histogram_lifeExpectancy-malNutrition");

//****************************
//functions

  let updateCurrentYear = () => updateYear(currentYear, sliderGroup, "year_1", "histogram_lifeExpectancy-malNutrition");

  let updateYearAndDiagram = () => {
    d3.select("#year_1").remove()
    updateCurrentYear()
    updateDiagram()
  }

//Show currentYear
  let setCurrentYearToNewValue = () => {
    var val = document.getElementById("slider1").value;
    document.getElementById("year_1").innerHTML = val;
    currentYear = Number(val)
    updateYearAndDiagram()
    console.log(currentYear)
  }

//****************************
//functions

//init
  updateCurrentYear()
  createSlider(sliderGroup, minYear, maxYear, currentYear, "slider1",  "histogram_lifeExpectancy-malNutrition").on("input", d => setCurrentYearToNewValue());

//**************************************************************************
//Entity-Chooser

//attach #entity-chooser
  const entityChooserGroup = d3.select("#histogram_lifeExpectancy-malNutrition").append("g")
    .attr("id", "entity-chooser");

  d3.csv("./data/LifeExpectancy-Malnutrition.csv").then(function (data) {
    const countriesDomain = [...new Set(data.map(d => String(d.Entity)))]
    console.log(countriesDomain)

    //****************************
    //define checkboxes & labels
    entityChooserGroup.append("div")
      .attr("class", "selectionDiv").append("ul").selectAll("li")
      .data(countriesDomain)
      .enter()
      .append("li")
      .append("label")
      .attr("class", "container")
      .text(d => d + " ")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", d => "checkbox_" + d)
      .property("checked", d => currentCountries.includes(d))
      .on("click", (event, d) => onClick_changeCurrentCountries(d));

    d3.selectAll(".container").append("span").attr("class", "checkmark");
  });

//**************************************************************************
//helper functions

  let onClick_changeCurrentCountries = (entityString) => {
    if (!currentCountries.includes(entityString)) {
      currentCountries.push(entityString)
    } else {
      currentCountries = currentCountries.filter(d => d !== entityString);
    }
    console.log("Test " + currentCountries)
    d3.select("#gDiagram").remove()
    updateDiagram()
  }
}

export default lifeExpectancyMalNutrition
