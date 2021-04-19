var svg = d3.select("#stacked"),
    margin = {top: 20, right: 180, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,

    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.3)
    .align(.3);

var y = d3.scaleLinear()
    .range([height, 0]);


var z = d3.scaleOrdinal(d3.schemeCategory20);
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var stack = d3.stack();

var currentYear = 2013
var currentCountries = ["Germany", "Switzerland", "Madagascar"]

// Data
let updateDiagram = () => d3.csv("./data/lebensmittelkategorien.csv").then(function(data) {
//  if (error) throw error;
  console.log(data)


//  data = data.filter(d => Number(d.Year) === currentYear)
//        .filter(d => currentCountries.includes(String(d.Entity)));



//  data.filter(function(d){ return d.Entity == "Switzerland" })
//  data = data.filter(d => currentCountries.includes(String(d.Entity)) === "Switzerland");
  data.sort(function(a, b) {return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Entity; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(data.columns.slice(3));

// Category
  g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(3))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Entity); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) {return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  // this places the x axis on the bottom and moves it so it's in the right place
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // this places the y axis on the left and moves it so it's in the right place
  g.append("g")
      .attr("class", "axis axis--y")
      // this says to have 10 ticks on the y axis and give them the "k" thousands notation
      .call(d3.axisLeft(y).ticks(10, "s"))
      // this part formats the title of the y axis ("Title")
      .append("text")
      
      .attr("x", 2)// place it 2 pixels to the right of the y-axis
      .attr("y", y(y.ticks(10).pop()))// make it level with the top number, this line appears to not be necessary
      .attr("dy", "0.35")
      .attr("text-anchor", "start")//sets where in relation to the y-axis the word starts. could be
                                    // "middle" or "end" both of which would move it left
      .attr("fill", "#000")
      .text("Average number of kilocalories per person per day");

// making the legend
  var legend = g.selectAll(".legend")
    .data(data.columns.slice(3).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; })
      .style("font", "10px sans-serif");

  // rectangles for the legend
  legend.append("rect")
      .attr("x", width + 18) //placed 18 pixes from the right edge of the svg
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; }); //d is just each column name
});


function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i)
  // for each row, which is a d, cycle through the columns and add up all the elements
  // in d, then assign that to t, which is a number from the +d[columns[i]]
  t += d[columns[i]] = +d[columns[i]];
  // creates a new column in the data titled "total"
  d.total = t;
  return d;
}