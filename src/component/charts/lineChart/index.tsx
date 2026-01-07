import Heading from 'component/heading'
import ChartHighChart from 'component/highChart/ChartHighChart'
import ImageComponent from 'component/images'
import React from 'react'
import { exportChart } from 'utils'
import { LineChartEv } from 'utils/highchart/lineGraphEv'

const LineChart = ({ filterHeading, chartHeading, unit, loading, data, yTitle, xKey, testId="" }: any) => {
     const exportLineChart: any = React.useRef<Highcharts.Chart | null>(null);
    const exportLineChartbtn = (data: { mainTitle: string; subTitle: string; unit: string }) =>
        exportChart(exportLineChart, data);
    return (
        <div className='mainGrayCards h-100'>
            <div className="d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4">
                <div className='d-flex gap-1 align-items-start'>
                    <div>
                        <Heading level="6" className="fw-medium font-14 mb-1" content={filterHeading} />
                        <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{chartHeading} <span className='fw-medium font-xxl-14 font-12'>{unit}</span></Heading>
                    </div>
                </div>
                
                <button data-testid={testId} type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => exportLineChartbtn({
                    subTitle: chartHeading,
                    mainTitle: filterHeading,
                    unit: unit
                })}> <ImageComponent path="/images/download.svg" /></button>

            </div>
            <div className='py-3 pt-1'>
                <ChartHighChart
                    chartComponentRef={exportLineChart}
                    database={data?.data?.length > 0}
                    options={LineChartEv({
                        options: data,
                        decimalUpto: 2,
                        yTitle: yTitle,
                        xKey: xKey,
                        enableDownload: false
                    })}
                    constructorType=""
                    isLoading={loading}
                />
            </div>
        </div>
    )
}

export default LineChart