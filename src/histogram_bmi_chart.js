import "../lib/d3/d3.js"


const BMIChartAndForm = () => {

  //****************************************************************************
  //BMI Form - Calculator

  //attach #bmi-field
  const g0_bmi = d3.select("#diagram_bmi").append("div").append("g")
    .attr("id", "bmi-field");

  g0_bmi.append("text")
    .text("Weight in kg: ");

  g0_bmi.append('input')
    .attr('id', 'bmi-weight')
    .attr('class', 'inputbox')
    .attr('type','number')
    .attr('name','textInput')
    .attr('value','Weight in kg')
    .attr('min', 1)
    .attr('max', 300)

  g0_bmi.append("text")
    .text("  Height in cm: ");

  g0_bmi.append('input')
    .attr('id', 'bmi-height')
    .attr('class', 'inputbox')
    .attr('type','number')
    .attr('name','textInput')
    .attr('value','Height in cm')
    .attr('min', 20)
    .attr('max', 300);

  g0_bmi.append('input')
    .attr("class", "inputbox")
    .attr('type','submit')
    .attr('name','textInput')
    .attr('value','Calculate BMI')
    .on("click", event => calcBMI() );

  g0_bmi.append("text")
    .attr('id', 'bmi-results')

  //*********************************************************
  //BMI Calculator functions()

  let userBMI = null

  function calcBMI () {
    let bmi = null,
    weight_calcBMI = parseInt(document.getElementById("bmi-weight").value),
    height_calcBMI = parseInt(document.getElementById("bmi-height").value),
    results_calcBMI = document.getElementById("bmi-results");

    // calculate BMI
    height_calcBMI = height_calcBMI / 100;
    bmi = weight_calcBMI / (height_calcBMI * height_calcBMI);
    bmi = Math.round(bmi * 100) / 100; // Round off 2 decimal places

    userBMI = bmi
    if(userBMI != null && !isNaN(userBMI)){
      updateDiagramBMI()
    }

    // show results
    if (bmi < 18.5) { results_calcBMI.innerHTML = bmi + " - Underweight"; }
    else if (bmi < 25) { results_calcBMI.innerHTML = bmi + " - Normal weight"; }
    else if (bmi < 30) { results_calcBMI.innerHTML = bmi + " - Pre-obesity"; }
    else if (bmi < 35) { results_calcBMI.innerHTML = bmi + " - Obesity class I"; }
    else if (bmi >= 35) { results_calcBMI.innerHTML = bmi + " - Obesity class II"; }
    else { results_calcBMI.innerHTML = "Something went wrong. Please check your input. " }

    return false;
  }





//****************************************************************************
//Chart (svg)

  const title_bmi = "BMI"

//size and margin of svg
  const canvHeight_bmi = 600;
  const canvWidth_bmi = 1200;
  const margin_bmi = {top: 100, right: 240, bottom: 60, left: 240};

//size of chart area.
  const width_bmi = canvWidth_bmi - margin_bmi.left - margin_bmi.right;
  const height_bmi = canvHeight_bmi - margin_bmi.top - margin_bmi.bottom;

//attach svg
  const svg2 = d3.select("#diagram_bmi").append("svg").attr("id", "svg_bmi")
    .attr("width", canvWidth_bmi)
    .attr("height", canvHeight_bmi);

//attach #chart-area
  const g1_bmi = svg2.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${margin_bmi.left},${margin_bmi.top})`);

//**************************************************************************
//Title and Labels

//attach #chart-title
  svg2.append("text")
    .attr("id", "chart-title")
    .attr("x", canvWidth_bmi/2)
    .attr("y", 0)
    .attr("dy", "1.5em")  // line height
    .style("text-anchor", "middle")
    .text(title_bmi);

//attach png
  svg2.append("image").attr("xlink:href", "img/background_pic_bmi.svg").attr("alt", "BMI icons")
    .attr("x", margin_bmi.left).attr("y", 48).attr("width", width_bmi)

//x axis - text label
  g1_bmi.append("text")
    .attr("class", "label-text")
    .attr("y", height_bmi + margin_bmi.bottom / 2)
    .attr("x", width_bmi / 2)
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("BMI");

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
  const colorScale_bmi = ["#F1D09B", "#C6D79E", "#E6BAAE", "#D99D8C", "#CB8F7E"]

  var currentYear_bmi = 2016
  var currentCountries_bmi = ["World", "Ethiopia", "Switzerland", "Vietnam", "Saint Lucia", "American Samoa"]

  let updateDiagramBMI = () => d3.csv("./data/bmi.csv").then(function (data) { //load data from cleaned csv file asynchronous

    d3.select("#gDiagramBackground").remove() //if allready a diagram group exists, it will be deleted...
    var gDiagramBackground = g1_bmi.append("g").attr("id", "gDiagramBackground") //and then new one cerated

    d3.select("#gDiagramBMI").remove() //if allready a diagram group exists, it will be deleted...
    var gDiagramBMI = g1_bmi.append("g").attr("id", "gDiagramBMI") //and then new one cerated

    //****************************
    //add user bmi to data

    const objectUserBmi = {};
    Object.defineProperties(objectUserBmi, {
      Entity: {
        value: "Me",
        writable: true
      },
      Year: {
        value: currentYear_bmi,
        writable: true
      },
      BMI : {
        value: userBMI,
        writable: true
      }
    });

    if(objectUserBmi.BMI != null && !isNaN(userBMI)){
      currentCountries_bmi.push(objectUserBmi.Entity)
    }

    data.push(objectUserBmi)

    //****************************
    // sort data
    data.sort(function(b, a) {
      return b.BMI - a.BMI;
    });

    //****************************
    //define Scales

    data = data.filter(d => currentCountries_bmi.includes(String(d.Entity)));
    const BMIDomainForAllYears = d3.extent(data, d => Number(d.BMI))

    data = data.filter(d => Number(d.Year) === currentYear_bmi);
    const countriesDomainBMI = [...new Set(data.map(d => String(d.Entity)))]

    //xScale
    const xScale_bmi = d3.scaleLinear().rangeRound([0, width_bmi])
      .domain([d3.min(BMIDomainForAllYears) - 5, 40]);

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
    //attach background
    gDiagramBackground.append("rect").attr("x", 1).attr("y", 0).attr("width", xScale_bmi(40)).attr("height", height_bmi-1).style("fill", colorScale_bmi[4])
    gDiagramBackground.append("rect").attr("x", 1).attr("y", 0).attr("width", xScale_bmi(35)).attr("height", height_bmi-1).style("fill", colorScale_bmi[3])
    gDiagramBackground.append("rect").attr("x", 1).attr("y", 0).attr("width", xScale_bmi(30)).attr("height", height_bmi-1).style("fill", colorScale_bmi[2])
    gDiagramBackground.append("rect").attr("x", 1).attr("y", 0).attr("width", xScale_bmi(25)).attr("height", height_bmi-1).style("fill", colorScale_bmi[1])
    gDiagramBackground.append("rect").attr("x", 1).attr("y", 0).attr("width", xScale_bmi(18.5)).attr("height", height_bmi-1).style("fill", colorScale_bmi[0])

    //****************************
    //attach data & tooltip
    attachDataAndTooltip(data, gDiagramBMI, xScale_bmi, yScale_bmi)
    d3.select("#bmi_chart_bar_me").style("fill", "#737373")
  });

  var numberOfCountries = currentCountries_bmi.length

  let attachDataAndTooltip = (data, gDiagramBMI, xScale_bmi, yScale_bmi) => {
      numberOfCountries = currentCountries_bmi.length

      return gDiagramBMI.selectAll("rect") //show data with transition
        .data(data)
        .enter().append("rect")
        .attr("id", d => "bmi_chart_bar_" + d.Entity.toLowerCase())
        .attr("x", 1)
        .attr("y", d => yScale_bmi(d.Entity))
        .style("fill", "#FBF8F2")
        .attr("height", yScale_bmi.bandwidth())
        .attr("width", d => xScale_bmi(d.BMI)-1)
        .append("title")
        .text(d => `BMI: ${roundtoDecimalPlacesBMI(d.BMI, 2)}`);
  }

//init
updateDiagramBMI()

//**************************************************************************`
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
      .attr("id", "year_2")
      .attr("class", "year")
      .text(currentYear_bmi)
  }

  let updateYearAndDiagramBMI = () => {
    d3.select("#year_2").remove()
    updateCurrentYearBMI()
    updateDiagramBMI()
  }

//Show currentYear
  let setCurrentYearToNewValueBMI = () => {
    var val = document.getElementById("slider2").value;
    document.getElementById("year_2").innerHTML = val;
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

export default BMIChartAndForm
