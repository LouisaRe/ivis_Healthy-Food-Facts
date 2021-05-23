// create svg canvas
const canvHeight = 600, canvWidth = 800;
const svg = d3.select("body").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("border", "1px solid");

// calc the width and height depending on margins.
const margin = {top: 50, right: 80, bottom: 50, left: 60};
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;

// chart title
svg.append("text")
    .attr("y", 0)
    .attr("x", margin.left)
    .attr("dy", "1.5em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "24px")
    .style("text-anchor", "left")
    .text("Height vs Weight");

// create parent group and add left and top margin
const g = svg.append("g")
    .attr("id", "chart-area")
    .attr("transform", "translate(" +margin.left + "," + margin.top + ")");

// text label for the x axis
g.append("text")
    .attr("y", height + margin.bottom / 2)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Height");

 // text label for the y axis
g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Weight");

function createLegend(legendDomain, colorScale) {
    // 1. create a group to hold the legend
    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", "translate(" + (canvWidth - margin.right + 10) + "," + margin.top + ")")


    // 2. create the legend boxes and the text label
    //   a. use .data(legendDomain) on an empty DOM selection
    //      store enter()-loop in variable legend_entry
    const legend_entry = legend.selectAll("rect")
        .data(legendDomain)
        .enter();

    //   b. add coloured rect to legend_entry
    legend_entry.append("rect")
        .attr("x", 10)
        .attr("y", (d,i) => 30 * i + 10)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => colorScale(d))
        .attr("stroke", "black")
        .attr("stroke-width", "1");

    //   c. add text label to legend_entry
    legend_entry.append("text")
        .attr("x", 40)
        .attr("y", (d,i) => 30 * i + 25)
        .text(d => d);

    // 3. create the main border of the legend
    legend.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", margin.right - 15)
        .attr("height", legendDomain.length * 30 + 10)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "1");

}

// load the data from the cleaned csv file.
// note: the call is done asynchronous.
// That is why you have to load the data inside of a
// callback function.
d3.csv("./data/persons.csv").then(function(data) {
    const heightDomain = d3.extent(data, d => Number(d.Height));
    const weightDomain = d3.extent(data, d => Number(d.Weight));

    // 1. create scales for x and y direction and for the color coding
    const xScale = d3.scaleLinear()
        .domain(heightDomain)
        .rangeRound([0, width])
        .nice(5);

    const yScale = d3.scaleLinear()
        .domain(weightDomain)
        .rangeRound([height, 0])
        .nice(5);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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


    // 3. add data-points (circle) // mit Animation
    var data_points = g.selectAll("circle")
        .data(data)
        .enter();
    data_points.append("circle")
            .style("fill", d=> colorScale(d["Shirt Size"]))
            .attr("cx", 0)
            .attr("cy", height)
            .attr("r", 4) //Alle Kreise beginnen links unten
            .transition()
            //.duration(2000)
            .duration(d =>
                500 * Math.log10(1000 * Math.sqrt(
                    Math.pow(0      - xScale(d.Height), 2) +
                    Math.pow(height - yScale(d.Weight), 2)  //Je nach Distanz ist die Duration unterschiedlich lang
                ))
            )
            .ease(d3.easeElasticOut) //nachbouncen
            .attr("class", "person_data_point")
            .attr("cx", d=> xScale(d.Height))
            .attr("cy", d=> yScale(d.Weight))
            .attr("r", 4)
        ;

    // 4. create legend
    let legendDomain = ["XS", "S", "M", "L", "XL"];
    createLegend(legendDomain, colorScale);

    // 5. Create tooltip
    var tooltip = d3.select("body").append("div").classed("tooltip", true);
    g.selectAll("circle").on("mouseover", (event, d) => {
        var pos = d3.pointer(event, d);
        tooltip
            .style("left", pos[0] + "px")
            .style("top", pos[1] - 28 + "px")
            .style("visibility", "visible")
            .html(`${d["First Name"]} ${d["Last Name"]}<br/>`
            + `Height: ${d.Height}<br/>`
            + `Weigth: ${d.Weight}<br/>`
            + `Hair Color: ${d["Hair Color"]}`);
    })
    .on("mouseout", (event, d) => {
        tooltip.style("visibility", "hidden");
    });
});

