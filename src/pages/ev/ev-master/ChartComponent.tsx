import Heading from 'component/heading';
import ChartHighChart from 'component/highChart/ChartHighChart';
import React from 'react'
import { Col } from 'reactstrap'
import { barchartEV } from 'utils/highchart/barchartEV';

interface ChartComponentProps {
    headingContent: string;
    headingSubtitle?: string;
    barKey: string;
    yTitle: string;
    decimalUpto: number;
    isLoadingChart: any;
    graphOptions: any,
    data: any,
    dateFormat: any
    lgSize?: number
}

const ChartComponent: React.FC<ChartComponentProps> = ({
    headingContent,
    headingSubtitle,
    barKey,
    yTitle,
    decimalUpto,
    isLoadingChart,
    graphOptions = [],
    data,
    dateFormat,
    lgSize = 6
}) => {

    return (
        <Col lg={lgSize}>
            <div className="emission-region h-100">
                <div className="mb-3 p-3 border-bottom">
                    <p className="font-12 fw-medium mb-2">
                        {dateFormat}
                    </p>
                    <div className='d-flex align-items-center gap-1'>
                        <Heading
                            level="3"
                            className="font-16 font-xxl-20 mb-0 fw-semibold"
                            content={headingContent}
                        />
                        {headingSubtitle && (
                            <span className="fw-normal font-14">({headingSubtitle})</span>
                        )}
                    </div>

                </div>
                <div className="p-3 px-0">
                    <ChartHighChart
                        loadingTestId="high-chart-emission-intensity-loader"
                        testId="high-chart-emission-intensity"
                        database={data}
                        classname=""
                        options={barchartEV({
                            chartType: "column",
                            options: graphOptions,
                            title: "Emissions Impact Lanes",
                            yTitle,
                            showXtitle: true,
                            barKey,
                            decimalUpto,
                        })}
                        constructorType=""
                        isLoading={isLoadingChart}
                    />
                </div>
            </div>
        </Col>
    )
};


export default ChartComponent