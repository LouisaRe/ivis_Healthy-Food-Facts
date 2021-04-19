const title = "Life expectancy vs. Nutrition"

//size and margin of svg
const canvHeight = 600;
const canvWidth = 1200;
const margin = {top: 50, right: 160, bottom: 60, left: 60};

//size of chart area.
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;

//attach svg
const svg1 = d3.select("body").append("svg")
  .attr("width", canvWidth)
  .attr("height", canvHeight);

//attach #chart-area
const g1 = svg1.append("g")
  .attr("id", "chart-area")
  .attr("transform", `translate(${margin.left},${margin.top})`);

//**************************************************************************
//Title and Labels

//attach #chart-title
svg1.append("text")
  .attr("id", "chart-title")
  .attr("x", margin.left)
  .attr("y", 0)
  .attr("dy", "1.5em")  // line height
  .text(title);

//x axis - text label
g1.append("text")
  .attr("class", "label-text")
  .attr("y", height + margin.bottom / 2)
  .attr("x", width / 2)
  .attr("dy", "1em")
  .attr("font-family", "sans-serif")
  .style("text-anchor", "middle")
  .text("Area");

//y axis - text label
g1.append("text")
  .attr("class", "label-text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Age");

//**************************************************************************
//Scales

const colorDomain = [1, 10, 50, 100, 1000]
const colorScale = ["#48AF2F", "#CEDD24", "#DDA924" , "#DD6724" , "#DD2424"]

var currentYear = 2016
var currentCountries = ["World", "Germany", "Switzerland", "Madagascar"]

let updateDiagram = () => d3.csv("./data/LifeExpectancy-Malnutrition.csv").then(function (data){ //load data from cleaned csv file asynchronous
  console.log(data)
  const gDiagram = g1.append("g").attr("id", "gDiagram")

  //****************************
  //define Scales
  data = data.filter(d => Number(d.Year) === currentYear).filter(d => currentCountries.includes(String(d.Entity)));
  console.log(data)
  console.log("data.DeathsFromMalnutrition: " + data[0])
  const countriesDomain = [... new Set(data.map(d=> String(d.Entity)))]
  const lifeExpactencyDomain = d3.extent(data, d=> Number(d.LifeExpectancy))


  //xScale
  const xScale = d3.scaleBand().rangeRound([0,width]).padding(0.2)
    .domain(countriesDomain);

  //yScale
  const yScale = d3.scaleLinear().rangeRound([height,0])
    .domain([d3.min(lifeExpactencyDomain)-5,d3.max(lifeExpactencyDomain)+2]);

  //****************************
  //attach Scales

  console.log("g", gDiagram)
  const xAxis = d3.axisBottom(xScale);
  gDiagram.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  gDiagram.append("g")  // create a group and add axis
    .attr("id", "y-axis")
    .call(yAxis);

  //****************************
  //attach data
  console.log("yScale(d.LifeExpactency): " + data[0].LifeExpectancy)
  gDiagram.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("id", d=> "bar_" + d.Entity.toLowerCase())
    .attr("class", "bar")
    .attr("x", d=> xScale(d.Entity))
    .attr("y", d=> (yScale(d.LifeExpectancy)))
    .attr("height", d=> height-(yScale(d.LifeExpectancy)))
    .style("fill", d => malnutritionColor(d.DeathsFromMalnutrition))
    .transition()
    .duration(200)
    .attr("width", xScale.bandwidth());

  //****************************
  //attach legend
  createLegend(colorDomain);

  //****************************
  //attach tooltip
  var tooltipWindow = d3.select("#histogram_lebenserwartung_ernaehrung").append("div").classed("tooltipWindow", true);

  gDiagram.selectAll("rect")
    .on("mousemove", (event, d) => {
      var position = d3.pointer(event, d);
      var roundedLE = roundtoDecimalPlaces(d.LifeExpectancy, 2);

      tooltipWindow
        .style("left", margin.left + position[0] + "px")
        .style("top", position[1] - 28 + "px")
        .style("visibility", "visible")
        .html(`<h4>${d.Entity} </h4>` +
          `Life Expectancy: <b>${roundedLE}</b><br/>
            Deaths from mal-nutrition: <b>${roundtoDecimalPlaces(d.DeathsFromMalnutrition, 2)}</b>`);
    })
    .on("mouseout", (event, d) => {
      tooltipWindow.style("visibility", "hidden");
    });
});


//init
updateDiagram()

//**************************************************************************
//helper functions

let roundtoDecimalPlaces = (number, decPLaces) => {
  var decimalPlaceShifter = Math.pow(10, decPLaces)  // * (10^2)
  var interimNum = number * decimalPlaceShifter

  if(interimNum % Math.round(interimNum) < 0.5){
    return (Math.round(interimNum) / decimalPlaceShifter);       // round off
  }else{
    return ((Math.round(interimNum) + 1) / decimalPlaceShifter); // round up
  }
}

let malnutritionColor = (number) => {
  if(number < colorDomain[0]){
    return colorScale[0]
  }else if(number < colorDomain[1]){
    return colorScale[1]
  }else if(number < colorDomain[2]){
    return colorScale[2]
  }else if(number < colorDomain[3]){
    return colorScale[3]
  }else{
    return colorScale[4]
  }
}

let createLegend = (colorDomain) => {
  const legend = svg1.append("g")
    .attr("id", "legend")
    .attr("transform", "translate(" + (canvWidth - margin.right + 10) + "," + margin.top + ")")

  const legend_entry = legend.selectAll("rect")
    .data(colorDomain)
    .enter();

  legend_entry.append("rect")
    .attr("x", 10)
    .attr("y", (d,i) => 30 * i +10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", d => malnutritionColor(d-1))

  legend_entry.append("text")
    .attr("class", "text")
    .attr("x", 40)
    .attr("y", (d,i) => 30 * i +25)
    .text(d => "< " + d);

  legend_entry.append("foreignObject")
    .attr("class", "legend-text-wrapper")
    .attr("x", 10)
    .attr("y", 30 * colorDomain.length + 10)
    .attr("width", 140)
    .attr("height", 100)
    .html("<text class=legend-text>Deaths from protein-energy malnutrition per 100'000 people.</text>")
}








//**************************************************************************
//Entity-Chooser

//attach #entity-chooser
const g2 = d3.select("body").append("g")
  .attr("id", "entity-chooser");

d3.csv("./data/LifeExpectancy-Malnutrition.csv").then(function (data){
  const countriesDomain = [... new Set(data.map(d=> String(d.Entity)))]
  console.log(countriesDomain)

  //****************************
  //define checkboxes & labels
  g2.append("div")
    .attr("class", "selectionDiv").append("ul").selectAll("li")
    .data(countriesDomain)
    .enter()
    .append("li")
    .append("label")
    .text(d => d + " ")
    .append("input")
    .attr("type", "checkbox")
    .attr("id", d => "checkbox_" + d)
    .property("checked", d => currentCountries.includes(d) )
    .on("click", (event,d) => funct(d));
});

//**************************************************************************
//helper functions

let funct = (entityString) => {
  if(!currentCountries.includes(entityString)){
    currentCountries.push(entityString)
  }else{
    currentCountries = currentCountries.filter(d => d !== entityString);
  }
  console.log("Test " + currentCountries)
  d3.select("#gDiagram").remove()
  updateDiagram()
}









//**************************************************************************
//Year-Slider

var currentYear = 2016
