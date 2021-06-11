import "../lib/d3/d3.js"

// https://www.d3-graph-gallery.com/graph/scatter_basic.html
// https://www.d3-graph-gallery.com/graph/scatter_tooltip.html

const scatterPlotSugarDiabetes = () => {

  const title_scatter_plot = "Relationship: Sugar and Diabetes"

  //***********************************************
  // Button with dropdown for selecting country

  const g0_sugar_diabetes = d3.select("#scatter_plot_sugar_diabetes_select").append("g")
      .attr("id", "sug-dia-field");

  g0_sugar_diabetes.append("text")
      .text("Where do you live?");

  g0_sugar_diabetes.append("select")
      .attr('class', 'selectButton inputbox')

  //*********************************************
  // create svg canvas
  const canvHeight = 600, canvWidth = 1200;
  const svg = d3.select("#scatter_plot_sugar_diabetes").append("svg")
      .attr("width", canvWidth)
      .attr("height", canvHeight);

  // calc the width and height depending on margins.
  const margin = {top: 80, right: 240, bottom: 60, left: 240};
  const width = canvWidth - margin.left - margin.right;
  const height = canvHeight - margin.top - margin.bottom;

  // chart title
  svg.append("text")
      .attr("id", "chart-title")
      .attr("y", 30)
      .attr("x", canvWidth/2)
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .text(title_scatter_plot);

  // create parent group and add left and top margin
  const g = svg.append("g")
      .attr("id", "chart-area")
      .attr("transform", "translate(" +margin.left + "," + margin.top + ")");

  // text label for the x axis
  g.append("text")
      .attr("class", "label-text")
      .attr("y", height + margin.bottom / 2)
      .attr("x", width / 2)
      .attr("dy", "1em")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "middle")
      .text("Diabetes in %");

   // text label for the y axis
  g.append("text")
      .attr("class", "label-text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("y", -margin.bottom-10)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .html("Sugar in kcal/capita/day");


  d3.csv("./data/Diabetes-SugarConsumption.csv").then(function(data) {
    const diabetesDomain = d3.extent(data, d => Number(d.Diabetes));
    const sugarDomain = d3.extent(data, d => Number(d.Sugar));

    var countriesDomain = data.map(d => String(d.Entity));

    //************************************************
    var selectionData = countriesDomain
    selectionData.unshift("") //at start no country should be choosen

    // Select Button
    var selectButtonValue = d3.select(".selectButton")
      .selectAll('myOptions')
      .data(selectionData)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; }); // corresponding value returned by the button
    console.log(countriesDomain)

    // 1. create scales for x and y direction and for the color coding
    const xScale = d3.scaleLinear()
      .domain([0, 25])
      .rangeRound([0, width])
      .nice(5);

    const yScale = d3.scaleLinear()
      .domain([0, 600])
      .rangeRound([height, 0])
      .nice(5);

    // 2. create and append
    //    a. x-axis
    const xAxis = d3.axisBottom(xScale);
    g.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0, "+ height +")")
      .call(xAxis);

    //    b. y-axis
    const yAxis = d3.axisLeft(yScale);
    g.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    updateChart();

    // Select Button
    d3.select(".selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      console.log(selectedOption)

      let dataFilter = data.filter(function (d) {
        return d.Entity === selectedOption;
      })

      updateChart()
      updateSelectedDotOnChart(dataFilter);
    })


    //**************
    //regression

    var lg = calcLinear(data, "Diabetes", "Sugar", d3.min(data, function(d){ return d.Diabetes}), d3.min(data, function(d){ return d.Sugar}));

    var x1 = Number(lg.ptA.x)
    var y1 = Number(lg.ptA.y)
    var x2 = Number(lg.ptB.x)
    var y2 = Number(lg.ptB.y)
    var lineAreaWidth = 628.5
    var lineAreaHeight = 149

    svg.append("line")
      .attr("class", "regression")
      .attr("x1", xScale(x1))
      .attr("y1", yScale(y1))
      .attr("x2", xScale(x2))
      .attr("y2", yScale(y2))
      .attr("transform", "translate(" + Number(margin.left+lineAreaWidth) + "," + Number(margin.top-lineAreaHeight) + ")");




    //****************************************
    // update chart functions

    function updateSelectedDotOnChart(dataFilter) {

      // 3. add data-points (circle)
      var data_points = g.selectAll("dot")
          .data(dataFilter)
          .enter();

      var dp = data_points.append("circle")
              .attr("class", "person_data_point")
              .attr("cx", d=> xScale(d.Diabetes))
              .attr("cy", d=> yScale(d.Sugar))
              .attr("r", 8)  // Size of dots
              .attr("stroke", "darkred")
              .attr("stroke-width", 1.5)
              .attr("fill", "darkred");

      dp.transition().duration(1000).attr("r",4);

      //hovering effects
      dp.on("mousemove", function (event, d) {
         var position = d3.pointer(event, d);
         d3.select(this)
           .transition()
          .duration(100)
          .attr("r", 8)
          .attr("stroke", "darkred")
          .attr("stroke-width", 1.5)
          .attr("fill", "darkred")
      });

      dp.on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 4)
          .attr("stroke", "darkred")
          .attr("stroke-width", 1.5)
          .attr("fill", "darkred")
      });

      //Tooltip:
      dp.append("title").text(d => `${d.Entity}: Sugar: ${d.Sugar} kcal/capita/day; Diabetes: ${d.Diabetes} %`);
    }

    function updateChart() {
      var path = g.selectAll("dot")
        .data(data)
        .enter();
      var cir = path.append("circle")
        .attr("class", "person_data_point")
        .attr("cx", d=> xScale(d.Diabetes))
        .attr("cy", d=> yScale(d.Sugar))
        .attr("r", 4)  // Size of dots
        .attr("stroke", "#9ACCD3")
        .attr("stroke-width", 1.5)
        .attr("fill", "#9ACCD3");

      //Tooltip:
      cir.append("title")
        .text(d => `${d.Entity}: Sugar: ${d.Sugar} kcal/capita/day; Diabetes: ${d.Diabetes} %`);

      //hovering effects
      cir.on("mousemove", function (event, d) {
        var position = d3.pointer(event, d);
        d3.select(this).transition()
         .duration(100)
         .attr("r", 6)
      });

      cir.on("mouseout", function (event, d) {
        d3.select(this).transition()
        .duration(100)
        .attr("r", 4)
       });
    }

    //****************************************
    // function for regression

    /**
     * @author Harry Stevens (see website https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097)
     * (has been slightly extended by adding Number() types)
     *
     * Calculate a linear regression from the data
     * Takes 5 parameters:
     * (1) Your data
     * (2) The column of data plotted on your x-axis
     * (3) The column of data plotted on your y-axis
     * (4) The minimum value of your x-axis
     * (5) The minimum value of your y-axis
     * Returns an object with two points, where each point is an object with an x and y coordinate
     */

    function calcLinear(data, x, y, minX, minY){
      /////////
      //SLOPE//
      /////////

      // Let n = the number of data points
      var n = Number(data.length);

      var pts = [];
      data.forEach(function(d,i){
        var obj = {};
        obj.x = Number(d[x]);
        obj.y = Number(d[y]);
        obj.mult = obj.x*obj.y;
        pts.push(obj);
      });

      // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
      // Let b equal the sum of all x-values times the sum of all y-values
      // Let c equal n times the sum of all squared x-values
      // Let d equal the squared sum of all x-values
      var sum = 0;
      var xSum = 0;
      var ySum = 0;
      var sumSq = 0;

      pts.forEach(function(pt){
        sum   = Number(sum)   + Number(pt.mult);
        xSum  = Number(xSum)  + Number(pt.x);
        ySum  = Number(ySum)  + Number(pt.y);
        sumSq = Number(sumSq) + (Number(pt.x) * Number(pt.x));
      });

      var a = Number(sum * n);
      var b = Number(xSum * ySum);
      var c = Number(sumSq * n);
      var d = Number(xSum * xSum);

      // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
      //  m = (a - b) / (c - d)
      var m = Number((a - b) / (c - d));

      /////////////
      //INTERCEPT//
      /////////////

      // Let e equal the sum of all y-values
      var e = Number(ySum);

      // Let f equal the slope times the sum of all x-values
      var f = Number(m * xSum);

      // Plug the values you have calculated for e and f into the following equation for the y-intercept
      // y-intercept = b = (e - f) / n = (14.5 - 10.5) / 3 = 1.3
      var b = Number((e - f) / n);

      // return an object of two points
      // each point is an object with an x and y coordinate
      return {
        ptA : {
          x: Number(minX),
          y: Number((m * minX) + b)
        },
        ptB : {
          y: Number(minY),
          x: Number((minY - b) / m)
        }
      }

    }

  });

}

export default scatterPlotSugarDiabetes
