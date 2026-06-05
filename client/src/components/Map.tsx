import { useRef, useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { PredictionKey } from "../types/types";

interface DisasterStateData {
  state: string;
  state_full: string;
  predictions: Record<string, number>;
}

interface MapProps {
  data: DisasterStateData[];
  view: PredictionKey;
  year: number;
}

interface StateFeature {
  properties: {
    name: string;
    predictions?: Record<string, number>;
  };
}

const WIDTH = 1000;
const HEIGHT = 650;

const Map = ({ data, view, year }: MapProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const formatData = async (dataArray: DisasterStateData[]) => {
    const topoJSONdata = await d3.json<any>(
      "https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/states-10m.json",
    );

    const lookup = dataArray.reduce<Record<string, DisasterStateData>>(
      (acc, item) => {
        acc[item.state_full] = item;
        return acc;
      },
      {},
    );

    const states = topojson.feature(
      topoJSONdata,
      topoJSONdata.objects.states,
    ) as any;

    states.features.forEach((feature: StateFeature) => {
      const stateName = feature.properties?.name;
      feature.properties = {
        ...feature.properties,
        predictions: lookup[stateName]?.predictions ?? {},
      };
    });

    return states;
  };

  const renderMap = (stateData: any) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const projection = d3.geoAlbersUsa();

    const pathGenerator = d3.geoPath().projection(projection);

    const getColorValue = (feature: any) =>
      feature.properties?.predictions?.[view] ?? 0;

    const colorScale = d3
      .scaleSequential<number>()
      .domain([0, 50])
      .interpolator(d3.interpolateOranges);

    const g = svg.append("g").attr("class", "map-g");

    const legendG = svg
      .append("g")
      .attr("transform", `translate(180,${HEIGHT - 100})`);

    legendG.call(colorLegend, {
      dataScale: colorScale,
      height: 20,
      width: WIDTH / 1.5,
    });

    g.selectAll("path")
      .data(stateData.features)
      .join("path")
      .attr("class", "country")
      .attr("d", pathGenerator as any)
      .attr("fill", (feature: any) => colorScale(getColorValue(feature)))
      .append("title")
      .text((feature: any) => {
        const predictions = feature.properties.predictions ?? {};
        const header = `${feature.properties.name}\n`;
        if (view === "Avg") {
          return (
            header +
            Object.entries(predictions)
              .map(([key, value]) => `${key}: ${value}%`)
              .join("\n")
          );
        }
        return `${header}${view}: ${predictions[view] ?? 0}%`;
      });

    g.append("text")
      .attr("x", WIDTH / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("class", "map-title")
      .text(`Predictions for ${year}, Results for ${view}`);

    g.append("text")
      .attr("x", WIDTH / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("class", "map-subheader")
      .text("*Hover over any state for prediction details");
  };

  const colorLegend = (
    selection: any,
    props: { height: number; width: number; dataScale: any },
  ) => {
    const { height, width } = props;

    const colorScale = d3
      .scaleSequential(d3.interpolateOranges)
      .domain([0, width]);

    selection
      .selectAll(".bars")
      .data(d3.range(width))
      .join("rect")
      .attr("class", "bars")
      .attr("x", (d: number) => d)
      .attr("y", 0)
      .attr("height", height)
      .attr("width", 1)
      .style("fill", (d: number) => colorScale(d));

    selection.append("text").text("Lower Risk").attr("class", "scale-text");

    selection
      .append("text")
      .attr("transform", `translate(${width - 70}, -2)`)
      .text("Higher Risk")
      .attr("class", "scale-text");
  };

  useEffect(() => {
    const render = async () => {
      if (!data.length) return;
      const formatted = await formatData(data);
      renderMap(formatted);
    };

    render();
  }, [data, view, year]);

  return <svg ref={svgRef} height={HEIGHT} width={WIDTH} />;
};

export default Map;
