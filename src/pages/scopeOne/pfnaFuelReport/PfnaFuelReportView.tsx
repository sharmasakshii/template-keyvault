import TitleComponent from 'component/tittle'
import SelectDropdown from "component/forms/dropdown";
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import Heading from 'component/heading';
import ImageComponent from 'component/images'
import ChartHighChart from 'component/highChart/ChartHighChart';
import React from 'react';
import { exportChart, getDropDownOptions, getLabel, normalizedList } from 'utils';
import { doubleColumnChart } from 'utils/highchart/doubleColumnChart';
import { LineChartEv } from 'utils/highchart/lineGraphEv';
import multiBarChart from 'utils/highchart/multiBarChart';
import styles from '../../../scss/config/_variable.module.scss'
import { donutchart } from 'utils/highchart/donutchart';
import PfnaReportController from './pfnaFuelReportController';

const PfnaFuelReportView = (props: any) => {

    const {
        isLoadingfuelConsumptionReportGraph,
        fuelConsumptionReportGraphData,
        setPId, yearlyData, pId, setYearlyData,
        isLoadingPfnaTotalEmissionFuel, pfnaTotalEmissionFuelData,
        pfnaFuelConsumptionReportPeriodGraphData, isLoadingPfnaFuelConsumptionReportPeriodGraph,
        isLoadingPfnaFuelEmissionsReportPeriodGraph, pfnaFuelEmissionsReportPeriodData,
        fuelType, setFuelType,
        pfnaFuelConsumptionPercentageData, isLoadingPfnaFuelConsumptionPercentage,
        pfnaFuelEmissionPercentageData, isLoadingPfnaFuelEmissionPercentage,
        pfnaFuelListData,
        isLoadingPfnaFuelList,
        isLoadingFuelFilters, fuelReportFilterData
    } = PfnaReportController(props)
    const { t } = useTranslation()
    const chartRef: any = React.useRef<Highcharts.Chart | null>(null);
    const chartEmissionRef: any = React.useRef<Highcharts.Chart | null>(null);
    const lineChartRef: any = React.useRef<Highcharts.Chart | null>(null);
    const lineChartEmissionRef: any = React.useRef<Highcharts.Chart | null>(null);
    const chartDonoutRef: any = React.useRef<Highcharts.Chart | null>(null);
    const chartDonoutEmissionRef: any = React.useRef<Highcharts.Chart | null>(null);

    const expotEmissionBtn = (data: { mainTitle: string; subTitle: string; unit: string }) =>
        exportChart(chartEmissionRef, data);
    const expotBtn = (data: { mainTitle: string; subTitle: string; unit: string }) =>
        exportChart(chartRef, data);
    const exportLineChart = (data: { mainTitle: string; subTitle: string; unit: string }) =>
        exportChart(lineChartRef, data);
    const exportLineChartEmission = (data: { mainTitle: string; subTitle: string; unit: string }) =>
        exportChart(lineChartEmissionRef, data);
    const exportDonutChart = (data: { mainTitle: string; subTitle: string; unit: string }) =>
        exportChart(chartDonoutRef, data);
    const exportDonutChartEmission = (data: { mainTitle: string; subTitle: string; unit: string }) =>
        exportChart(chartDonoutEmissionRef, data);
    const selectedfilter = `${getLabel(pId, "Period")} ${yearlyData?.label}`;
    const selectedFuel = `${getLabel(fuelType || "", "Fuel Type")}`;
    return (
        <section className='scopeOneDashboard py-2 pb-4'>
            <TitleComponent title={"Scope 1 | Fuels Report"} pageHeading={"PFNA Report"} />
            <div className='border-bottom px-2 select-box flex-wrap d-flex gap-2 pb-3 mb-3' data-testid="pfna-report">
                <SelectDropdown
                    aria-label="year-dropdown"
                    disabled={isLoadingFuelFilters}
                    options={getDropDownOptions(fuelReportFilterData?.data?.years, "year", "year", "", "", false)}
                    placeholder={t('year')}
                    customClass="yearDropdown"
                    selectedValue={yearlyData}
                    onChange={(e: any) => {
                        setYearlyData(e);
                        setPId({ label: "All Periods", value: "" })
                    }}
                />
                <SelectDropdown
                    aria-label="period-dropdown"
                    disabled={isLoadingFuelFilters}
                    options={getDropDownOptions(fuelReportFilterData?.data?.periods, "period_name", "id", "All Periods")}
                    placeholder={t('period')}
                    selectedValue={pId}
                    onChange={(e: any) => {
                        setPId(e);
                    }}
                />

            </div>
            <Row className='g-3'>
                <Col lg="6">
                    <div className="mainGrayCards h-100">
                        <div className="p-3 pe-4 d-flex gap-2 justify-content-between align-items-start">
                            <div>
                                <Heading level="6" className="fw-medium font-14 mb-1" content={`Fuel Consumption for ${selectedfilter}`} />
                                <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`Actual vs Forecast Fuel Consumption`} <span className='fw-medium font-xxl-14 font-12'>(Gallons)</span></Heading>
                            </div>
                            <div className="d-flex gap-3 align-items-center">
                                <button type='button' data-testid="export-btn" className="btn btn-transparent download-img p-0 h-0" onClick={() => expotBtn({
                                    mainTitle: `Fuel Consumption for ${selectedfilter}`,
                                    subTitle: 'Actual vs Forecast Fuel Consumption',
                                    unit: '(Gallons)',
                                })}> <ImageComponent path="/images/download.svg" /></button>
                            </div>
                        </div>
                        <div className="px-0 pt-3">
                            <ChartHighChart
                                chartComponentRef={chartRef}
                                database={fuelConsumptionReportGraphData?.data?.options?.length > 0}
                                classname=''
                                options={doubleColumnChart({
                                    xTitle: `${t('fuelType')}s`,
                                    yTitle: `${t('fuelConsumption')} (${t('gallons')})`,
                                    decimalPoint: 0,
                                    options: fuelConsumptionReportGraphData?.data?.options || [],
                                    pointWidth: 24,
                                    categories: fuelConsumptionReportGraphData?.data?.categories || [],
                                    enableDownload: false
                                })}
                                constructorType=""
                                isLoading={isLoadingfuelConsumptionReportGraph}
                            />
                        </div>
                    </div>
                </Col>
                <Col lg="6">
                    <div className='mainGrayCards h-100'>
                        <div className="d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4">
                            <div className='d-flex gap-1 align-items-start'>
                                <div>
                                    <Heading level="6" className="fw-medium font-14 mb-1" content={`Emissions for ${selectedfilter}`} />
                                    <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`Total Emissions by Fuel Type`} <span className='fw-medium font-xxl-14 font-12'>(tCO2e)</span></Heading>
                                </div>
                            </div>
                            <button data-testid="expotEmissionBtn" type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => expotEmissionBtn({
                                subTitle: "Total Emissions by Fuel Type",
                                mainTitle: `Emissions for ${selectedfilter}`,
                                unit: '(tCO2e)'
                            })}> <ImageComponent path="/images/download.svg" /></button>
                        </div>
                        <div className='pt-1 ps-2'>
                            <ChartHighChart
                                chartComponentRef={chartEmissionRef}
                                database={pfnaTotalEmissionFuelData?.data?.options?.length > 0}
                                options={
                                    multiBarChart(
                                        {
                                            yTitle: 'Emissions (tCO2e)',
                                            xTitle: 'Fuel Types',
                                            options: pfnaTotalEmissionFuelData?.data?.options || [],
                                            yKey: "total_emissions",
                                            xKey: "label",
                                            decimalPlace: 2,
                                            barColor: (styles.orange),
                                            isTooltip: true,
                                        }
                                    )
                                }
                                constructorType=""
                                isLoading={isLoadingPfnaTotalEmissionFuel}
                            />
                        </div>
                    </div>
                </Col>
                <Col lg="6">
                    <div className='mainGrayCards h-100'>
                        <div className="d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4">
                            <div className='d-flex gap-1 align-items-start'>
                                <div className='select-box'>
                                    <Heading level="6" className="fw-medium font-14 mb-1" content={`Fuel Consumption by ${selectedFuel} for ${selectedfilter}`} />
                                    <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`Actual vs Forecast Fuel Consumption `} <span className='fw-medium font-xxl-14 font-12'>({t('gallons')})</span></Heading>
                                    <div className='d-flex mt-2'>
                                        <SelectDropdown
                                            aria-label="fuel-type-dropdown"
                                            placeholder={"Fuel types"}
                                            disabled={isLoadingPfnaFuelList}
                                            options={getDropDownOptions(pfnaFuelListData?.data?.fuelTypes, "fuel_name", "id", "", "", false)}
                                            selectedValue={fuelType}
                                            onChange={(e: any) => {
                                                setFuelType(e);
                                            }}
                                        />

                                    </div>
                                </div>
                            </div>
                            <button data-testid="exportLineChart" type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => exportLineChart({
                                subTitle: "Actual vs Forecast Fuel Consumption",
                                mainTitle: `Fuel Consumption by ${selectedFuel} for ${selectedfilter}`,
                                unit: "Gallons"
                            })}> <ImageComponent path="/images/download.svg" /></button>
                        </div>

                        <div className='py-3 pt-1'>
                            <ChartHighChart
                                chartComponentRef={lineChartRef}
                                database={normalizedList(pfnaFuelConsumptionReportPeriodGraphData?.data?.data)?.length > 0}
                                options={LineChartEv({
                                    options: pfnaFuelConsumptionReportPeriodGraphData?.data,
                                    decimalUpto: 2,
                                    yTitle: `${t('fuelConsumption')} (${t('gallons')})`,
                                    xKey: "periods",
                                    enableDownload: false
                                })}
                                constructorType=""
                                isLoading={isLoadingPfnaFuelConsumptionReportPeriodGraph}
                            />
                        </div>
                    </div>
                </Col>
                <Col lg="6">
                    <div className='mainGrayCards h-100'>
                        <div className="d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4">
                            <div className='d-flex gap-1 align-items-start'>
                                <div className='select-box'>
                                    <Heading level="6" className="fw-medium font-14 mb-1" content={`Emissions by ${selectedFuel} for ${selectedfilter}`} />
                                    <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`Actual vs Forecast Emissions`} <span className='fw-medium font-xxl-14 font-12'>(tCO2e)</span></Heading>
                                    <div className='d-flex mt-2 visibility'>
                                        <SelectDropdown
                                            placeholder={"Fuel types"}
                                        />
                                    </div>
                                </div>

                            </div>
                            <button data-testid="exportLineChartEmission" type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => exportLineChartEmission({
                                subTitle: " Actual vs Forecast Emissions",
                                mainTitle: `Emissions by ${selectedFuel} for ${selectedfilter}`,
                                unit: '(tCO2e)'
                            })}> <ImageComponent path="/images/download.svg" /></button>
                        </div>
                        <div className='py-3 pt-1'>
                            <ChartHighChart
                                chartComponentRef={lineChartEmissionRef}
                                database={normalizedList(pfnaFuelEmissionsReportPeriodData?.data?.data)?.length > 0}
                                options={LineChartEv({
                                    options: pfnaFuelEmissionsReportPeriodData?.data,
                                    decimalUpto: 2,
                                    yTitle: `Emissions (${t('tco2eUnit')})`,
                                    xKey: "periods",
                                    enableDownload: false
                                })}
                                constructorType=""
                                isLoading={isLoadingPfnaFuelEmissionsReportPeriodGraph}
                            />
                        </div>
                    </div>
                </Col>
                <Col lg="6">
                    <div className='mainGrayCards h-100'>
                        <div className="d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4">
                            <div className='d-flex gap-1 align-items-start'>

                                <div>
                                    <Heading level="6" className="fw-medium font-14 mb-1" content={`Fuel Consumption for ${selectedfilter}`} />
                                    <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`Total Fuel Consumption by Fuel Type`} <span className='fw-medium font-xxl-14 font-12'> (In Percentage)</span></Heading>
                                </div>
                            </div>

                            <button data-testid="exportDonutChart" type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => exportDonutChart({
                                subTitle: "Total Fuel Consumption by Fuel Type",
                                mainTitle: `Fuel Consumption for ${selectedfilter}`,
                                unit: '(In Percentage)'
                            })}> <ImageComponent path="/images/download.svg" /></button>

                        </div>
                        <div className='py-3 pt-1'>
                            <ChartHighChart
                                chartComponentRef={chartDonoutRef}
                                options={donutchart({
                                    options: pfnaFuelConsumptionPercentageData?.data?.data,
                                    dataKey: "percentage",
                                    donutInnerTitle: "Consumption by</br>Fuel Type",
                                    enableDownload: false
                                })}
                                constructorType=""
                                isLoading={isLoadingPfnaFuelConsumptionPercentage}
                                database={pfnaFuelConsumptionPercentageData?.data?.data?.length > 0}
                            />
                        </div>
                    </div>
                </Col>
                <Col lg="6">
                    <div className='mainGrayCards h-100'>
                        <div className="d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4">
                            <div className='d-flex gap-1 align-items-start'>

                                <div>
                                    <Heading level="6" className="fw-medium font-14 mb-1" content={`Emissions for ${selectedfilter}`} />
                                    <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`Total Emissions by Fuel Type`} <span className='fw-medium font-xxl-14 font-12'> (In Percentage)</span></Heading>
                                </div>
                            </div>

                            <button data-testid="exportDonutChartEmission" type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => exportDonutChartEmission({
                                subTitle: "Total Emissions by Fuel Type.",
                                mainTitle: `Emissions for ${selectedfilter}`,
                                unit: '(In Percentage)'
                            })}> <ImageComponent path="/images/download.svg" /></button>

                        </div>
                        <div className='py-3 pt-1'>
                            <ChartHighChart
                                chartComponentRef={chartDonoutEmissionRef}
                                options={donutchart({
                                    options: pfnaFuelEmissionPercentageData?.data?.data,
                                    dataKey: "percentage",
                                    donutInnerTitle: "Emissions by</br>Fuel Type",
                                    enableDownload: false
                                })}
                                constructorType=""
                                isLoading={isLoadingPfnaFuelEmissionPercentage}
                                database={pfnaFuelEmissionPercentageData?.data?.data?.length > 0}
                            />
                        </div>
                    </div>
                </Col>

            </Row>
        </section>
    )
}

export default PfnaFuelReportView