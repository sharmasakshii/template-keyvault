import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
interface ChartProps {
  options: any;
  constructorType: any;
  reloadData?: boolean;
  chartComponentRef: any;
}
const ChartView: React.FC<ChartProps> = React.memo(({ options, constructorType, reloadData, chartComponentRef }) => {

  return <>
    {!constructorType ? (
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartComponentRef}
        options={{
          ...options,
          credits: {
            enabled: false, // Disable the credits/watermark
          },

        }}
      />
    ) : (
      <HighchartsReact
        constructorType={constructorType}
        highcharts={Highcharts}
        options={options}
      />
    )}
  </>
}, (_, nextProps: any) => {

  return nextProps.reloadData
})

export default ChartView;
