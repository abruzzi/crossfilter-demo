function shapeChart() {
  var width = 200,
    height = 200;

  var outerRadius = 50,
    innerRadius = 120;

  var ratingScale = 10;

  var angle = d3.scale.linear()
    .range([0, 2 * Math.PI]);

  var radius = d3.scale.linear()
    .range([0, outerRadius]);

  var title = '';
  var legend = false;

  function chart(selection) {
    selection.each(function (series) {
      var svg = d3.select(this).selectAll("svg").data([series]);

      var gEnter = svg.enter().append("svg").append("g");

      svg
        .attr("width", width)
        .attr("height", height);

      var g = svg.select("g")
        .attr("transform", "translate(" + (width / 2 - 10) + "," + (height / 2 - 10) + ")");

      angle.domain([0, series.length - 1]);
      radius.domain([0, -outerRadius]);

      var lineRadial = d3.svg.line.radial()
        .radius(function (d) {
          return d;
        })
        .angle(function (d, i) {
          return angle(i);
        })
        .interpolate('cardinal');

      var ploygonRadial = d3.svg.line.radial()
        .radius(function (d) {
          return d;
        })
        .angle(function (d, i) {
          return angle(i);
        });

      g.selectAll(".axis")
        .data(d3.range(series.length - 1))
        .enter().append("g")
        .attr("class", "axis")
        .attr("stroke-dasharray", ("2,2"))
        .attr("transform", function (d) {
          return "rotate(" + angle(d) * 180 / Math.PI + ")";
        })
        .call(d3.svg.axis()
          .scale(radius.copy().range([0, -outerRadius]))
          .orient("left")
          .outerTickSize(0));

      g.selectAll('.shape')
        .data([_.map(series, function (x) {
          return x * ratingScale
        })])
        .enter()
        .append('path')
        .attr('class', 'shape')
        .attr('d', function (d) {
          return lineRadial(d);
        });


      g.selectAll('.shape-baseline')
        .data([_.fill(Array(series.length), outerRadius)])
        .enter()
        .append('path')
        .attr('class', 'shape-baseline')
        .attr('d', function (d) {
          return ploygonRadial(d);
        });

      svg.selectAll(".title")
        .data([title])
        .enter().append("text")
        .attr("class", "title")
        .attr("x", (width / 2))
        .attr("y", (height - 20))
        .attr("text-anchor", "middle")
        .text(function (d) {
          return d
        });

      if (legend) {
        var ga = svg.append("g")
          .attr("class", "a axis")
          .attr("transform", "translate(" + (width / 2 - 10) + "," + (height / 2 - 10) + ")")
          .selectAll("g")
          .data(d3.range(0, 360, 360 / (series.length - 1)))
          .enter().append("g")
          .attr("transform", function (d) {
            return "rotate(" + (d - 90) + ")";
          });

        var rd = Math.min(width, height) / 2 - 70;

        var categories = ["Technical", "Testing", "Consulting", "Domain", "BA & XD", "Mgmt & Plan", "Language"];

        ga.append("text")
          .attr("class", "legend-text")
          .attr("x", rd)
          .attr("dy", ".30em")
          .style("text-anchor", function (d) {
            return d < 360 && d > 180 ? "end" : null;
          })
          .attr("transform", function (d) {
            return d < 360 && d > 180 ? "rotate(180 " + (rd) + ",0)" : null;
          })
          .text(function (d, i) {
            return categories[i];
          });
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