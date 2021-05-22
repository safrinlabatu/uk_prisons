// ##############################   VIZ_1   #########################
(function () {
    const width = 1200;
    const height = 500;
    const margin = 10;
    const padding = 0;
    const adj = 180;

    const svg = d3.select("#viz1")
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
          .tickFormat(d3.timeFormat("%m/%y"));

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
            .text("Covid-19 case rates within prisons and the community")

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
})();

// // ########################   VIZ_2   ##################

(function () {

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

})();

// // ######################################### VIZ_3 ###############################################

(function () {

    var margin = {top: 100, right: 220, bottom: 50, left: 80};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#viz3")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var data = [
  { date: "04/2020", compassionateReleases: "21", endofCustody: "30", total: "51" },
  { date: "05/2020", compassionateReleases: "12", endofCustody: "65", total: "77" },
  { date: "06/2020", compassionateReleases: "15", endofCustody: "61", total: "76" },
  { date: "07/2020", compassionateReleases: "3", endofCustody: "59", total: "62" },
  { date: "08/2020", compassionateReleases: "0", endofCustody: "0", total: "49" },
];

var parse = d3.time.format("%m/%Y").parse;


var dataset = d3.layout.stack()(["total", "endofCustody", "compassionateReleases"].map(function(releases) {
  return data.map(function(d) {
    return {x: parse(d.date), y: +d[releases]};
  });
}));

var x = d3.scale.ordinal()
  .domain(dataset[0].map(function(d) { return d.x; }))
  .rangeRoundBands([10, width-10], 0.02);

var y = d3.scale.linear()
  .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
  .range([height, 0]);

var colors = ["#ffbb99", "#ccccff", "#aaff80"];


// Define and draw axes
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(6)
  .tickSize(-width, 0, 0)
  .tickFormat( function(d) { return d } );

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickFormat(d3.time.format("%m/%Y"));

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);
  
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

    svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - 0)
        .attr('y', -50)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text("Prisoners Released");
  
      svg.append('text')
        .attr('class', 'label');

      svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + -400)
        .attr('y', -70)
        .attr('text-anchor', 'center')
        .text("End of Custody Temporary Release for Prisoners during the Second Wave of the Coronavirus Pandemic")

  svg.append('text')
          .attr('class', 'title-subtitle')
          .attr('x', width / 2 + -200)
          .attr('y', -45)
          .attr('text-anchor', 'center')
          .text("Compassionate Releases: This includes pregnant women, those with babies and prisoners with high vulnerability to the virus")
        
  svg.append('text')
          .attr('class', 'title-subtitle2')
          .attr('x', width / 2 + -170)
          .attr('y', -30)
          .attr('text-anchor', 'center')
          .text("End of Custody Temporary Release: The release of low-risk offenders near the end of their custodial sentence")

  
      svg.append('text')
        .attr('class', 'source')
        .attr('x', width / 3 + 450)
        .attr('y', 380)
        .attr('text-anchor', 'start')
        .text('Source: NOMIS');

var groups = svg.selectAll("g.cost")
  .data(dataset)
  .enter().append("g")
  .attr("class", "cost")
  .style("fill", function(d, i) { return colors[i]; });

var rect = groups.selectAll("rect")
  .data(function(d) { return d; })
  .enter()
  .append("rect")
  .attr("x", function(d) { return x(d.x); })
  .attr("y", function(d) { return y(d.y0 + d.y); })
  .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
  .attr("width", x.rangeBand())
  .on("mouseover", function() { tooltip.style("display", null); })
  .on("mouseout", function() { tooltip.style("display", "none"); })
  .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 25;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    tooltip.select("text").text(d.y);
  });


var legend = svg.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
 
legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors.slice().reverse()[i];});
 
legend.append("text")
  .attr("x", width + 5)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d, i) { 
    switch (i) {
      case 0: return "Compassionate Releases";
      case 1: return "End of Custody Releases";
      case 2: return "Total Releases";
    }
  });


var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");
    
tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

})();

// // ###############################################################   VIZ_4   ###############################

(function () {


    var margin = {top: 100, right: 250, bottom: 50, left: 100};

    var width = 950 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("div#viz4")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var data = [
      { date: "2005", other: "97", total: "78" },
      { date: "2006", other: "87", total: "66" },
      { date: "2007", other: "94", total: "91" },
      { date: "2008", other: "105", total: "61" },
      { date: "2009", other: "108", total: "61" },
      { date: "2010", other: "140", total: "58" },
      { date: "2011", other: "134", total: "58" },
      { date: "2012", other: "131", total: "61" },
      { date: "2013", other: "139", total: "76" },
      { date: "2014", other: "154", total: "89" },
      { date: "2015", other: "167", total: "90" },
      { date: "2016", other: "230", total: "124" },
      { date: "2017", other: "222", total: "73" },
      { date: "2018", other: "233", total: "92" },
      { date: "2019", other: "215", total: "85" },
      { date: "2020", other: "251", total: "67" },
    ];

    var parse = d3.time.format("%Y").parse;


    var dataset = d3.layout.stack()(["total", "other"].map(function(deaths) {
      return data.map(function(d) {
        return {x: parse(d.date), y: +d[deaths]};
      });
    }));

    var x = d3.scale.ordinal()
      .domain(dataset[0].map(function(d) { return d.x; }))
      .rangeRoundBands([10, width-10], 0.02);

    var y = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
      .range([height, 0]);

    var colors = ["#7ac6f5", "#f7f49e"];


    // Define and draw axes
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10)
      .tickSize(-width, 0, 0)
      .tickFormat( function(d) { return d } );

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y"));

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

        svg.append('text')
            .attr('class', 'label')
            .attr('x', -(height / 2) - 0)
            .attr('y', -50)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text("Number of deaths");

          svg.append('text')
            .attr('class', 'label');

          svg.append('text')
            .attr('class', 'title')
            .attr('x', width / 2 + -400)
            .attr('y', -70)
            .attr('text-anchor', 'center')
            .text("Deaths in custody reach record high, but proportion of suicides fall slightly during the pandemic")

      svg.append('text')
              .attr('class', 'title-subtitle')
              .attr('x', width / 2 + -200)
              .attr('y', -45)
              .attr('text-anchor', 'center')
              .text("Proportion of self-inflicted deaths from the total prison population in England and Wales")


          svg.append('text')
            .attr('class', 'source')
            .attr('x', width / 3 + 450)
            .attr('y', 380)
            .attr('text-anchor', 'start')
            .text('Source: MoJ');

    var groups = svg.selectAll("g.cost")
      .data(dataset)
      .enter().append("g")
      .attr("class", "cost")
      .style("fill", function(d, i) { return colors[i]; });

    var rect = groups.selectAll("rect")
      .data(function(d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
      .attr("width", x.rangeBand())
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] - 15;
        var yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.y);
      });


    var legend = svg.selectAll(".legend")
      .data(colors)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i) {return colors.slice().reverse()[i];});

    legend.append("text")
      .attr("x", width + 5)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d, i) {
        switch (i) {
          case 0: return "Other causes of death, including homicides and natural causes";
          case 1: return "Number of self-inflicted deaths";
        }
      });


    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

})();