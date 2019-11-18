import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';

let constant = x => () => x;

export function simpleBarChart(selection) {
  let width = 300,
      height = 200;
  let data = [];
  let x = null;
  let y = null;

  function my(selection) {
    // create scales and set ranges
    x = scaleBand()
      .range([0, width])
      .padding(0.1);
    y = scaleLinear()
      .range([height, 0]);

    selection.each(function(data) {
      // update scale domains
      x.domain(data.map(function(d) { return d.label; }));
      y.domain([0, max(data, function(d) { return d.value; })]);

      // Select the svg element, if it exists.
      let svg = select(this).selectAll("svg").data([data]);
      const svgEnter = svg.enter().append("svg");
      const gEnter = svgEnter.append("g");

      // reselecting otherwise it only finds and resizes on the second call.
      // why is this necessary? Is there a better way?
      svg = select(this).selectAll("svg");

      // Update the outer dimensions.
      svg.attr("width", width)
        .attr("height", height);

      let bars = svg.select("g").selectAll(".bar").data(data);

      const barsEntering = bars.enter()
            .append("rect")
            .attr("class", "bar");

      // Reselecting otherwise it only draws them on the second call
      // why is this necessary? Is there a better way?
      bars = svg.select("g").selectAll(".bar").data(data);

      // update bar sizes and positions
      bars
        .attr("x", function(d) { return x(d.label); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
    });

  }

   my.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return my;
   };

   my.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return my;
   };

  return my;
};
