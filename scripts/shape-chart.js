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

  function chart(selection) {
    selection.each(function(data) {
      var svg = d3.select(this).selectAll("svg").data([data]);

      var gEnter = svg.enter().append("svg").append("g");

      // Update the outer dimensions.
      svg
        .attr("width", width)
        .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var grouped = data;
      var categories = _.keys(grouped);

      angle.domain([0, categories.length]);
      radius.domain([0, -outerRadius]);

      var lineRadial = d3.svg.line.radial()
          .radius(function(d){
              return d;
          }).angle(function(d,i){
              return angle(i);
          });

      var series = _.map(_.values(grouped), function(v) {
          return _.meanBy(v, function(x) {
              return x.rating
              })
          });

      var series = _.concat(series, _.head(series));

      g.selectAll('.shape')
          .data([_.map(series, function(x) {return x * ratingScale})])
          .enter()
          .append('path')
          .attr('class', 'shape')
          .attr('d',function(d){
              return lineRadial(d);
          });

      g.selectAll('.shape-baseline')
          .data([_.fill(Array(series.length), outerRadius)])
          .enter()
          .append('path')
          .attr('class', 'shape-baseline')
          .attr('d',function(d){
              return lineRadial(d);
          });

      g.selectAll(".axis")
          .data(d3.range(categories.length))
        .enter().append("g")
          .attr("class", "axis")
          .attr("stroke-dasharray", ("2,2"))
          .attr("transform", function(d) { 
            return "rotate(" + angle(d) * 180 / Math.PI + ")"; 
          })
        .call(d3.svg.axis()
          .scale(radius.copy().range([0, -outerRadius]))
          .orient("left")
          .outerTickSize(0));

    });
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  return chart;
}