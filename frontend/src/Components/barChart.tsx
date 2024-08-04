import { ResponsiveMarimekko } from "@nivo/marimekko";
import { BarItem } from "./types"


interface BarChartProps {
  barData: BarItem;
}
  
const BarChart: React.FC<BarChartProps> = ({ barData }) => (
  <ResponsiveMarimekko
    data={[barData]}
    id="statement"
    value="participation"
    dimensions={[
      {
          id: 'Infected',
          value: 'Infected'
      }, 
      {
          id: 'Recovered',
          value: 'Recovered'
      },
      {
          id: 'Exposed',
          value: 'Exposed'
      }
      
  ]}
  layout="horizontal"
  outerPadding={-80}
  innerPadding={-80}
  axisTop={null}
  axisRight={null}
  axisBottom={{
    tickSize: 15,
    tickPadding: 0,
    tickRotation: 0,
    legend: '',
    legendOffset: 35,
    legendPosition: 'middle',
    truncateTickAt: 0
  }}
  axisLeft={null}
  enableGridX={false}
  enableGridY={false}
  margin={{ top: 150, right: 80, bottom: 100, left: 80 }}
  colors={{ scheme: 'purpleRed_green' }}
  borderWidth={1}
  borderColor={{
    from: 'color',
    modifiers: [
      [
          'darker',
          0.4,
      ]
    ]
  }}
  legends={[
    {
      anchor: 'bottom',
      direction: 'row',
      justify: false,
      translateX: -45,
      translateY: 80,
      itemsSpacing: -50,
      itemWidth: 140,
      itemHeight: 17,
      itemTextColor: '#999',
      itemDirection: 'right-to-left',
      itemOpacity: 1,
      symbolSize: 16,
      symbolShape: 'square',
      effects: [
          {
            on: 'hover',
            style: {
                itemTextColor: '#000'
            }
          }
        ]
      }
    ]}
  />
)

export default BarChart;