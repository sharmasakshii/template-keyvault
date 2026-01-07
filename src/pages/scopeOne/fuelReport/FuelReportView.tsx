import React from 'react';
import Highcharts from 'highcharts';
import SelectDropdown from "component/forms/dropdown";
import { Col, Row } from 'reactstrap';
import Heading from 'component/heading';
import { exportChart, formatNumber, getDropDownOptions, getLabel, isCompanyEnable, normalizedList } from 'utils';
import ChartHighChart from 'component/highChart/ChartHighChart';
import TableBodyLoad from "component/tableBodyHandle";
import Pagination from "component/pagination";
import { donutchart } from "utils/highchart/donutchart";
import TitleComponent from "component/tittle";
import FuelReportController from "./fuelReportController";
import SustainViewCard from "component/cards/sustainabilityTracker";
import { useTranslation } from 'react-i18next';
import ImageComponent from 'component/images'
import multiBarChart from 'utils/highchart/multiBarChart';
import styles from '../../../scss/config/_variable.module.scss'
import ButtonComponent from 'component/forms/button';
import TableHead from 'component/tableHeadHandle';
import MapComponent from 'component/map/MapComponent';
import FuelStopMap from 'component/map/FuelStopMap';
import LineChart from 'component/charts/lineChart';
import { companySlug } from 'constant';

interface FuelTrackerCardProps {
  title: string;
  subTitle: string;
  isLoading: boolean;
  data: any;
  yTitle: string;
  xTitle: string;
  unit: string;
  barColor?: string,
  staticTax?: boolean
}
interface FilterOption {
  label: string;
  value: string;
}
interface SelectedFilters {
  BusinessUnitScope1?: FilterOption;
  Location?: FilterOption;
  Company?: FilterOption;
  Market?: FilterOption;
  FuelType?: FilterOption;
}

export const FuelTrackerCard: React.FC<FuelTrackerCardProps> = ({
  title,
  subTitle,
  isLoading,
  data,
  yTitle,
  xTitle,
  unit,
  barColor = styles.primary,
  staticTax = false
}) => {

  const chartRef: any = React.useRef<Highcharts.Chart | null>(null);
  const expotBtn = (data: { mainTitle: string; subTitle: string; unit: string }) =>
    exportChart(chartRef, data);

  return (
    <Col md="6">
      <div className="mainGrayCards h-100">
        <div className="p-3 pe-4 d-flex gap-2 justify-content-between align-items-start">
          <div className='d-flex gap-2 align-items-start'>
            {staticTax && <div className='static-txt'><Heading level="6" className="fw-medium font-12 mb-0" content={"Static"} /></div>}
            <div>
              <Heading level="6" className="fw-medium font-14 mb-1" content={title} />
              <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`${subTitle}`} <span className='fw-medium font-xxl-14 font-12'>{unit}</span></Heading>
            </div>
          </div>

          <div className="d-flex gap-3 align-items-center">
            <button data-testid="export-btn-fuel" type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => expotBtn({
              mainTitle: title,
              subTitle: subTitle,
              unit: unit,
            })}> <ImageComponent path="/images/download.svg" /></button>
          </div>
        </div>
        <div className="p-3 pt-0">
          <ChartHighChart
            chartComponentRef={chartRef}
            options={
              multiBarChart(
                {
                  yTitle,
                  xTitle,
                  barWidth: 35,
                  options: [...data],
                  barColor,
                  isenabledataLabel: true,
                  isTooltip: true,
                  decimalPlace: 2,
                  enabledExport: false
                }
              )
            }
            constructorType=""
            isLoading={isLoading}
            database={data?.length > 0}
          />
        </div>
      </div>
    </Col>
  );
};

const FuelReportView = () => {

  const {
    params,
    isLoadingFuelFilters, fuelReportFilterData,
    isLoadingFuelMatrics, fuelReportMatricsData,
    isLoadingFuelConsumption, fuelConsumptionData,
    isLoadingFuelEmission, fuelEmissionData,
    isLoadingConsumptionByDivision, consumptionByDivisionData,
    isLoadingEmissionsByDivision, emissionsByDivisionData,
    isLoadingTransactionFilter, transactionFilterData,
    isLoadingTransactionList, transactionListData,
    isLoadingTransactionLocation, transactionLocationData,
    yearlyData, setYearlyData,
    pId, setPId,
    divisionLevel, setDivisionLevel,
    transportType, setTransportType,
    handleSearchFilters,
    selectedFilters, setSelectedFilters,
    isFilterApplied, setIsFilterApplied,
    initialTransactionFilter,
    setPageNumber, setPageSize,
    pageNumber, pageSize,
    order,
    col_name,
    handleClickColumn,
    handleResetTable,
    filterOptions,
    isLoadingFuelConsumptionByPeriod, fuelConsumptionByPeriodData, isLoadingFuelEmissionByPeriod,
    fuelEmissionByPeriodData,
    showFullScreen, setShowFullScreen,
    loginDetails
  } = FuelReportController()

  const { t } = useTranslation()

  const chartDonoutRef: any = React.useRef<Highcharts.Chart | null>(null);

  const mapStyles = {
    height: !showFullScreen ? "450px" : '100vh',
    width: '100%',
  };
  const exportDonutChart = (data: { mainTitle: string; subTitle: string; unit: string }) =>
    exportChart(chartDonoutRef, data);

  const selectedfilter = `${getLabel(divisionLevel, 'Division')} & ${getLabel(transportType, 'Type')} for ${!isCompanyEnable(loginDetails?.data, companySlug?.demo) ? getLabel(pId, "Period") : ""} ${yearlyData?.label}`;

  return (
    <section data-testid="fuel-report-view" className='scopeOneDashboard py-2 pb-4'>
      <TitleComponent title={"Scope 1 | Fuels Report"} pageHeading={`${params?.fuelType ?? "Fuels"} Report`} />
      <div className='border-bottom px-2 select-box flex-wrap d-flex gap-2 pb-3 mb-3'>
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
            setDivisionLevel({ label: "All Divisions", value: "" })
            setTransportType({ label: "All Types", value: "" })
            setPageNumber(1);
            if (isFilterApplied?.isFilterApplied) {
              handleResetTable()
            }
          }}
        />
        {!isCompanyEnable(loginDetails?.data, companySlug?.demo) && <><SelectDropdown
          aria-label="period-dropdown"
          disabled={isLoadingFuelFilters}
          options={getDropDownOptions(fuelReportFilterData?.data?.periods, "period_name", "id", "All Periods")}
          placeholder={t('period')}
          selectedValue={pId}
          onChange={(e: any) => {
            setPId(e);
            setDivisionLevel({ label: "All Divisions", value: "" })
            setTransportType({ label: "All Types", value: "" })
            setPageNumber(1);
            if (isFilterApplied?.isFilterApplied) {
              handleResetTable()
            }
          }}
        />
          <SelectDropdown
            aria-label="divison-dropdown"
            disabled={isLoadingFuelFilters}
            options={getDropDownOptions(fuelReportFilterData?.data?.divisions, "division_name", "id", "All Divisions")}
            placeholder={t('division')}
            selectedValue={divisionLevel}
            onChange={(e: any) => {
              setDivisionLevel(e);
              setTransportType({ label: "All Types", value: "" })
              setPageNumber(1);
              if (isFilterApplied?.isFilterApplied) {
                handleResetTable()
              }
            }}
          />
          <SelectDropdown
            aria-label="transport-dropdown"
            disabled={isLoadingFuelFilters}
            options={getDropDownOptions(fuelReportFilterData?.data?.transports, "transport_name", "id", "All Types", "", true)}
            placeholder="All Types"
            customClass="vehicleDropdown"
            selectedValue={transportType}
            onChange={(e: any) => {
              setTransportType(e);
              setPageNumber(1);
              if (isFilterApplied?.isFilterApplied) {
                handleResetTable()
              }
            }}
          /></>}
      </div>
      <div className='reagion-card px-2'>
        <Row className="g-3">
          <Col md="4">
            <SustainViewCard
              isLoading={isLoadingFuelMatrics || isLoadingFuelFilters}
              cardValue={formatNumber(true, fuelReportMatricsData?.data?.total_ghg_emissions, 2)}
              imagePath="/images/emission-icon-bold.svg"
              cardDate={t('ghgEmissions')}
              cardSubHeading={t('tco2eUnit')}
            />
          </Col>
          <Col md="4">
            <SustainViewCard
              isLoading={isLoadingFuelMatrics || isLoadingFuelFilters}
              imagePath={"/images/fuel-icon-bold.svg"}
              cardDate={`${t('fuelConsumption')} by Type`}
              cardSubHeading={t('gallons')}
              className={"cards"}
            >
              <div className='d-flex gap-2 pt-2 align-items-start flex-column co-txt justify-content-start border-top w-100'>
                {fuelReportMatricsData?.data?.fuelConsumption?.map((el: any) => (
                  <h6 key={el?.id} className='mb-0 titleMain'><span className='matrix-value'>{el?.transport_name}</span>: {formatNumber(true, el?.fuel_consumption, 2)}</h6>
                ))}
              </div>
            </SustainViewCard>
          </Col>
          <Col md="4">
            <SustainViewCard
              isLoading={isLoadingFuelMatrics || isLoadingFuelFilters}
              imagePath={"/images/emission-icon-bold.svg"}
              cardDate="Emissions by Type"
              className='cards'
              cardSubHeading={t('tco2eUnit')}
            >
              <div className='d-flex gap-2 pt-2 align-items-start flex-column co-txt justify-content-start border-top w-100'>
                {fuelReportMatricsData?.data?.emissionByType?.map((el: any) => (
                  <h6 key={el?.id} className='mb-0 titleMain'><span className='matrix-value'>{el?.transport_name}</span>: {formatNumber(true, el?.emissions, 2)}</h6>
                ))}
              </div>
            </SustainViewCard>
          </Col>
          <FuelTrackerCard
            title={`Fuel Consumption by ${selectedfilter}`}
            subTitle={`Total Fuel Consumption by Fuel Type`}
            isLoading={isLoadingFuelConsumption || isLoadingFuelFilters}
            data={normalizedList(fuelConsumptionData?.data?.data)}
            yTitle={`${t('fuelConsumption')} (${t('gallons')})`}
            xTitle='Fuel Types'
            unit={`(${t('gallons')})`}
          />
          <FuelTrackerCard
            title={`Emissions by ${selectedfilter}`}
            subTitle={`Total Emissions by Fuel Type`}
            isLoading={isLoadingFuelEmission || isLoadingFuelFilters}
            data={normalizedList(fuelEmissionData?.data?.data)}
            yTitle={`Emissions (${t('tco2eUnit')})`}
            xTitle='Fuel Types'
            unit={`(${t('tco2eUnit')})`}
            barColor={styles.orange}
          />
          {!isCompanyEnable(loginDetails?.data, companySlug?.demo) && <><Col lg="6">
            <LineChart
              filterHeading={`Fuel Consumption by ${selectedfilter}`}
              chartHeading="Total Fuel Consumption by Fuel Type"
              unit={`(${t('gallons')})`}
              loading={isLoadingFuelConsumptionByPeriod || isLoadingFuelFilters}
              data={fuelConsumptionByPeriodData?.data}
              yTitle={`${t('fuelConsumption')} (${t('gallons')})`}
              xKey="periods"
              testId="exportLineChart"
            />
          </Col>
            <Col lg="6">
              <LineChart
                filterHeading={`Emissions by ${selectedfilter}`}
                chartHeading="Total Emissions by Fuel Type"
                unit={`(${t('tco2eUnit')})`}
                loading={isLoadingFuelEmissionByPeriod || isLoadingFuelFilters}
                data={fuelEmissionByPeriodData?.data}
                yTitle={`${t('emissions')} (${t('tco2eUnit')})`}
                xKey="periods"
                testId="exportLineChart1"
              />
            </Col>
          </>}
          <Col md="6">
            <div className='mainGrayCards h-100'>
              <div className='d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4'>
                <div>
                  <Heading level="6" className="fw-medium font-14 mb-1" content={`Fuel Consumption by ${selectedfilter}`} />
                  <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">Total Fuel Consumption by Division <span className='fw-medium font-xxl-14 font-12'>(In Percentage)</span></Heading>
                </div>
                <button data-testid="exportDonutChart" type="button" className="btn btn-transparent download-img p-0" onClick={() => exportDonutChart({
                  mainTitle: `Fuel Consumption by ${selectedfilter}`,
                  subTitle: "Total Fuel Consumption by Division",
                  unit: "(In Percentage)"
                })}><span><ImageComponent path="/images/download.svg" /></span></button>
              </div>
              <div className='p-3'>
                <ChartHighChart
                  options={donutchart({
                    options: consumptionByDivisionData?.data,
                    dataKey: "value",
                    donutInnerTitle: "Consumption by <br /> Division",
                    enableDownload: false
                  })}
                  constructorType=""
                  isLoading={isLoadingConsumptionByDivision || isLoadingFuelFilters}
                  database={consumptionByDivisionData?.data?.length > 0}
                  chartComponentRef={chartDonoutRef}
                />
              </div>
            </div>
          </Col>
          <Col md="6">
            <div className='mainGrayCards h-100'>
              <div className='d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4 '>
                <div>
                  <Heading level="6" className="fw-medium font-14 mb-1" content={`Emissions by ${selectedfilter}`} />
                  <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">Total Emissions by Division <span className='fw-medium font-xxl-14 font-12'>(In Percentage)</span></Heading>
                </div>
                <button data-testid="exportDonutChart1" type="button" className="btn btn-transparent download-img p-0" onClick={() => exportDonutChart({
                  mainTitle: `Emissions by ${selectedfilter}`,
                  subTitle: "Total Emissions by Division",
                  unit: "(In Percentage)"
                })}><span><ImageComponent path="/images/download.svg" /></span></button>
              </div>
              <div className='p-3'>
                <ChartHighChart
                  options={donutchart({
                    options: emissionsByDivisionData?.data,
                    dataKey: "value",
                    donutInnerTitle: "Emissions by <br /> Division",
                    enableDownload: false
                  })}
                  constructorType=""
                  isLoading={isLoadingEmissionsByDivision || isLoadingFuelFilters}
                  database={emissionsByDivisionData?.data?.length > 0}
                  chartComponentRef={chartDonoutRef}
                />
              </div>
            </div>
          </Col>
          {!isCompanyEnable(loginDetails?.data, companySlug?.demo) && <>
            <Col md="12">
              <div className='mainGrayCards h-100'>
                <div className='border-bottom p-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2'>
                  <div>
                    <Heading level="6" className="fw-medium font-14 mb-1" content={`${selectedfilter}`} />
                    <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{t('transactionDetail')}</Heading>
                  </div>
                  <div className='d-flex flex-wrap gap-1 align-items-center select-box'>
                    {filterOptions.map(({ key, placeholder, ariaLabel }) => (
                      <SelectDropdown
                        key={key}
                        placeholder={placeholder}
                        aria-label={ariaLabel}
                        isSearchable
                        selectedValue={selectedFilters[key as keyof SelectedFilters]} // Fix TypeScript error
                        onChange={(e: FilterOption) => {
                          if (!e.value) {
                            handleSearchFilters(key, "");
                          }
                          setSelectedFilters((prev: any) => ({ ...prev, [key]: e }));
                        }}
                        customClass="vehicleDropdown"
                        onInputChange={(inputValue: string, { action }: { action: string }) => {
                          if (action === "input-change") handleSearchFilters(key, inputValue);
                        }}
                        options={getDropDownOptions(transactionFilterData?.[key], "name", "id", initialTransactionFilter[key as keyof SelectedFilters]?.label, "", false)}
                      />
                    ))}

                    <ButtonComponent
                      text={t('apply')}
                      data-testid="apply-filter-btn"
                      btnClass="btn-deepgreen font-14 px-4 py-1"
                      disabled={isLoadingTransactionList || isLoadingTransactionFilter}
                      onClick={() => {
                        setIsFilterApplied({ ...selectedFilters, isFilterApplied: true });
                        setPageNumber(1)
                      }}
                    />
                    <ButtonComponent
                      text={t('reset')}
                      data-testid="reset-filter-btn"
                      btnClass="btn-reset font-14 px-4 py-1"
                      disabled={isLoadingTransactionList || isLoadingTransactionFilter || !isFilterApplied?.isFilterApplied}
                      onClick={handleResetTable}
                    />
                  </div>
                </div>
                <div className="static-table">
                  <table>
                    <TableHead
                      handleClickColumn={handleClickColumn} col_name={col_name} order={order}
                      columns={[
                        { key: "location", label: "Location", isSorting: true },
                        { key: "division", label: "Division", isSorting: true },
                        { key: "business", label: "Business Unit", isSorting: true },
                        { key: "market", label: "MU Name", isSorting: false },
                        { key: "company", label: "Company Name", isSorting: false },
                        { key: "transactions", label: "Transaction Description", isSorting: false },
                        { key: "fuel", label: "Fuel Type", isSorting: false },
                        { key: "total_fuel_consumption", label: "Fuel Consumption", unit: "(Gallons)", isSorting: true },
                      ]} />
                    <TableBodyLoad colSpan={8} noDataMsg={`${t('noRecord')}`} isLoading={isLoadingTransactionList} isData={transactionListData?.data?.list?.length > 0}>
                      <tbody>
                        {normalizedList(transactionListData?.data?.list)?.map((data: any) => (
                          <tr key={data.transactionLocation}>
                            <td>{data.location}</td>
                            <td>{data.division}</td>
                            <td>{data.business}</td>
                            <td>{data.market}</td>
                            <td>{data.company}</td>
                            <td>{data?.transactions ?? "N/A"}</td>
                            <td>{data?.fuel}</td>
                            <td className="w-auto">{formatNumber(true, data.total_fuel_consumption, 2)}</td>
                          </tr>))}
                      </tbody>
                    </TableBodyLoad>
                  </table>
                </div>
                <div className='text-end w-100 pb-3'>
                  <Pagination
                    currentPage={pageNumber}
                    pageSize={pageSize}
                    total={transactionListData?.data?.pagination?.total_count}
                    handlePageSizeChange={(e: any) => {
                      setPageSize(e);
                      setPageNumber(1)
                    }}
                    handlePageChange={(page: number) => {
                      setPageNumber(page)
                    }}
                  />
                </div>

              </div>
            </Col>
            <Col md="12">
              <MapComponent isLoading={isLoadingTransactionLocation} showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>
                <FuelStopMap page="fuelReport" containerStyle={mapStyles} fuelStopData={normalizedList(transactionLocationData?.data)} />
              </MapComponent>
            </Col></>}
      </Row>
    </div>
    </section >
  )
}

export default FuelReportView