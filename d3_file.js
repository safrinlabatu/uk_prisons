
const width = 960;
const height = 500;
const margin = 5;
const padding = 0;
const adj = 40;

const svg = d3.select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
          + adj + " -"
          + adj + " "
          + (width + adj *3) + " "
          + (height + adj*3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);

const timeConv = d3.timeParse("%d/%m/%Y");
const dataset = d3.csv("https://raw.githubusercontent.com/MollySomers/Digital-Investigtion/main/communityprisonscovid.csv");
dataset.then(function(data) {
    const slices = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d){
                return {
                    date: timeConv(d.date),
                    measurement: +d[id]
                };
            })
        };
    });

console.log("Column headers", data.columns);
console.log("Column headers without date", data.columns.slice(1));

console.log("Slices",slices);

console.log("First slice",slices[0]);

console.log("A array",slices[0].values);

console.log("Date element",slices[0].values[0].date);

console.log("Array length",(slices[0].values).length);

const xScale = d3.scaleTime().range([0,width]);
const yScale = d3.scaleLinear().rangeRound([height, 0]);
xScale.domain(d3.extent(data, function(d){
    return timeConv(d.date)}));
yScale.domain([(0), d3.max(slices, function(c) {
    return d3.max(c.values, function(d) {
        return d.measurement + 500; });
        })
    ]);

const yaxis = d3.axisLeft().scale(yScale);

const xaxis = d3.axisBottom().scale(xScale)
      .tickFormat(d3.timeFormat("%b/%y"));

const line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.measurement); });

    let id = 0;
    const ids = function () {
        return "line-"+id++;
    }

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute");

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".75em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Rate per 100,000 population");

const lines = svg.selectAll("lines")
    .data(slices)
    .enter()
    .append("g");

    lines.append("path")
    .attr("class", ids)
    .attr("d", function(d) { return line(d.values); });

    lines.append("text")
        .attr("class","serie_label")
        .datum(function(d) {
            return {
                id: d.id,
                value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) {
                return "translate(" + (xScale(d.value.date) + 10)
                + "," + (yScale(d.value.measurement) + 5 ) + ")";})
        .attr("x", 5)
        .text(function(d) { return ("") + d.id; });

        lines.selectAll("points")
            .data(function(d) {return d.values})
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xScale(d.date); })
            .attr("cy", function(d) { return yScale(d.measurement); })
            .attr("r", 1)
            .attr("class","point")
            .style("opacity", 1);

        lines.selectAll("circles")
    .data(function(d) { return(d.values); })
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.date); })
    .attr("cy", function(d) { return yScale(d.measurement); })
    .attr('r', 10)
    .style("opacity", 0)

lines.selectAll("circles")
    .data(function(d) { return(d.values); } )
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.date); })
    .attr("cy", function(d) { return yScale(d.measurement); })
    .attr('r', 10)
    .style("opacity", 0)
    .on('mouseover', function(d) {
        tooltip.transition()
        .delay(30)
        .duration(200)
        .style("opacity", 1);

        tooltip.html(d.measurement)
            .style("left", (d3.event.pageX + 25) + "px")
            .style("top", (d3.event.pageY) + "px");

        const selection = d3.select(this).raise();

        selection
            .transition()
            .delay("20")
            .duration("200")
            .attr("r", 12)
            .style("opacity", 1)
            .style("fill","rgb(223,152,39)");
        })

    .on("mouseout", function(d) {
        tooltip.transition()
        .duration(100)
        .style("opacity", 0);

        const selection = d3.select(this);

        selection
            .transition()
            .delay("20")
            .duration("200")
            .attr("r", 10)
            .style("opacity", 0);
        });
});