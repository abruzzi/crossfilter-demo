const categories = ["Technical", "Testing", "Consulting", "Domain", "BA & XD", "Management & Planning", "Language"];
const chart = shapeChart();

window.onload = () => {
  d3.json("data/twoz.json", (twoz) => {
    const ids = _.take(twoz, 20).map(x => x.employeeId);
    const charts = d3.select('#charts')
      .selectAll('div.shape-chart')
      .data(ids);

    charts
      .enter()
      .append('div')
      .attr('class', 'col-lg-2 col-md-2 col-sm-2 shape-chart')
      .attr('id', x => `twer-${x}`);

    const twers = _.filter(twoz, twer => ids.includes(twer.employeeId));

    twers.forEach(twer => {
      const grouped = _.groupBy(twer.skills, 'group.name');

      const skills = _.map(categories, (category) => {
        const items = grouped[category];

        if (items) {
          return _.meanBy(items, x => x.rating);
        } else {
          return 0;
        }
      });

      const series = _.concat(skills, _.head(skills));

      chart.width(180).height(180).legend(false).title(twer.name);

      d3.select(`#twer-${twer.employeeId}`)
        .datum(series)
        .call(chart);
    });

    chart.width(200).height(200).legend(true).title('');
    const full = [5, 5, 5, 5, 5, 5, 5, 5];

    d3.select("#legend")
      .datum(full)
      .call(chart);
  });
}
