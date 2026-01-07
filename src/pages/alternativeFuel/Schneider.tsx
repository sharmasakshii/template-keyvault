import ChartHighChart from 'component/highChart/ChartHighChart';
import { barColumnChartCompare } from 'utils/highchart/barColumnChartCompare';
const Schneider = ({
  isLoadingSchneider,
  schneiderData,
  month,
  year,
  type,
  monthOption
}: any) => {
  const monthName=monthOption?.filter((el: any) => el.value === month)
  return (
    <div className='mb-3 p-3 select-box select-carrier'>
      <div className='d-flex flex-column border-bottom pb-2 mb-3'>
        <span className='font-12 fw-medium'>Total Fuel Consumptions for {type?.label} {type?.value ? 'Type': ''} in {monthName?.[0]?.label}, {year}</span>
        <span className='font-xxl-20 font-16 fw-bold'>Total Fuel Consumptions (Gallons)</span>
      </div>

      <div className="bandGraph">
        <ChartHighChart
          testId="high-chart-emission-intensity"
          options={barColumnChartCompare({
            companyName: true,
            reloadData: true,
            options: schneiderData?.data,
            yTitle: 'Fuel Consumption (Gallons)',

          })}
          constructorType=""
          isLoading={isLoadingSchneider}
          database={schneiderData?.data?.series?.length > 0}
        />
      </div>

    </div>
  );
}

export default Schneider;
