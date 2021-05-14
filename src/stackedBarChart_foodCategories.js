import "../lib/d3/d3.js"

const foodCategories = async () => {

  var currentYear = 2013
  var currentCountries = ["World", "Germany", "Switzerland", "Madagascar", "North Korea", "Zimbabwe"]

  let data = await d3.csv("./data/FoodCategories.csv", (d, i, columns) =>{
    // currentCountries.includes(String(d.Entity))
    // columns = columns.filter(c => c !== "Entity" && c !== "Year")
    if(Number(d.Year) === currentYear && (d.Entity === "Afghanistan" || d.Entity === "Germany")) {
      return (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d)
    }else{
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

  let margin = ({top: 30, right: 10, bottom: 0, left: 30})
  let height = data.length * 25 + margin.top + margin.bottom
  let width = 300

  let formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("de")

  let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())

  let xAxis = g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 100, "s"))
    .call(g => g.selectAll(".domain").remove())

  let color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.schemeSpectral[series.length])
    .unknown("#ccc")

  let y = d3.scaleBand()
    .domain(data.map(d => d.Entity))
    .range([margin.top, height - margin.bottom])
    .padding(0.08)



  let x = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .range([margin.left, width - margin.right])


    const svg = d3.select("#stackedBarChart_foodCategories").append("svg").attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d[0]))
    .attr("y", (d, i) => y(d.data.Entity))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y.bandwidth())
    .append("title")
    .text(d => `${d.data.Entity} ${d.key}
      ${formatValue(d.data[d.key])}`);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);
}

export default foodCategories
