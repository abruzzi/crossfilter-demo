function shapeChart(categories) {
  var width = 200,
    height = 200;

  var outerRadius = 50,
    innerRadius = 120;

  var ratingScale = 10;

  var angle = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

  var radius = d3.scaleLinear()
    .range([0, outerRadius]);

  var title = 'xxxxxxxxxxxxxxxxxxx';
  var legend = false;


  function chart(selection) {
    selection.each(function (series) {
      const svg = d3.select(this).selectAll("svg").data([series]);

      const graph = svg.enter().append("svg").append("g")
        .merge(svg)
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + (width / 2 - 10) + "," + (height / 2 - 10) + ")");

      angle.domain([0, series.length - 1]);
      radius.domain([0, -outerRadius]);

      var lineRadial = d3.radialLine()
        .radius(x => x)
        .angle((d, i) => angle(i))
        .curve(d3.curveCardinal);

      var ploygonRadial = d3.radialLine()
        .radius(x => x)
        .angle((d, i) => angle(i));

      graph.selectAll(".axis")
        .data(d3.range(series.length - 1))
        .enter().append("g")
        .attr("class", "axis")
        .attr("stroke-dasharray", ("2,2"))
        .attr("transform", function (d) {
          return "rotate(" + angle(d) * 180 / Math.PI + ")";
        })
        .call(d3.axisLeft(radius.copy().range([0, -outerRadius]))
          .tickSizeOuter(0));

      graph.selectAll('.shape')
        .data([_.map(series, function (x) {
          return x * ratingScale
        })])
        .enter()
        .append('path')
        .attr('class', 'shape')
        .attr('d', d => lineRadial(d));

      graph.selectAll('.shape-baseline')
        .data([_.fill(Array(series.length), outerRadius)])
        .enter()
        .append('path')
        .attr('class', 'shape-baseline')
        .attr('d', d => ploygonRadial(d));

      if (legend) {
        const ga = graph.append("g")
          .attr("class", "a axis")
          .attr("transform", "translate(" + (width / 2 - 10) + "," + (height / 2 - 10) + ")")
          .selectAll("g")
          .data(d3.range(0, 360, 360 / (series.length - 1)));

          ga.enter().append("g")
          .attr("transform", function (d) {
            return "rotate(" + (d - 90) + ")";
          });

        const rd = Math.min(width, height) / 2 - 70;

        ga.append("text")
          .merge(ga)
          .attr("class", "legend-text")
          .attr("x", rd)
          .attr("dy", ".30em")
          .style("text-anchor", function (d) {
            console.log(d)
            return d < 360 && d > 180 ? "end" : null;
          })
          .attr("transform", function (d) {
            return d < 360 && d > 180 ? "rotate(180 " + (rd) + ",0)" : null;
          })
          .text((d, i) => categories[i]);
      }
    });
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.title = function (_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.legend = function (_) {
    if (!arguments.length) return legend;
    legend = _;
    return chart;
  }

  return chart;
}