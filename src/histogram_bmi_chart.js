import "../lib/d3/d3.js"
import {
  getHeight,
  getWidth,
  createSliderGroup,
  updateYear,
  createSlider,
  getSvgWidth
} from "./diagramFunctionality.js";

const BMIChartAndForm = () => {

  //****************************************************************************
  //BMI Form - Calculator

  //attach #bmi-field
  const bmi_div = d3.select("#diagram_bmi").append("div").attr("class","bmi_input_div")
    .attr("id", "bmi-field");

  bmi_div.append("g").attr("class", "bmi-attr").append("text")
    .text("Weight in kg: ")
    .append('input')
    .attr('id', 'bmi-weight')
    .attr('class', 'inputbox input_b')
    .attr('type','number')
    .attr('name','textInput')
    .attr('value','Weight in kg')
    .attr('min', 2)
    .attr('max', 300)

  bmi_div.append("g").attr("class", "bmi-attr").append("text")
    .text("  Height in cm: ")
    .append('input')
    .attr('id', 'bmi-height')
    .attr('class', 'inputbox input_b')
    .attr('type','number')
    .attr('name','textInput')
    .attr('value','Height in cm')
    .attr('min', 30)
    .attr('max', 300);

  bmi_div.append("g").attr("class", "bmi-attr").append('input')
    .attr("class", "inputbox")
    .attr("id", "button")
    .attr('type','submit')
    .attr('name','textInput')
    .attr('value','Calculate BMI')
    .on("click", event => calcBMI() );

  d3.select("#diagram_bmi").append("div").attr("class","something-wrong-div").append("text")
    .attr('id', 'bmi-results')


  //Attach group overview
  var bmi_group_svg = d3.select("#Bmi_group_image_placeholder").append("svg").attr("width", 500).attr("height", 260)
  var bmi_res = d3.select("#bmi_result")

  bmi_group_svg.append("image").attr("xlink:href", "img/BMI_groups.svg").attr("alt", "BMI groups")
    .attr("x", 0).attr("y", 0).attr("width", 500).attr("class", "bmi_groups")

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

    //delete old result
    d3.select(".bmi_groups").select("image").remove()
    d3.select("#bmi_result").select("span").remove()

    // show results3
    if (bmi < 18.5) {
      results_calcBMI.innerHTML = ""

      bmi_group_svg.append("image").attr("xlink:href", "img/BMI_group_1.svg").attr("alt", "BMI group 1")
        .attr("x", 0).attr("y", 0).attr("width", 500).attr("class", "bmi_groups")
      bmi_res.append("span").text("Your BMI is " + bmi + " - Underweight").attr("class", "food_title")
    }
    else if (bmi < 25) {
      results_calcBMI.innerHTML = ""

      bmi_group_svg.append("image").attr("xlink:href", "img/BMI_group_2.svg").attr("alt", "BMI group 2")
        .attr("x", 0).attr("y", 0).attr("width", 500).attr("class", "bmi_groups")
      bmi_res.append("span").text("Your BMI is " + bmi + " - Normal").attr("class", "food_title")
    }
    else if (bmi < 30) {
      results_calcBMI.innerHTML = ""

      bmi_group_svg.append("image").attr("xlink:href", "img/BMI_group_3.svg").attr("alt", "BMI group 3")
        .attr("x", 0).attr("y", 0).attr("width", 500).attr("class", "bmi_groups")
      bmi_res.append("span").text("Your BMI is " + bmi + " - Overweight").attr("class", "food_title")
  }
    else if (bmi < 35) {
      results_calcBMI.innerHTML = ""

      bmi_group_svg.append("image").attr("xlink:href", "img/BMI_group_4.svg").attr("alt", "BMI group 4")
        .attr("x", 0).attr("y", 0).attr("width", 500).attr("class", "bmi_groups")
      bmi_res.append("span").text("Your BMI is " + bmi + " - Obese").attr("class", "food_title")
    }
    else if (bmi >= 35) {
      results_calcBMI.innerHTML = ""

      bmi_group_svg.append("image").attr("xlink:href", "img/BMI_group_5.svg").attr("alt", "BMI group 5")
        .attr("x", 0).attr("y", 0).attr("width", 500).attr("class", "bmi_groups")
      bmi_res.append("span").text("Your BMI is " + bmi + " - Extremly Obese").attr("class", "food_title")
    }
    else {
      results_calcBMI.innerHTML = "Something went wrong. Please check your input. "

      bmi_group_svg.append("image").attr("xlink:href", "img/BMI_groups.svg").attr("alt", "BMI group 5")
        .attr("x", 0).attr("y", 0).attr("width", 500).attr("class", "bmi_groups")
      bmi_res.append("span").text("See how you rank compared to the rest of the world").attr("class", "food_title")
    }

    return false;
  }





//****************************************************************************
//Chart (svg)

  const title_bmi = "BMI"

//size and margin of svg
  const canvHeight_bmi = getHeight();
  const canvWidth_bmi = getWidth();
  const margin_bmi = {top: 100, right: 240, bottom: 60, left: 240};

//size of chart area.
  const width_bmi = canvWidth_bmi - margin_bmi.left - margin_bmi.right;
  const height_bmi = canvHeight_bmi - margin_bmi.top - margin_bmi.bottom;

//attach svg
  const svg2 = d3.select("#diagram_bmi").append("svg").attr("id", "svg_bmi")
    .attr("width", canvWidth_bmi)
    .attr("height", canvHeight_bmi)
    .attr("style", "background: transparent; border-radius: 8px; outline: 1px solid transparent;");

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
  const yValue = 48 + 90 - getSvgWidth('diagram_bmi')/1200 * 90
  svg2.append("image").attr("xlink:href", "img/background_pic_bmi.svg").attr("alt", "BMI icons")
    .attr("x", margin_bmi.left).attr("y", yValue).attr("width", width_bmi)

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
  const colorScale_bmi = ["#F1D09B", "#C6D79E", "#F2C3A3", "#EDAE8F", "#E79D89"]

  var currentYear = 2016
  var currentCountries_bmi = ["Bangladesh", "Egypt", "Ethiopia", "Samoa", "Switzerland", "United States", "World"]

  let updateDiagramBMI = () => d3.csv("./data/Bmi.csv").then(function (data) { //load data from cleaned csv file asynchronous

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
        value: currentYear,
        writable: true
      },
      BMI : {
        value: userBMI,
        writable: true
      }
    });

    if(objectUserBmi.BMI != null && !isNaN(userBMI)){
      if(!currentCountries_bmi.includes(objectUserBmi.Entity)){
        currentCountries_bmi.push(objectUserBmi.Entity)
      }
    }else{
      if(currentCountries_bmi.includes(objectUserBmi.Entity)){
        currentCountries_bmi.splice(currentCountries_bmi.indexOf(objectUserBmi.Entity),1)
      }
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

    data = data.filter(d => Number(d.Year) === currentYear);
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

    console.log(currentCountries_bmi)
  });

  var numberOfCountries = currentCountries_bmi.length

  let attachDataAndTooltip = (data, gDiagramBMI, xScale_bmi, yScale_bmi) => {

      var rectangles_bmi = gDiagramBMI.selectAll("rect") //show data with transition
        .data(data)
        .enter().append("rect")
        .attr("id", d => "bmi_chart_bar_" + d.Entity.toLowerCase())
        .attr("x", 1)
        .attr("y", d => yScale_bmi(d.Entity))
        .style("fill", "#FBF8F2")
        .attr("height", yScale_bmi.bandwidth());

      rectangles_bmi.append("title")
      .text(d => `BMI: ${roundtoDecimalPlacesBMI(d.BMI, 2)}`);

    if(numberOfCountries !== currentCountries_bmi.length) { // countries changed
      numberOfCountries = currentCountries_bmi.length

      rectangles_bmi
        .transition()
        .duration(200)
        .attr("width", d => xScale_bmi(d.BMI)-1);
    }else { // year changed
      rectangles_bmi
        .attr("width", d => xScale_bmi(d.BMI)-1);
    }
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

  const minYear = 1975
  const maxYear = 2016

//attach #year-slider
  const sliderGroup = createSliderGroup("diagram_bmi");

//****************************
//functions

  let updateCurrentYear = () => updateYear(currentYear, sliderGroup, "year_2", "diagram_bmi");

  let updateYearAndDiagramBMI = () => {
    d3.select("#year_2").remove()
    updateCurrentYear()
    updateDiagramBMI()
  }

//Show currentYear
  let setCurrentYearToNewValue = () => {
    var val = document.getElementById("slider2").value;
    document.getElementById("year_2").innerHTML = val;
    currentYear = Number(val)
    updateYearAndDiagramBMI()
  }

//****************************
//functions

//init
  updateCurrentYear()
  createSlider(sliderGroup, minYear, maxYear, currentYear, "slider2", "diagram_bmi").on("input", d => setCurrentYearToNewValue());


//**************************************************************************
//Entity-Chooser

//attach #entity-chooser
  const g2_bmi = d3.select("#diagram_bmi").append("g")
    .attr("id", "entity-chooser");

  d3.csv("./data/Bmi.csv").then(function (data) {
    const countriesDomainBMI = [...new Set(data.map(d => String(d.Entity)))]

    //****************************
    //define checkboxes & labels
    g2_bmi.append("div")
      .attr("class", "selectionDiv").append("ul").selectAll("li")
      .data(countriesDomainBMI)
      .enter()
      .append("li")
      .append("label")
      .attr("class", "container")
      .text(d => d + " ")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", d => "checkbox_" + d)
      .property("checked", d => currentCountries_bmi.includes(d))
      .on("click", (event, d) => onClick_changeCurrentCountries(d));

    d3.selectAll(".container").append("span").attr("class", "checkmark");
  });

//**************************************************************************
//helper functions

  let onClick_changeCurrentCountries = (entityString) => {
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
