var parseDate = d3.time.format("%Y-%m-%d %H:%M");

$.get('data/bookmarks.json').done(function(data) {
	data.forEach(function(d) {
		d.created = parseDate.parse(d.created);
	});
	
	_.remove(data, function(d) {
		return d3.time.day(d.created).valueOf() == d3.time.day(new Date("2012-11-06")).valueOf() || 
		d3.time.day(d.created).valueOf() == d3.time.day(new Date("2013-12-17")).valueOf();
	});

	var facts = crossfilter(data);
	var createdDim = facts.dimension(function(d) {
		return d3.time.day(d.created);
	});


	var createdMeature = createdDim.group().reduceCount();

	console.log(createdMeature.size());
	console.log(createdMeature.top(10));
	console.log(createdDim.bottom(10));

	var createdInHoursDim = facts.dimension(function(d) {
		return d.created.getHours() + d.created.getMinutes() / 60;
	});

	var craetedInHoursMeature = createdInHoursDim.group(Math.floor).reduceCount();

	console.log(craetedInHoursMeature.size());
	console.log(craetedInHoursMeature.top(10));


	var bookmarksDayChart = dc.barChart("#bookmarks-day-chart");
	var bookmarksHourChart = dc.barChart("#bookmarks-hour-chart");

	bookmarksDayChart.width(960)
	    .height(200)
	    .margins({top: 10, right: 10, bottom: 20, left: 40})
	    .dimension(createdDim)
	    .group(createdMeature)
	    .transitionDuration(500)
		.elasticY(true)
	    .x(d3.time.scale().domain([new Date(2012, 10, 1), new Date(2017, 3, 1)]))
	    .xAxis()
	    ;

	bookmarksHourChart.width(480)
	    .height(200)
	    .margins({top: 10, right: 10, bottom: 20, left: 40})
	    .dimension(createdInHoursDim)
	    .group(craetedInHoursMeature)
	    .transitionDuration(500)
		.elasticY(true)
	    .x(d3.scale.linear().domain([0, 24]).rangeRound([0, 10 * 24]))
	    .xAxis()
	    ;

	// bookmarksHourChart.colors(['#a65628']);

	dc.renderAll();
});