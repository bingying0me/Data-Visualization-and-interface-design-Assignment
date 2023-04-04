let width = 1500;
    let height = 500;
    let titleHeight = 50;
    let margin = 50;

    let radius = Math.min(width, height) / 2 - margin;

    let svg = d3.select("#div")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let chart = svg
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    let svg_title = d3.select('#title')
        .append('svg')
        .attr("width", width)
        .attr("height", titleHeight);

    Promise.all([d3.csv("gender.csv")]).then(function(d) {
    var dataset = d3.merge(d);
    dataset.forEach(function(d) {
        d["Male"] =
            +d["Male"];
        d["Female"] =
            +d["Female"];
    })
    var Count = d3.nest().key(function(d) {
        return d.count
    }).rollup(function(d) {
        return {
            count: d.length,
            Male: d3.sum(d, d => d["Male"]),
            Female: d3.sum(d, d => d["Female"]),
        }
    }).entries(dataset)    

    var Male = d3.max(Count, d => d.value.Male)
    var Female = d3.max(Count, d => d.value.Female)
    const Gender = {
        Female: Female,
        Male: Male,
    };

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    let labelArc = d3.arc()
        .innerRadius(radius - 110)
        .outerRadius(radius - 110);


    let color = d3.scaleOrdinal()
        .domain(["Male", "Female"])
        .range(d3.schemeYlOrRd[7]);

    function update(data, title) {

        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(function (a, b) {
                console.log(a);
                return d3.ascending(a.key, b.key);
            });

        var ready = pie(d3.entries(data));

        var view = chart.selectAll("path")
            .data(ready);

        var titleView = svg_title.selectAll("text");

        var labelColorView = svg.selectAll("rect").data(ready);

        var labelTextView = svg.selectAll("text").data(ready);


        view
            .enter()
            .append('path')
            .merge(view)
            .transition()
            .duration(500)
            .attr('d', arc)
            .attr('fill', function (d) {
                return (color(d.data.key))
            })
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        svg_title.append("text")
            .attr("x", (width / 2))
            .attr("y", (titleHeight - 10))
            .attr("text-anchor", "middle")
            .style("font-size", "40px")
            .text(title)
            .style("fill", "white");

        labelColorView.enter().append("rect")
            .attr("fill", function (d) {
                return (color(d.data.key))
            })
            .attr("height", 10)
            .attr("width", 10)
            .attr("transform", function (d, i) {
                var translate = [0, 14+(15 * i)];
                return "translate(" + translate + ")";
            });

        labelTextView.enter().append('text')
            .text(function (d) {
                return d.data.key + " : " + d.data.value;
            })
            .attr("transform", function (d, i) {
                var translate = [15, 25 + (15 * i)];
                return "translate(" + translate + ")";
            })
            .style("font-size", "16px")
            .style("fill", "white");

    }

    update(Gender, 'Gender of the Covid-19 confirmed cases in Hong Kong(until 3 May)')
    })