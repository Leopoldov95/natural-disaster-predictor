import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Paper } from "@mui/material";

const WIDTH = 1100;
const HEIGHT = 750;

const BarChart = ({ data, view, year }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const margin = { top: 10, right: 30, bottom: 50, left: 120 };
    const width = WIDTH - margin.left - margin.right;
    const height = HEIGHT - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width]);

    const y = d3
      .scaleBand()
      .domain(
        data
          .map((d) => d.state_full)
          .sort((a, b) => {
            return (
              data.find((e) => e.state_full === a).predictions[view] -
              data.find((e) => e.state_full === b).predictions[view]
            );
          })
      )
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    const barG = svg.append("g").attr("transform", "translate(100,50)");

    barG
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    barG
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    barG
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("y", (d) => y(d.state_full))
      .attr("width", (d) => x(d.predictions[view]) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

    barG
      .append("text")
      .attr("transform", `translate(${width / 2},${height - 10})`)
      .style("text-anchor", "middle")
      .text("% Probability");

    barG
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("State");

    svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .style("font-size", "1.5em")
      .text(`Natural Disaster Prediction - ${view} (${year})`);

    // Add hover effect
    svg
      .selectAll("rect")
      .on("mouseover", function (event, d) {
        const tooltip = d3.select(".tooltip");
        tooltip.transition().duration(100).style("opacity", 0.9);
        tooltip
          .html(`
          <span>${d.state}:</span>
          <span>${d.predictions[view].toFixed(2)}%</span>
          `)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", function () {
        d3.select(".tooltip").transition().duration(500).style("opacity", 0);
      });
  }, [data, view]);

  return (
    <div className="chart-container">
      <svg ref={svgRef} width={WIDTH} height={HEIGHT}></svg>
      <Paper
        className="tooltip"
        style={{ opacity: 0, position: "absolute" }}
      ></Paper>
    </div>
  );
};

export default BarChart;
