import { ResponsivePie } from "@nivo/pie";
import { PieItem } from "./types";

interface PieChartProps {
  pieData: PieItem[];
}

const PieChart: React.FC<PieChartProps> = ({ pieData }) => (
  <ResponsivePie
    theme={{ legends: { text: { fontSize: 18 } }, labels: { text: { fontSize: 16} } }}
    data={pieData}
    margin={{ left: 100, top: 10, bottom: 10 }}
    startAngle={-180}
    innerRadius={0.3}
    padAngle={0}
    activeOuterRadiusOffset={8}
    colors={{ datum: "data.color" }}
    // borderWidth={0}
    enableArcLinkLabels={false}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 3]],
    }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: "ruby",
        },
        id: "lines",
      },
      {
        match: {
          id: "c",
        },
        id: "lines",
      },
      {
        match: {
          id: "go",
        },
        id: "lines",
      },
      {
        match: {
          id: "python",
        },
        id: "dots",
      },
      {
        match: {
          id: "scala",
        },
        id: "lines",
      },
      {
        match: {
          id: "lisp",
        },
        id: "lines",
      },
      {
        match: {
          id: "elixir",
        },
        id: "lines",
      },
      {
        match: {
          id: "javascript",
        },
        id: "lines",
      },
    ]}
    motionConfig="stiff"
    legends={[
      {
        anchor: "left",
        direction: "column",
        justify: false,
        translateX: -75,
        translateY: 0,
        itemsSpacing: 1,
        itemWidth: 131,
        itemHeight: 34,
        itemTextColor: "#999",
        itemDirection: "left-to-right",
        itemOpacity: 1,
        symbolSize: 27,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "white",
            },
          },
        ],
      },
    ]}
  />
);

export default PieChart;
