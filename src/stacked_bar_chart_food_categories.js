var svg_food_cat = d3.select("#stacked"),
    margin_food_cat = {top: 20, right: 180, bottom: 30, left: 40},
    width_food_cat = +svg_food_cat.attr("width") - margin_food_cat.left - margin_food_cat.right,
    height_food_cat = +svg_food_cat.attr("height") - margin_food_cat.top - margin_food_cat.bottom,

    g_food_categories = svg_food_cat.append("g").attr("transform", "translate(" + margin_food_cat.left + "," + margin_food_cat.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width_food_cat])
    .padding(0.3)
    .align(.3);

var y = d3.scaleLinear()
    .range([height_food_cat, 0]);

var z = d3.scaleOrdinal(d3.schemeCategory20);
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var stack = d3.stack();

// Data
d3.csv("./data/lebensmittelkategorien.csv", type, function(error, data) {
  if (error) throw error;
  console.log(data)

  data.sort(function(a, b) {return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Entity; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(data.columns.slice(3));

// Category
  g_food_categories.selectAll(".serie")
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

  // x axis
  g_food_categories.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height_food_cat + ")")
      .call(d3.axisBottom(x));

  // y axis
  g_food_categories.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "s"))
    .append("text")

      .attr("x", 2)
      .attr("y", y(y.ticks(10).pop()))
      .attr("dy", "0.35")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text("Average number of kilocalories per person per day");

// making the legend
  var legend_food_categories = g_food_categories.selectAll(".legend")
    .data(data.columns.slice(3).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; })
      .style("font", "10px sans-serif");

  // rectangles for the legend
  legend_food_categories.append("rect")
      .attr("x", width_food_cat - 15)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);

  legend_food_categories.append("text")
      .attr("x", width_food_cat + 20)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });
});


function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i)
  t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}