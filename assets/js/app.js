// @TODO: YOUR CODE HERE!
//svg container
var svgWidth = 960;
var svgHeight = 500;

//margins
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
//chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(censusData) {
    console.log(censusData)

    //parse poverty and healthcare data
    censusData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

   

    //create scale functions
    var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(censusData, d=> d.poverty)])
    .range([0,width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d=> d.healthcare)])
    .range([height, 0]);

    //create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to chart

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(leftAxis);

    //create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d=> xLinearScale(d.poverty))
    .attr("cy", d=> yLinearScale(d.healthcare))
    .attr("r","15")
    .attr("height", height)
    .attr("width", width)
    .attr("fill","blue")
    .attr("opacity","0.5");

    //Initialize tool tip
    var toolTip = d3.tip()
        .attr("class","tooltip")
        .offset([80,-60])
        .html(function(d){
            return (`${d.abbr}<tr>Poverty Level: ${d.poverty}<tr>Healthcare Level: ${d.healthcare}`);
        });

        //create tooltip in chart
        chartGroup.call(toolTip);

        //create event listeners to display and hide the tooltip
        circlesGroup.on("click", function(data){
            toolTip.show(data, this);
        })
        //on mouseout event
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });

        //create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",0 - margin.left + 40)
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Poverty and Healthcare Correlation")

        chartGroup.append("text")
            .attr("transform", `translate(${width /2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Poverty & Healthcare in America")
    });
    // .catch(function(error){
    //     console.log(error);
    // });