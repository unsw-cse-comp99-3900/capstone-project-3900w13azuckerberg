import { ResponsiveLine } from "@nivo/line";
import { LineItem } from "./types";
interface LineChartProps {
  lineData: LineItem[];
}

const LineChart: React.FC<LineChartProps> = ({ lineData }) => (
  <ResponsiveLine
    data={lineData}
    theme={{
      legends: { text: { fontSize: 16 } },
      axis: {
        legend: { text: { fontSize: 16, fill: "#494949" } },
        ticks: { text: { fontSize: 12, fill: "#494949" } },
      },
    }}
    margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    curve="natural"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Time",
      legendOffset: 36,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Num Cases 000's",
      legendOffset: -40,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    colors={{ datum: "color" }}
    enableGridX={false}
    enableGridY={false}
    lineWidth={3}
    enablePoints={false}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderColor={{ from: "serieColor" }}
    pointLabel="data.yFormatted"
    pointLabelYOffset={0}
    enableTouchCrosshair={true}
    useMesh={true}
    legends={[
      {
        anchor: "top",
        direction: "row",
        justify: false,
        translateX: 0,
        translateY: -25,
        itemsSpacing: 20,
        itemDirection: "left-to-right",
        itemWidth: 60,
        itemHeight: 20,
        itemOpacity: 1,
        symbolSize: 14,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemTextColor: "white",
            },
          },
        ],
      },
    ]}
  />
);

export default LineChart;
