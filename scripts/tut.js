const ratings = [2.4814814814814814, 3, 2.8181818181818183, 2, 2, 3, 5, 2.4814814814814814];
const categories = [
  "Technical",
  "Testing",
  "Consulting",
  "Domain",
  "BA & XD",
  "Management & Planning",
  "Language"
];

const data = categories.reduce((p, c, i) => {
  p.push({
    category: c,
    rating: ratings[i]
  })
  return p;
}, []);

console.log(data);

window.onload = () => {
  const margin = {top: 20, right: 20, bottom: 20, left: 40};
  const width = 800 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis");

  svg.append("g")
    .attr("class", "y axis");

  const x = d3.scaleBand()
    .padding(.5)
    .range([0, width]);

  const y = d3.scaleLinear()
    .range([height, 0]);

  const update = (data) => {
    x.domain(data.map(d => d.category));
    y.domain([0, d3.max(data, d => d.rating)]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(svg)
      .attr("x", d => x(d.category))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.rating))
      .attr("height", d => height - y(d.rating));

    svg.select(".x.axis")
      .call(d3.axisBottom(x))
      .attr("transform",
        "translate(0, " + height + ")");

    svg.select(".y.axis")
      .call(d3.axisLeft(y));
  }

  update(data);
}