import { ResponsivePie } from "@nivo/pie";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const PieChart = () => (
  <ResponsivePie
    theme={{ legends: { text: { fontSize: 20 } } }}
    data={[
      {
        id: "Alpha",
        label: "Alpha",
        value: 287,
        color: "#9B57D3",
      },
      {
        id: "Beta",
        label: "Beta",
        value: 320,
        color: "#665EB8",
      },
      {
        id: "Delta",
        label: "Delta",
        value: 227,
        color: "#92278F",
      },
      {
        id: "Gamma",
        label: "Gamma",
        value: 150,
        color: "#C39AE5",
      },
      {
        id: "Omicron",
        label: "Omicron",
        value: 459,
        color: "#6159AE",
      },
    ]}
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
        translateX: -50,
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
