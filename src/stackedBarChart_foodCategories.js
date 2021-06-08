import "../lib/d3/d3.js"

const foodCategories = async () => {
  const title = "Average Dietary Composition per person/day"

  //size and margin of svg
  const canvHeight = 600;
  const canvWidth = 1200;
  const margin = {top: 80, right: 240, bottom: 60, left: 240};

  //size of chart area.
  const width = canvWidth - margin.left - margin.right;
  const height = canvHeight - margin.top - margin.bottom;
  // let height = data.length * 25 + margin.top + margin.bottom

  //attach svg
  const svg4 = d3.select("#stackedBarChart_foodCategories").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight);

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
  const colorScale = ["#FDC68E", "#FFFF99", "#A2DE66", "#83C983", "#B3E5E9",
                      "#49D0D9", "#B675EE", "#E2C3FC", "#F3A2A2", "#E36A6A"]

  var currentYear = 2013
  var currentCountries = ["World", "Germany", "Switzerland", "Madagascar", "North Korea", "Zimbabwe"]

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

  let attachDataAndTooltip = (data, series, gDiagram_4, xScale, yScale, color, formatValue) => {
      return gDiagram_4.append("g").attr("class", "allData") //show data without transition
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", (d, i) => yScale(d.data.Entity))
        .attr("width", d => xScale(d[1]) - xScale(d[0]))
        .attr("height", yScale.bandwidth())
        .append("title")
        .text(d => `${d.key}: ${formatValue(d.data[d.key])} kcal (` + d3.format(".0%")(1 / Number(d.data.Total) * (d.data[d.key])) + ")"); //Tooltip text
  }


//**************************************************************************
//Year-Slider

  const minYear = 1961
  const maxYear = 2013

//attach #year-slider
  const sliderGroup = d3.select("#stackedBarChart_foodCategories").append("g")
    .attr("class", "year-slider");

//****************************
//functions

  let updateCurrentYear = () => {
    sliderGroup.append("text")
      .attr("id", "year_4")
      .attr("class", "year")
      .text(currentYear)
  }

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
    console.log(currentYear)
  }

//****************************
//functions

//init
  updateCurrentYear()

  sliderGroup.append("input")
    .attr("id", "slider4")
    .attr("type", "range")
    .attr("min", minYear)
    .attr("max", maxYear)
    .attr("step", 1)
    .attr("value", currentYear)
    .on("input", d => setCurrentYearToNewValue());



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
