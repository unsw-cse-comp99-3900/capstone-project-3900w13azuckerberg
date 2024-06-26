import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const LineChart = () => (
    <ResponsiveLine
        data={
            [
                {
                  "id": "Alpha",
                  "color": "#9B57D3",
                  "data": [
                    {
                      "x": "03/21",
                      "y": 11
                    },
                    {
                      "x": "06/21",
                      "y": 109
                    },
                    {
                      "x": "09/21",
                      "y": 241
                    },
                    {
                      "x": "12/21",
                      "y": 151
                    },
                    {
                      "x": "03/22",
                      "y": 65
                    },
                    {
                      "x": "06/22",
                      "y": 101
                    },
                    {
                      "x": "09/22",
                      "y": 201
                    },
                    {
                      "x": "12/22",
                      "y": 110
                    },
                    {
                      "x": "03/23",
                      "y": 222
                    },
                    {
                      "x": "06/23",
                      "y": 280
                    },
                    {
                      "x": "09/23",
                      "y": 127
                    },
                    {
                      "x": "12/23",
                      "y": 180
                    }
                  ]
                },
                {
                  "id": "Beta",
                  "color": "#665EB8",
                  "data": [
                    {
                      "x": "03/21",
                      "y": 67
                    },
                    {
                      "x": "06/21",
                      "y": 59
                    },
                    {
                      "x": "09/21",
                      "y": 248
                    },
                    {
                      "x": "12/21",
                      "y": 133
                    },
                    {
                      "x": "03/22",
                      "y": 101
                    },
                    {
                      "x": "06/22",
                      "y": 249
                    },
                    {
                      "x": "09/22",
                      "y": 143
                    },
                    {
                      "x": "12/22",
                      "y": 153
                    },
                    {
                      "x": "03/23",
                      "y": 282
                    },
                    {
                      "x": "06/23",
                      "y": 75
                    },
                    {
                      "x": "09/23",
                      "y": 1
                    },
                    {
                      "x": "12/23",
                      "y": 282
                    }
                  ]
                },
                {
                  "id": "Delta",
                  "color": "#92278F",
                  "data": [
                    {
                      "x": "03/21",
                      "y": 43
                    },
                    {
                      "x": "06/21",
                      "y": 176
                    },
                    {
                      "x": "09/21",
                      "y": 272
                    },
                    {
                      "x": "12/21",
                      "y": 225
                    },
                    {
                      "x": "03/22",
                      "y": 220
                    },
                    {
                      "x": "06/22",
                      "y": 85
                    },
                    {
                      "x": "09/22",
                      "y": 182
                    },
                    {
                      "x": "12/22",
                      "y": 126
                    },
                    {
                      "x": "03/23",
                      "y": 242
                    },
                    {
                      "x": "06/23",
                      "y": 92
                    },
                    {
                      "x": "09/23",
                      "y": 206
                    },
                    {
                      "x": "12/23",
                      "y": 6
                    }
                  ]
                },
              ]
        }
        theme={{ 
            legends: { text: { fontSize: 20 } },
            axis: { legend: { text: { fontSize: 16, fill: '#494949' }},
                    ticks: { text: { fontSize: 12, fill: '#494949' }}
            },
        }}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Time',
            legendOffset: 36,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Num Cases 000\'s',
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
        }}
        colors={{ datum: 'color' }}
        enableGridX={false}
        enableGridY={false}
        lineWidth={3}
        enablePoints={false}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={0}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
            {
                anchor: 'top',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: -25,
                itemsSpacing: 10,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 1,
                symbolSize: 16,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemTextColor: 'white'
                        }
                    }
                ]
            }
        ]}
    />
)

export default LineChart