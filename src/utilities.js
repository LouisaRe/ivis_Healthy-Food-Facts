import "../lib/d3/d3.js"

//**************************************************************************
//Entity-Chooser

//attach #entity-chooser
let createEntityChooser = () => {
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
      .text(d => d + " ")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", d => "checkbox_" + d)
      .property("checked", d => currentCountries.includes(d))
      .on("click", (event, d) => onClick_changeCurrentCountries(d, currentCountries));
  });
}

//**************************************************************************
//helper functions

let onClick_changeCurrentCountries = (entityString, currentCountries) => {
  if (!currentCountries.includes(entityString)) {
    currentCountries.push(entityString)
  } else {
    currentCountries = currentCountries.filter(d => d !== entityString);
  }
  console.log("Test " + currentCountries)
  d3.select("#gDiagram").remove()
  updateDiagram()
}

export default createEntityChooser()
