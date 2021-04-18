//attach #chart-area
const g2 = d3.select("body").append("g")
  .attr("id", "dropdown");

d3.csv("./data/LifeExpectancy-Malnutrition.csv").then(function (data){
  console.log(data)

  //****************************
  //define Scales
  var currentYear = 2016
  const countriesDomain = [... new Set(data.map(d=> String(d.Entity)))]

  g2.append("div")
    .attr("class", "selectionDiv").append("ul").selectAll("li")
    .data(countriesDomain)
    .enter()
    .append("li")
    .append("label")
    .text(d => d + " ")
    .append("input")
    .attr("type", "checkbox")
    .attr("onclick", "funct()");

});

let funct = () => {

}
