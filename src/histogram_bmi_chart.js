import "../lib/d3/d3.js"

//*********************************************************
//BMI Calculator

function calcBMI () {
  let bmi = null,
      weight_calcBMI = parseInt(document.getElementById("bmi-weight").value),
      height_calcBMI = parseInt(document.getElementById("bmi-height").value),
      results_calcBMI = document.getElementById("bmi-results");

  // calculate BMI
    height_calcBMI = height_calcBMI / 100;
    bmi = weight_calcBMI / (height_calcBMI * height_calcBMI);
    bmi = Math.round(bmi * 100) / 100; // Round off 2 decimal places

  // show results
  if (bmi < 18.5) { results_calcBMI.innerHTML = bmi + " - Underweight"; }
  else if (bmi < 25) { results_calcBMI.innerHTML = bmi + " - Normal weight"; }
  else if (bmi < 30) { results_calcBMI.innerHTML = bmi + " - Pre-obesity"; }
  else if (bmi < 35) { results_calcBMI.innerHTML = bmi + " - Obesity class I"; }
  else if (bmi < 40) { results_calcBMI.innerHTML = bmi + " - Obesity class II"; }
  else { results_calcBMI.innerHTML = bmi + " - Obesity class III"; }

  return false; }

const BMIChart = () => {

//*************************************************
//Chart
const title_bmi = "BMI"

//size and margin of svg
  const canvHeight_bmi = 600;
  const canvWidth_bmi = 1200;
  const margin_bmi = {top: 80, right: 240, bottom: 60, left: 240};

//size of chart area.
  const width_bmi = canvWidth_bmi - margin_bmi.left - margin_bmi.right;
  const height_bmi = canvHeight_bmi - margin_bmi.top - margin_bmi.bottom;

//attach svg
  const svg1_bmi = d3.select("#diagram_bmi").append("svg")
    .attr("width", canvWidth_bmi)
    .attr("height", canvHeight_bmi);

//attach #chart-area
  const g1_bmi = svg1_bmi.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${margin_bmi.left},${margin_bmi.top})`);

//**************************************************************************
//Title and Labels

//attach #chart-title
  svg1_bmi.append("text")
    .attr("id", "chart-title")
    .attr("x", canvWidth_bmi/2)
    .attr("y", 0)
    .attr("dy", "1.5em")  // line height
    .style("text-anchor", "middle")
    .text(title_bmi);

//x axis - text label
  g1_bmi.append("text")
    .attr("class", "label-text")
    .attr("y", height_bmi + margin_bmi.bottom / 2)
    .attr("x", width_bmi / 2)
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Age");

//y axis - text label
  g1_bmi.append("text")
    .attr("class", "label-text")
    .attr("x", -20)
    .attr("y", -10)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text("Area");

//**************************************************************************
//Scales

  const colorDomain_bmi = [18.5, 25, 30, 35, 40]
  const colorScale_bmi = ["#48AF2F", "#CEDD24", "#DDA924", "#DD6724", "#DD2424"]

  var currentYear_bmi = 2016
  var currentCountries_bmi = ["World", "Germany", "Switzerland", "Madagascar", "North Korea", "Zimbabwe"]

  let updateDiagramBMI = () => d3.csv("./data/bmi.csv").then(function (data) { //load data from cleaned csv file asynchronous

    d3.select("#gDiagramBMI").remove() //if allready a diagram group exists, it will be deleted...
    const gDiagramBMI = g1_bmi.append("g").attr("id", "gDiagramBMI") //and then new one cerated

    //****************************
    //define Scales
    data = data.filter(d => currentCountries_bmi.includes(String(d.Entity)));
    const BMIDomainForAllYears = d3.extent(data, d => Number(d.BMI))

    data = data.filter(d => Number(d.Year) === currentYear_bmi);
    const countriesDomainBMI = [...new Set(data.map(d => String(d.Entity)))]

    //xScale
    const xScale_bmi = d3.scaleLinear().rangeRound([0, width_bmi])
      .domain([d3.min(BMIDomainForAllYears) - 5, d3.max(BMIDomainForAllYears) + 2]);

    //yScale
    const yScale_bmi = d3.scaleBand().rangeRound([0, height_bmi]).padding(0.2)
      .domain(countriesDomainBMI);

    //****************************
    //attach Scales
    const xAxis_bmi = d3.axisBottom(xScale_bmi);
    gDiagramBMI.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height_bmi + ")")
      .call(xAxis_bmi);

    const yAxis_bmi = d3.axisLeft(yScale_bmi);
    gDiagramBMI.append("g")  // create a group and add axis
      .attr("id", "y-axis")
      .call(yAxis_bmi);

    //****************************
    //attach data
    attachData(data, gDiagramBMI, xScale_bmi, yScale_bmi)

    //****************************
    //attach tooltip
    var tooltipWindow = d3.select("#diagram_bmi").append("div").classed("tooltipWindow", true);

    gDiagramBMI.selectAll("rect")
      .on("mousemove", (event, d) => {
        var position = d3.pointer(event, d);
        var roundedLE = roundtoDecimalPlacesBMI(d.BMI, 2);

        tooltipWindow
          .style("left", margin_bmi.left + position[0] + "px")
          .style("top", position[1] - 28 + "px")
          .style("visibility", "visible")
          .html(`<h4>${d.Entity} </h4>` +
            `BMI: <b>${roundedLE}`);
      })
      .on("mouseout", (event, d) => {
        tooltipWindow.style("visibility", "hidden");
      });
  });

  var numberOfCountries = currentCountries_bmi.length

  let attachData = (data, gDiagramBMI, xScale_bmi, yScale_bmi) => {
    if (numberOfCountries !== currentCountries_bmi.length) { // countries changed

      numberOfCountries = currentCountries_bmi.length

      return gDiagramBMI.selectAll("rect") //show data with transition
        .data(data)
        .enter().append("rect")
        .attr("id", d => "bar_" + d.Entity.toLowerCase())
        .attr("class", "bar")
        .attr("x", 1)
        .attr("y", d => yScale_bmi(d.Entity))
        .style("fill", d => BMIColor(d.BMI))
        .attr("height", yScale_bmi.bandwidth())
        .transition()
        .duration(200)
        .attr("width", d => xScale_bmi(d.BMI)-1);
    } else { // year changed
      return gDiagramBMI.selectAll("rect") //show data without transition
        .data(data)
        .enter().append("rect")
        .attr("id", d => "bar_" + d.Entity.toLowerCase())
        .attr("class", "bar")
        .attr("x", 1)
        .attr("y", d => yScale_bmi(d.Entity))
        .style("fill", d => BMIColor(d.BMI))
        .attr("height", yScale_bmi.bandwidth())
        .attr("width", d => xScale_bmi(d.BMI)-1);
    }
  }

//init
  updateDiagramBMI()

//**************************************************************************
//helper functions

  let roundtoDecimalPlacesBMI = (number, decPLaces) => {
    var decimalPlaceShifter = Math.pow(10, decPLaces)  // * (10^2)
    var interimNum = number * decimalPlaceShifter

    if (interimNum % Math.round(interimNum) < 0.5) {
      return (Math.round(interimNum) / decimalPlaceShifter);       // round off
    } else {
      return ((Math.round(interimNum) + 1) / decimalPlaceShifter); // round up
    }
  }

  let BMIColor = (number) => {
    if (number < colorDomain_bmi[0]) {
      return colorScale_bmi[0]
    } else if (number < colorDomain_bmi[1]) {
      return colorScale_bmi[1]
    } else if (number < colorDomain_bmi[2]) {
      return colorScale_bmi[2]
    } else if (number < colorDomain_bmi[3]) {
      return colorScale_bmi[3]
    } else {
      return colorScale_bmi[4]
    }
  }

//**************************************************************************
//legend

  let createLegendBMI = (colorDomain_bmi) => {
    const legend = svg1_bmi.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + (canvWidth_bmi - margin_bmi.right + 10) + "," + margin_bmi.top + ")")

    const legend_entry = legend.selectAll("rect")
      .data(colorDomain_bmi)
      .enter();

    legend_entry.append("rect")
      .attr("x", 10)
      .attr("y", (d, i) => 30 * i + 10)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", d => BMIColor(d - 1))

    legend_entry.append("text")
      .attr("class", "text")
      .attr("x", 40)
      .attr("y", (d, i) => 30 * i + 25)
      .text(d => "< " + d);

    legend.append("foreignObject")
      .attr("class", "legend-text-wrapper")
      .attr("x", 10)
      .attr("y", 30 * colorDomain_bmi.length + 10)
      .attr("width", 140)
      .attr("height", 100)
      .html("<text class=legend-text>Deaths from protein-energy malnutrition per 100'000 people.</text>")
  }

//****************************
//init legend
  createLegendBMI(colorDomain_bmi);

//**************************************************************************
//Year-Slider

  const minYear_bmi = 1975
  const maxYear_bmi = 2016

//attach #year-slider
  const g3_bmi = d3.select("#diagram_bmi").append("g")
    .attr("class", "year-slider");

//****************************
//functions

  let updateCurrentYearBMI = () => {
    g3_bmi.append("text")
      .attr("id", "year")
      .text(currentYear_bmi)
  }

  let updateYearAndDiagramBMI = () => {
    d3.select("#year").remove()
    updateCurrentYearBMI()
    updateDiagramBMI()
  }

//Show currentYear
  let setCurrentYearToNewValueBMI = () => {
    var val = document.getElementById("slider2").value;
    document.getElementById("year").innerHTML = val;
    currentYear_bmi = Number(val)
    updateYearAndDiagramBMI()
  }

//****************************
//functions

//init
  updateCurrentYearBMI()

  g3_bmi.append("input")
    .attr("id", "slider2")
    .attr("type", "range")
    .attr("min", minYear_bmi)
    .attr("max", maxYear_bmi)
    .attr("step", 1)
    .attr("value", currentYear_bmi)
    .on("input", d => setCurrentYearToNewValueBMI());


//**************************************************************************
//Entity-Chooser

//attach #entity-chooser
  const g2_bmi = d3.select("#diagram_bmi").append("g")
    .attr("id", "entity-chooser");

  d3.csv("./data/bmi.csv").then(function (data) {
    const countriesDomainBMI = [...new Set(data.map(d => String(d.Entity)))]

    //****************************
    //define checkboxes & labels
    g2_bmi.append("div")
      .attr("class", "selectionDiv").append("ul").selectAll("li")
      .data(countriesDomainBMI)
      .enter()
      .append("li")
      .append("label")
      .text(d => d + " ")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", d => "checkbox_" + d)
      .property("checked", d => currentCountries_bmi.includes(d))
      .on("click", (event, d) => funct_bmi(d));
  });

//**************************************************************************
//helper functions

  let funct_bmi = (entityString) => {
    if (!currentCountries_bmi.includes(entityString)) {
      currentCountries_bmi.push(entityString)
    } else {
      currentCountries_bmi = currentCountries_bmi.filter(d => d !== entityString);
    }
    d3.select("#gDiagramBMI").remove()
    updateDiagramBMI()
  }

}

export default BMIChart