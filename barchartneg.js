//source: https://observablehq.com/@toff/bar-chart-with-negative-values

//import {range, max, scaleLinear, axisBottom, axisTop, scaleBand} from "d3"; 
import * as d3 from "d3"; 

export function BarChartNeg(data, { 
  x = (d, i) => i, // given d in data, returns the (ordinal) x-value
  y = d => d, // given d in data, returns the (quantitative) y-value 
  colorPositive="steelblue", 
  colorNegative="red", 
  width = 640, // the outer width of the chart, in pixels
  height = 400 } = {}) {
  
  const absMax = d3.max(data, d => Math.abs(d.value));
  const yDomain = [-absMax, absMax];
  xDomain = x; 
  const height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
  const width = 600;
  var margin = ({top: 30, right: 0, bottom: 30, left: 40});
  var x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1)

  var y = d3.scaleLinear()
      .domain([-absMax, absMax]).nice()
      .range([height - margin.bottom, margin.top])

  const xAxisPos = g => g
      .attr("transform", `translate(0,${height / 2})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))
      .selectAll('g.tick')
        .attr('display', i => data[i].value < 0 ? 'none' : '')

  const xAxisNeg = g => g
      .attr("transform", `translate(0,${height / 2})`)
      .call(d3.axisTop(x).tickFormat(i => data[i].name).tickSizeOuter(0))
      .selectAll('g.tick')
        .attr('display', i => data[i].value > 0 ? 'none' : '')

  const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(data.y))

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  // Positive values
  svg.append("g")
      .attr("fill", colorPositive)
    .selectAll("rect")
    .data(data.map(d => d.value > 0 ? d : {value: 0}))
    .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth());

  // Negative values
  svg.append("g")
      .attr("fill", colorNegative)  // red, but just not too bright
    .selectAll("rect")
    .data(data.map(d => d.value < 0 ? d : {value: 0}))
    .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(0))
      .attr("height", d => y(0) - y(-d.value))
      .attr("width", x.bandwidth());

  svg.append("g")
      .call(xAxisPos);
  
  svg.append("g")
      .call(xAxisNeg);

  svg.append("g")
      .call(yAxis);

  return svg.node();
}

