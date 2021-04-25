
const stackedBarChartFoodCategories = () => {

  d3.select("#stacked_bar_chart_food_categories").append("svg")
    .attr("id", "stacked")
    .attr("width", 1200)
    .attr("height", 600);

  const svg_food_cat = d3.select("#stacked"),
    margin_food_cat = {top: 20, right: 180, bottom: 30, left: 40},
    width_food_cat = +svg_food_cat.attr("width") - margin_food_cat.left - margin_food_cat.right,
    height_food_cat = +svg_food_cat.attr("height") - margin_food_cat.top - margin_food_cat.bottom,

    g_food_categories = svg_food_cat.append("g").attr("transform", "translate(" + margin_food_cat.left + "," + margin_food_cat.top + ")");

  function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i)
      t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }

  d3.csv("./data/lebensmittelkategorien.csv", type, function (data) {

    var currentCountries = ["Switzerland", "China", "Vietnam", "Italy"]
    var currentYear = 2013

    var keys = data.columns.slice(3);
    data = data.filter(d => Number(d.Year) === currentYear);
// data = data.map(d => currentCountries.includes(String(d.Entity)));
// data = data.filter(function(d,i){ return i<10 })

    data.sort(function (a, b) {
      return b.total - a.total;
    });

    var x = d3.scaleBand()
      .rangeRound([0, width_food_cat])
      .paddingInner(0.5)  // Padding between balken
      .align(0.1)
      .domain(data.map(function (d) {
        return d.Entity;
      }));

    var y = d3.scaleLinear()
      .rangeRound([height_food_cat, 0])
      .domain([0, d3.max(data, function (d) {
        return d.total;
      })]).nice();

    var colorScale = d3.scaleOrdinal(d3.schemeCategory20)
      .domain(keys);
//    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    g_food_categories.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
      .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
      .data(function (d) {
        return d;
      })
      .enter().append("rect")
      .attr("x", d => x(d.data.Entity))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());    // is this the problem?

    g_food_categories.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height_food_cat + ")")
      .call(d3.axisBottom(x));

    g_food_categories.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Average number of kilocalories per person per day");

// Legend
    var legend_food_categories = g_food_categories.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 30 + ")";
      });

    legend_food_categories.append("rect")
      .attr("x", width_food_cat + 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", colorScale);

    legend_food_categories.append("text")
      .attr("x", width_food_cat + 10)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(function (d) {
        return d;
      });
  });

}

