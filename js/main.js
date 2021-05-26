// Allow one audio player to play one at a time. Code source: 
// https://stackoverflow.com/questions/61587406/allow-one-audio-player-to-play-at-a-time

// Get all <audio> elements.
const audios = document.querySelectorAll('audio');

// Pause all <audio> elements except for the one that started playing.
function pauseOtherAudios({ target }) {
  for (const audio of audios) {
    if (audio !== target) {
      audio.pause();
    }
  }
}

// Listen for the 'play' event on all the <audio> elements.
for (const audio of audios) {
  audio.addEventListener('play', pauseOtherAudios);
}


// #################  Carousel 3 ##################################


var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

// ########################################### VIZ1 ###############################################

(function(){
					
	const margin = {top: 100, right: -5, bottom: -50, left: 60};

	const width = 950 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	const svg = d3.select("#viz1")
	  .append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  
	  const chart = svg.append('g');
	  
	  
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
	        return d.measurement + 1000; });
	        })
	    ]);

	const makeYLines = () => d3.axisLeft()
	    .scale(yScale) 

	 chart.append('g')
	    .attr("class", "axis")
	    .attr('transform', `translate(0, ${height})`)
	    .call(d3.axisBottom(xScale));
	  
	  chart.append('g')
	    .attr("class", "axis")
	    .call(d3.axisLeft(yScale))
	  
	    chart.append('g')
	    .attr('class', 'grid')
	    .call(makeYLines()
	    .tickSize(-width, 0, 0)
	    .tickFormat('')
	    );
	  
	const colors = ["#dba5e8", "#13f2a4"];
	  
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

	     svg.append('text')
	        .attr('class', 'label')
	        .attr('x', -210)
	        .attr('y', -50)
	        .attr('transform', 'rotate(-90)')
	        .attr('text-anchor', 'middle')
	        .text("Rate per 100,000 population");

	    svg.append('text')
	        .attr('class', 'label');

	      svg.append('text')
	        .attr('class', 'title')
	        .attr('x', 450)
	        .attr('y', -75)
	        .attr('text-anchor', 'middle')
	        .text("Covid-19 Case Rates within Prisons and the Community")

	        svg.append('text')
	          .attr('class', 'title-subtitle')
	          .attr('x', 450)
	          .attr('y', -50)
	          .attr('text-anchor', 'middle')
	          .text("In England and Wales between January 2020 - April 2021")

	      svg.append('text')
	          .attr('class', 'label')
	          .attr('x', 265)
	          .attr('y', 425)
	          .attr('text-anchor', 'middle')
	          .text("⟵ The peak of the first wave")
	  
	     svg.append('text')
	          .attr('class', 'label2')
	          .attr('x', 620)
	          .attr('y', 65)
	          .attr('text-anchor', 'middle')
	          .text("The peak of the second wave ⟶ ")

	  
	      svg.append('text')
	        .attr('class', 'source')
	         .attr('x', 775)
	          .attr('y', 490)
	        .attr('text-anchor', 'start')
	        .text('Source: MoJ/HMPPS & ONS')

	const lines = svg.selectAll("lines")
	    .data(slices)
	    .enter()
	    .append("g");

	    lines.append("path")
	    .attr("class", ids)
	    .attr("d", function(d) { return line(d.values); });


	        lines.selectAll("points")
	            .data(function(d) {return d.values})
	            .enter()
	            .append("circle")
	            .attr("cx", function(d) { return xScale(d.date); })
	            .attr("cy", function(d) { return yScale(d.measurement); })
	            .attr("r", 1)
	            .attr("class","point")
	            .style("opacity", 1);
	  
	    var legend = svg.selectAll(".legend")
	  .data(colors)
	  .enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
	 
	legend.append("rect")
	  .attr("x", width / 2 + -480)
	  .attr("y", -40)
	  .attr("width", 15)
	  .attr("height", 15)
	  .style("fill", function(d, i) {return colors.slice().reverse()[i];});
	 
	legend.append("text")
	  .attr("x", width / 2 + -458)
	  .attr("y", -32)
	  .attr("dy", ".35em")
	  .style("text-anchor", "start")
	  .text(function(d, i) { 
	    switch (i) {
	      case 0: return "Covid-19 cases in the community";
	      case 1: return "Covid-19 cases in prisons";
	    }
	  });


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