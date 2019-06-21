var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S");

$.get('data/google.search.history.count.json').done(function(data) {
	data.forEach(function(d) {
		d.searched = parseDate.parse(d.searched);
	});
	
	var facts = crossfilter(data);
	var createdDim = facts.dimension(function(d) {
		return d3.time.day(d.searched);
	});

	var createdMeature = createdDim.group().reduceCount();

	var createdInHoursDim = facts.dimension(function(d) {
		return d.searched.getHours() + d.searched.getMinutes() / 60 + d.searched.getSeconds()/3600;
	});

	var craetedInHoursMeature = createdInHoursDim.group(Math.floor).reduceCount();

	var createdInWeekDim = facts.dimension(function(d) {
		var day = d.searched.getDay();
		var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return day + '.' + name[day];
	});

	var createdInWeekMeature = createdInWeekDim.group();

	var searchDayChart = dc.barChart("#search-day-chart");
	var searchHourChart = dc.barChart("#search-hour-chart");
	var searchWeekChart = dc.rowChart("#search-week-chart");

	searchDayChart.width(1000)
	    .height(100)
	    .margins({top: 10, right: 10, bottom: 20, left: 40})
	    .dimension(createdDim)
	    .group(createdMeature)
	    .transitionDuration(500)
		.elasticY(true)
	    .x(d3.time.scale().domain([new Date(2006, 9, 16), new Date(2017, 3, 20)]))
	    .xAxis();

	searchHourChart.width(380)
	    .height(200)
	    .margins({top: 10, right: 10, bottom: 20, left: 40})
	    .dimension(createdInHoursDim)
	    .group(craetedInHoursMeature)
	    .transitionDuration(500)
		.elasticY(true)
	    .x(d3.scale.linear().domain([0, 24]).rangeRound([0, 10 * 24]))
	    .xAxis();

	var threshold = d3.scale.threshold()
	    .domain([0, 8, 22, 24.01])
	    .range(["black", "#393B79", "steelblue", "#393B79", "black"]);

	searchHourChart.on("renderlet.data", function(chart) {
		chart.selectAll('rect.bar').each(function(d){
	        d3.select(this).attr("style", "fill: "+threshold(d.data.key));
		});
	});

	var weekColors = d3.scale.ordinal()
		.domain(d3.range(7))
		.range(["#393B79", "steelblue", "steelblue", "steelblue", "steelblue", "steelblue", "#393B79"]);

	searchWeekChart.width(380)
	    .height(200)
	    .margins({top: 10, right: 10, bottom: 20, left: 40})
	    .dimension(createdInWeekDim)
	    .group(createdInWeekMeature)
	    .transitionDuration(500)
	    .colors(weekColors)
        .label(function (d) {
            return d.key.split('.')[1];
        })
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);

	dc.renderAll();
});