// set the dimensions and margins of the graph
var margin = {top: 50, right: 20, bottom: 70, left: 200},
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// Create svg
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S"); // "2020-02-08 23:31:48"

// Output Range
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.totalVisits); });

// Get the data
d3.csv("wiki_history.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.totalVisits = +d.totalVisits;
  });

  // Input Domain
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.totalVisits; })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the scatterplot 
  svg.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 2.5)
      .style("stroke", "#27284D")
      .style("fill", "white")
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.totalVisits); })
      .on("mouseover", function(d, i) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("fill", "#a53e4f")
      })
    .on("mouseout", function(d, i) {
        d3.select(this)
          .style("fill", "white")
      })

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Axis labels 
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top/2 + 20) + ")")
      .style("text-anchor", "middle")
      .attr("font-family", "Saira")
      .attr("font-size", 14)
      .attr("font-variant", "small-caps")
      .text("Date");
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left/2 + 20)
      .attr("x",0 - (height / 2))
      .attr("dy", "2em")
      .attr("font-family", "Saira")
      .attr("font-size", 14)
      .style("text-anchor", "middle")
      .attr("font-variant", "small-caps")
      .text("Total Visits"); 

});