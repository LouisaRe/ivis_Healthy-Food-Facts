const title = "Life expectancy vs. Nutrition"

//size and margin of svg
const canvHeight = 800;
const canvWidth = 1200;
const margin = {top: 50, right: 20, bottom: 60, left: 60};

//size of chart area.
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;

//attach svg
const svg = d3.select("body").append("svg")
  .attr("width", canvWidth)
  .attr("height", canvHeight);

//attach #chart-area
const g = svg.append("g")
  .attr("id", "chart-area")
  .attr("transform", `translate(${margin.left},${margin.top})`);

//**************************************************************************
//Title and Labels

//attach #chart-title
svg.append("text")
  .attr("id", "chart-title")
  .attr("x", margin.left)
  .attr("y", 0)
  .attr("dy", "1.5em")  // line height
  .text(title);

//x axis - text label
g.append("text")
  .attr("class", "label-text")
  .attr("y", height + margin.bottom / 2)
  .attr("x", width / 2)
  .attr("dy", "1em")
  .attr("font-family", "sans-serif")
  .style("text-anchor", "middle")
  .text("Area");

//y axis - text label
g.append("text")
  .attr("class", "label-text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Age");

//**************************************************************************
//Scales

//load data from cleaned csv file asynchronous
d3.csv("./data/lebenserwartung_ernaehrung.csv").then(function (data){
  //****************************
  //define Scales

  data = data.filter(d => String(d.Code) === "").filter(d => Number(d.Year) === 2019)
  const countriesDomain = [... new Set(data.map(d => String(d.Entity)))]
  const lifeExpactencyDomain = d3.extent(data, d => Number(d.LifeExpectancy))

  //xScale
  const xScale = d3.scaleBand().rangeRound([0,width]).padding(0.2)
    .domain(countriesDomain);

  //yScale
  const yScale = d3.scaleLinear().rangeRound([height,0])
    .domain([d3.min(lifeExpactencyDomain)-5,d3.max(lifeExpactencyDomain)+2]);

  //colorScale
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  //****************************
  //attach Scales

  console.log("g", g)
  const xAxis = d3.axisBottom(xScale);
  g.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  g.append("g")  // create a group and add axis
    .attr("id", "y-axis")
    .call(yAxis);

  //****************************
  //attach Data
  console.log("yScale(d.LifeExpactency): " + data[0].LifeExpectancy)
  g.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("id", d => "bar_" + d.Entity.toLowerCase())
    .attr("class", "bar")
    .attr("x", d => xScale(d.Entity))
    .attr("y", d => (yScale(d.LifeExpectancy)))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height-(yScale(d.LifeExpectancy)));

  //****************************
  //attach tooltip
  var tooltipWindow = d3.select("#histogram_lebenserwartung_ernaehrung").append("div").classed("tooltipWindow", true);
  g.selectAll("rect")
    .on("mousemove", (event, d) => {
    var position = d3.pointer(event, d);
    var roundedLE = roundtoDecimalPlaces(d.LifeExpectancy, 2);
    tooltipWindow
      .style("left", margin.left + position[0] + "px")
      .style("top", position[1] - 28 + "px")
      .style("visibility", "visible")
      .html(`<h4>${d.Entity} </h4>` +
        `Life Expectancy: <b>${roundedLE}</b>`);
    })
    .on("mouseout", (event, d) => {
      tooltipWindow.style("visibility", "hidden");
    });
});

//****************************
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
