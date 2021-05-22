const width = 1200;
const height = 500;
const margin = 10;
const padding = 0;
const adj = 80;

const svg = d3.select("#viz2").append("svg")
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
const dataset = d3.csv("https://raw.githubusercontent.com/MollySomers/Digital-Investigtion/main/deathscommunityandprisons2.csv");
dataset.then(function(data) {
    var slices = data.columns.slice(1).map(function(id) {
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

const xScale = d3.scaleTime().range([0,width]);
const yScale = d3.scaleLinear().rangeRound([height, 0]);
xScale.domain(d3.extent(data, function(d){
    return timeConv(d.date)}));
yScale.domain([(0), d3.max(slices, function(c) {
    return d3.max(c.values, function(d) {
        return d.measurement + 4; });
        })
    ]);

const yaxis = d3.axisLeft()
    .ticks((slices[0].values).length)
    .scale(yScale);

const xaxis = d3.axisBottom()
    .ticks(d3.timeMonth, 1)
    .tickFormat(d3.timeFormat('%m/%y'))
    .scale(xScale);

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
    .call(yaxis);

      svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', -60)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text("Rate per 100,000 population");

    svg.append('text')
        .attr('class', 'label');

      svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text("Covid-19 death rate within prisons and the community")

        svg.append('text')
          .attr('class', 'title-subtitle')
          .attr('x', width / 2 + margin)
          .attr('y', -25)
          .attr('text-anchor', 'middle')
          .text("In England and Wales between January 2020 - April 2021")

      svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin / 0.05)
        .attr('y', height + margin * 10)
        .attr('text-anchor', 'start')
        .text('Source: MoJ/HMPPS & ONS')
  
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
            + "," + (yScale(d.value.measurement) + 5 ) + ")"; })
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

//---------------------------EVENTS-----------------------------//    
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
            .attr("r", 6)
            .style("opacity", 1)
            .style("fill","#ed3700");
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