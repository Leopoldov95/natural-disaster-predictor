import * as d3 from "d3";
import * as topojson from "topojson-client";
import { useRef, useEffect } from "react";

const Map = ({ data, view, year }) => {
  const WIDTH = 1000;
  const HEIGHT = 650;
  const svgRef = useRef();

  // Mapify the data
  const formatData = async (data) => {
    const topoJSONdata = await d3.json(
      "https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/states-10m.json"
    );

    const rowByName = data.reduce((accumulator, d) => {
      accumulator[d["state_full"]] = d;
      return accumulator;
    }, {});
    const states = topojson.feature(topoJSONdata, topoJSONdata.objects.states);

    states.features.forEach((d) => {
      Object.assign(d.properties, rowByName[d.properties.name]);
    });

    return states;
  };

  // render the US map
  const renderMap = (state_data) => {
    const svg = d3.select(svgRef.current);
    // remove content from svg
    svg.selectAll("*").remove();
    const width = WIDTH;
    const height = HEIGHT;

    const projection = d3.geoAlbersUsa();

    const pathGenerator = d3.geoPath().projection(projection);

    const title = `Predictions for ${year}, Results for ${view}`;
    const subheader = "*Hover over any state for prediction details";
    const g = svg.append("g").attr("class", "map-g");

    const colorLegendG = svg
      .append("g")
      .attr("transform", `translate(180,${height - 100})`);

    const colorScale = d3.scaleSequential();

    const colorValue = (d) => {
      return d?.properties?.predictions?.[view];
    };

    //colorScale.domain(d3.extent(state_data.features, colorValue)).interpolator(d3.interpolateOranges);
    colorScale.domain([0, 50]).interpolator(d3.interpolateOranges);

    // Just add the color legend to the bottom of the map
    colorLegendG.call(colorLegend, {
      dataScale: colorScale,
      height: 20,
      width: WIDTH / 1.5
    });

    g.selectAll("path")
      .data(state_data.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", pathGenerator)
      .attr("fill", (d) => colorScale(colorValue(d)))
      .append("title")
      .text((d) => {
        const pred = d?.properties?.predictions;
        let output = `${d.properties.name}\n`;
        if (pred) {
          if (view === "Avg") {
            for (let key in pred) {
              output += `${key} : ${pred[key]}%\n`;
            }
          } else {
            output += `${view} : ${pred[view]}%\n`;
          }
        }
        return output;
      });

    g.append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("class", "map-title")
      .text(title);
    g.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("class", "map-subheader")
      .text(subheader);
  };

  const colorLegend = (selection, props) => {
    const { height, width, dataScale } = props;
  
    const colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, width]);
    const bars = selection.selectAll(".bars").data([null]);
    bars
      .data(d3.range(width), function (d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("class", "bars")
      .attr("x", function (d, i) {
        return i;
      })
      .attr("y", 0)
      .attr("height", height)
      .attr("width", 1)
      .style("fill", function (d, i) {
        return colorScale(d);
      });
    selection.append("text")
      .text("Lower Risk")
      .attr('class','scale-text');
    selection
      .append("text")
      .attr("transform", `translate(${width - 70},-2)`)
      .text(`Higher Risk`)
      .attr('class','scale-text');
  };

  useEffect(() => {
    const handleRender = async () => {
      try {
        // get the formatted data
        const formatted = await formatData(data);
        if (formatted) renderMap(formatted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // draw the map
    handleRender();
  }, [data, view]);

  return <svg ref={svgRef} height={HEIGHT} width={WIDTH}></svg>;
};

export default Map;
