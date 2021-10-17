function updateGraph() {
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 20, bottom: 60, left: 85},
        width = 460 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    document.getElementById("dist-graph").innerHTML = "";

    // append the svg object to the body of the page
    var svg = d3.select("#dist-graph")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x_values = [];
    filtered_histogram_data.forEach(x => x_values.push(x.bins));

    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(x_values)
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    // X axis label

    svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                         (height + margin.top + 15) + ")")
    .style("text-anchor", "middle")
    .text("Walking Distance (km)")
    .attr('class','graph-axis-label');

    
    var max_height = 0;
    filtered_histogram_data.forEach(x => {
        if (x.count > max_height) {
            max_height = x.count;
        }
    });

    var round_amount = 50;
    for (amount of [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]) {
        if (max_height / 6 > amount) {
            round_amount = amount;
        }
    }

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, Math.ceil(max_height/round_amount)*round_amount])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));


    // Add Y axis label

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 2)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Residents")
      .attr('class','graph-axis-label');   

    // Add Y axis sublabel

    var sublabel  = "";
    switch(demographicMenu.value) {
        case "difficulty_walking": sublabel = "(Difficulty Walking)"; break;
        case "social_deprivation_1-5": sublabel = "(Social Deprivation Index 1-5)"; break;
        case "social_deprivation_6-10": sublabel = "(Social Deprivation Index 6-10)"; break;
    }

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 17)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(sublabel)
        .attr('class','graph-axis-label');   


    // Bars
    svg.selectAll("mybar")
    .data(filtered_histogram_data)
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d.bins); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); })
        .attr("fill", function(d) { return d.colors; })
}