import "../lib/d3/d3.js"
import {
  getHeight,
  getWidth,
  createSliderGroup,
  updateYear,
  createSlider
} from "./diagramFunctionality.js";

const foodCategories = async () => {
  const title = "Average Dietary Composition per person/day"

  //size and margin of svg
  const canvHeight = getHeight();
  const canvWidth  = getWidth();
  const margin     = {top: 80, right: 280, bottom: 60, left: 200};

  //size of chart area.
  const width  = canvWidth - margin.left - margin.right;
  const height = canvHeight - margin.top - margin.bottom;

  //attach svg
  const svg4 = d3.select("#stackedBarChart_foodCategories").append("svg")
    .attr("id", "svg4")
    //.attr("preserveAspectRatio", "xMinYMin meet")
    //.attr("viewBox", "0 0 1200 600")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .attr("style", "background: transparent; border-radius: 8px; outline: 1px solid transparent;");

  //attach #chart-area
  const chartAreaGroup = svg4.append("g")
    .attr("id", "chart-area_4")
    .attr("transform", `translate(${margin.left},${margin.top})`);


  //**************************************************************************
  //Title and Labels

  //attach #chart-title
  svg4.append("text")
    .attr("id", "chart-title")
    .attr("x", canvWidth / 2)
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
    .text("KCAL");

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
  const colorDomain = ["Cereals & Grains", "Fruit & Vegetables", "Starchy Roots", "Pulses", "Dairy & Eggs", "Meat", "Oils & Fats", "Sugar", "Alcoholic Beverages", "Other"]
  const colorScale = ["#FDC68E", "#FFFF99", "#A2DE66", "#83C983", "#B3E5E9",
                      "#49D0D9", "#B675EE", "#E2C3FC", "#F3A2A2", "#E36A6A"]

  var currentYear = 2013
  var currentCountries = ["Bangladesh", "Egypt", "Ethiopia", "Samoa", "Switzerland", "United States"]

  var maxKCalOfAllYears = 0 //for a constant x-axis

  let updateDiagram = async () => {

    let data = await d3.csv("./data/FoodCategories.csv", (d, i, columns) => {
      if(currentCountries.includes(String(d.Entity))){
        if(maxKCalOfAllYears < Number(d.Total)){
          maxKCalOfAllYears = Number(d.Total)
        }
        console.log("MaxKCalOfAllYears: " + maxKCalOfAllYears)
      }
      if (Number(d.Year) === currentYear && currentCountries.includes(String(d.Entity))) {
        return (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d)
      } else {
        return null
      }
    })
    console.log("Data: " + data)

    let series = d3.stack()
      .keys(data.columns.slice(3))
      (data)
      .map(d => {
        console.log(d.key)
        return (d.forEach(v => v.key = d.key), d)
      })
    console.log("Series: " + series)

    let formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("de")

    //****************************
    //define Scales

    const color = d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(colorScale, [series.length])
      .unknown("#ccc")

    //xScale
    const xScale = d3.scaleLinear().rangeRound([0,width])
      .domain([0, maxKCalOfAllYears])

    //yScale
    const yScale = d3.scaleBand().rangeRound([0,height]).padding(0.08)
      .domain(data.map(d => d.Entity))

    //****************************
    //delete and create new

    d3.select("#gDiagram_4").remove() //if allready a diagram group exists, it will be deleted...
    const gDiagram_4 = chartAreaGroup.append("g").attr("id", "gDiagram_4") //and then new one cerated

    //****************************
    //attach Scales

    const xAxis = d3.axisBottom(xScale).ticks(width / 100, "s");
    gDiagram_4.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(-1,${height})`)
      .call(xAxis)

    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
    gDiagram_4.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(-1,0)`)
      .call(yAxis);

    //****************************
    //attach data
    attachDataAndTooltip(data, series, gDiagram_4, xScale, yScale, color, formatValue)

    //Show Text if there is no data for the selected year
    gDiagram_4.select(".allData")
      .selectAll("text")
      .data(data.filter(d => Number(d.Total) === 0))
      .join("text")
      .text("No data available for this year.")
      .attr("x", 4)
      .attr("y", (d, i) => Number(yScale(d.Entity)) + yScale.bandwidth()/2 +4)
  }

  //init
  updateDiagram()

  var numberOfCountries = currentCountries.length

  let attachDataAndTooltip = (data, series, gDiagram_4, xScale, yScale, color, formatValue) => {
      var rectangles =  gDiagram_4.append("g").attr("class", "allData") //show data without transition
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", (d, i) => yScale(d.data.Entity))
        .attr("height", yScale.bandwidth());

    rectangles
      .append("title")
      .text(d => `${d.key}: ${formatValue(d.data[d.key])} kcal (` + d3.format(".0%")(1 / Number(d.data.Total) * (d.data[d.key])) + "); " +
        "Total: " + formatValue(Number(d.data.Total)) + " kcal"); //Tooltip text

    if(numberOfCountries !== currentCountries.length){ // countries changed
      numberOfCountries = currentCountries.length

      rectangles
        .transition()
        .duration(200)
        .attr("width", d => xScale(d[1]) - xScale(d[0]))
    }else{ // year changed
      rectangles.attr("width", d => xScale(d[1]) - xScale(d[0]))
    }
  }


  //**************************************************************************
//legend

  let createLegend = (colorDomain) => {
    const legend = svg4.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + (canvWidth - margin.right + 10) + "," + margin.top + ")")

    const legend_entry = legend.selectAll("rect")
      .data(colorDomain.reverse())
      .enter();

    colorScale.reverse()

    legend_entry.append("rect")
      .attr("x", 10)
      .attr("y", (d, i) => 30 * i + 10)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", d => colorScale[colorDomain.indexOf(d)]);

    colorScale.reverse()

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
  }

//****************************
//init legend
  createLegend(colorDomain);

//**************************************************************************
//Year-Slider

  const minYear = 1961
  const maxYear = 2013

//attach #year-slider
  const sliderGroup = createSliderGroup("stackedBarChart_foodCategories");

//****************************
//functions

  let updateCurrentYear = () => updateYear(currentYear, sliderGroup, "year_4", "stackedBarChart_foodCategories");

  let updateYearAndDiagram = () => {
    d3.select("#year_4").remove()
    updateCurrentYear()
    updateDiagram()
  }

//Show currentYear
  let setCurrentYearToNewValue = () => {
    var val = document.getElementById("slider4").value;
    document.getElementById("year_4").innerHTML = val;
    currentYear = Number(val)
    updateYearAndDiagram()
  }

//****************************
//functions

//init
  updateCurrentYear()
  createSlider(sliderGroup, minYear, maxYear, currentYear, "slider4", "stackedBarChart_foodCategories").on("input", d => setCurrentYearToNewValue());


//**************************************************************************
//Entity-Chooser

//attach #entity-chooser
  const entityChooserGroup = d3.select("#stackedBarChart_foodCategories").append("g")
    .attr("id", "entity-chooser");

  d3.csv("./data/FoodCategories.csv").then(function (data) {
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
    d3.select("#gDiagram_4").remove()
    updateDiagram()
  }
}

export default foodCategories
