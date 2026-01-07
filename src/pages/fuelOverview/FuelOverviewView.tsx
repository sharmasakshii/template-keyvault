import { Row, Col } from "reactstrap";
import FuelOverviewController from './fuelOverviewController';
import { formatNumber, checkRolePermission, getQuarterName, getRegionName, checkedNullValue, formatUnit } from "utils";
import TitleComponent from "component/tittle";
import ChartHighChart from "component/highChart/ChartHighChart";
import { emissionsIntensityCompareChart } from "utils/highchart/emissionsIntensityCompareChart";
import DataSource from "component/aboutLink";
import Heading from "component/heading";
import SustainViewCard from "component/cards/sustainabilityTracker";
import GraphStatusBar from "component/graphStatusBar";
import DateShow from "component/DateShow";
import ManagerDetailOverviewCard from "component/cards/manager";
import PerformanceHeading from "component/PerfomanceHeading"
import LaneBreakdown from "component/laneBreakdown"
import EmissionsIntensityTable from "component/EmissionsIntensity"

const FuelOverviewView = (props: any) => {

  const {
    emissionDates,
    dataCheck,
    fuelOverviewDto,
    fuelLaneBreakdown,
    fuelLaneBreakdownLoading,
    fuelOverviewDtoLoading,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    handleChangeOrderCarrier,
    colName,
    orderCarrier,
    fuelCarrierEmissionTableDtoLoading,
    navigate,
    backLinkUrl,
    backBtnTitle,
    fuelCarrierEmissionTableDto,
    regionalId,
    regions,
    loginDetails,
    configConstants,
    t
  } = FuelOverviewController(props);
  const { pageTitle, overViewType } = props

  const nameKey = `${overViewType}.name`
  const defaultUnit = configConstants?.data?.default_distance_unit
  return (
    <>
      {/* Title Component for the page */}
      <TitleComponent
        title={`${pageTitle} Overview`}
        pageHeading={fuelLaneBreakdown?.data?.responseData?.headerName && `${fuelLaneBreakdown?.data?.responseData?.headerName?.name} ${pageTitle} Overview`}
      />
      <section className="carrierOverview-screen pb-4" data-testid={`${props.overViewType}-view`}>
        {/* Main content section */}
        <div className="carrierOverview-screen-wraper">
          <div className="carrierOverview-section px-2">
            <div className="mb-3 border-bottom pb-2">
              <ManagerDetailOverviewCard
                backBtnTestId="back-button-carrier"
                yearDropDownOverviewId="year-drop-down-carrierOverview"
                quarterDropDownOverviewId="quarter-drop-down-carrierOverview"
                regionEmissionId="region-drop-down-carrierOverview"
                showManger={false}
                backBtnTxt={`Back to ${backBtnTitle()}`}
                backBtnLink={backLinkUrl()}
                showDropdown={true}
                userRole={dataCheck?.userdata?.role}
                onChangeYear={(e: any) => {
                  setYearlyData(Number(e.value));
                  setQuarterDetails(1);
                }}
                onChangeYearQuarter={(e: any) => {
                  setQuarterDetails(e.value);
                }}
                disabledYear={fuelOverviewDtoLoading}
                disabledQuarter={fuelOverviewDtoLoading}
                yearlyData={yearlyData}
                quarterDetails={quarterDetails}
              />
            </div>

            <Row className="g-3">
              <Col md="4">
                <SustainViewCard
                  testid={"card-1"}
                  isLoading={fuelOverviewDtoLoading}
                  cardValue={formatNumber(true, fuelOverviewDto?.data?.responseData?.intensity, 1)}
                  cardDate="Emissions Intensity"
                  cardSubHeading={`${t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) })}`}
                  imagePath="/images/emissions-new-icon.svg"
                />
              </Col>
              <Col md="4">
                <SustainViewCard
                  testid={"card-2"}
                  isLoading={fuelOverviewDtoLoading}
                  cardValue={formatNumber(true, fuelOverviewDto?.data?.responseData?.vendorEmissionData?.emissions, 2)}
                  cardDate="Total Emissions"
                  cardSubHeading="tCO2e"
                  imagePath="/images/emissions-new-icon.svg"
                />
              </Col>
              <Col md="4">
                <SustainViewCard
                  testid={"card-3"}
                  isLoading={fuelOverviewDtoLoading}
                  cardValue={formatNumber(true, fuelOverviewDto?.data?.responseData?.vendorEmissionData?.shipment_count, 0)}
                  cardDate="Total Shipments"
                  imagePath="/images/shipment-new-icon.svg"
                />
              </Col>
            </Row>
            <div className="d-flex gap-3 my-3 align-items-center">
              <DateShow dateInfo={emissionDates?.data?.emission_dates} isActive={true} />
            </div>
            <Row className="g-3">
              <Col lg="6">
                <div className="px-3 mainGrayCards py-3 h-100">
                  <Heading
                    level="6"
                    className="fw-semibold mb-1 font-14"
                    content={`${getRegionName(regions, regionalId)}, ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                  />
                  <Heading
                    level="4"
                    content={`Emissions Intensity Overview`}
                    className="fw-semibold font-xxl-20 font-16 mb-2"
                    spanText={`(${t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) })})`}
                  />
                  <div className="my-3">
                    <GraphStatusBar
                      database={fuelOverviewDto?.data?.responseData?.vendorEmissionData}
                      condition={
                        fuelOverviewDto &&
                        ((fuelOverviewDto?.data?.responseData?.intensity -
                          fuelOverviewDto?.data?.responseData?.max) /
                          fuelOverviewDto?.data?.responseData
                            ?.intensity) *
                        100 <
                        0
                      }
                      content={`${fuelOverviewDto?.data?.responseData?.vendorEmissionData?.[nameKey]} Emissions intensity is 
                      ${Math.abs(
                        Math.round(
                          ((Number.parseFloat(
                            fuelOverviewDto?.data?.responseData
                              ?.intensity
                          ) -
                            Number.parseFloat(
                              fuelOverviewDto?.data?.responseData?.max
                            )) /
                            Number.parseFloat(
                              fuelOverviewDto?.data?.responseData
                                ?.intensity
                            )) *
                          100
                        )
                      )}
                      % /status/ than average of all carriers emissions
                      intensity.`}
                    />
                  </div>
                  <div>
                    <ChartHighChart
                      testId="high-chart-carrier-overview-emission-intensity"
                      options={emissionsIntensityCompareChart({
                        chart: "optionCarrierOverview",
                        reloadData: true,
                        name: fuelOverviewDto?.data?.responseData?.vendorEmissionData?.[nameKey],
                        baseLine: fuelOverviewDto?.data?.responseData?.baseLine,
                        industrialAverage: fuelOverviewDto?.data?.responseData?.industrialAverage,
                        options: fuelOverviewDto?.data?.responseData?.data || [],
                        carrierName: `All ${pageTitle}`
                      })}
                      constructorType=""
                      isLoading={fuelOverviewDtoLoading}
                      database={fuelOverviewDto?.data?.responseData?.vendorEmissionData}
                    />
                  </div>
                </div>
              </Col>
              {!checkRolePermission(dataCheck?.userdata, "regionalManager") && (

                <Col lg="6">
                  <div className="mainGrayCards h-100">
                    <div className="regionWiseTxt">
                      <div className="p-3">
                        <Heading
                          level="6"
                          className="mb-1 laneBreakdownHeading font-14 font-xxl-20 fw-semibold"
                        > {getQuarterName(loginDetails, quarterDetails, yearlyData)} {yearlyData}</Heading>
                        <Heading
                          level="6"
                          content={`Regional Emissions`}
                          className="mb-3 laneBreakdownHeading font-14 font-xxl-20 fw-semibold"
                        ></Heading>
                        <PerformanceHeading />
                      </div>
                      <EmissionsIntensityTable
                        order={orderCarrier}
                        nameKey="Region.name"
                        colName={colName}
                        handleChangeOrder={handleChangeOrderCarrier}
                        loadingTableData={fuelCarrierEmissionTableDtoLoading}
                        emissionList={fuelCarrierEmissionTableDto?.data}
                        colLabel="Regions"
                        configConstants={defaultUnit}
                        navigateLink={(row: any) => {
                          navigate(
                            `/scope3/region-overview/${row?.['Region.name']
                            }/${yearlyData}/${checkedNullValue(quarterDetails)
                            }`
                          )
                        }}
                      />

                    </div>
                  </div>
                </Col>)}
              <Col lg="12">
                <LaneBreakdown
                  heading={`${getRegionName(regions, regionalId)}, ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                  laneBreakdownIsLoading={fuelLaneBreakdownLoading}
                  contributorList={fuelLaneBreakdown?.data?.responseData?.contributor
                    ?.filter((i: any) => i?.total_intensity !== null)
                  }
                  detractorList={fuelLaneBreakdown?.data?.responseData?.detractor
                    ?.filter((i: any) => i?.total_intensity !== null)
                  }
                  totalShipment={fuelOverviewDto?.data
                    ?.responseData?.vendorEmissionData
                    ?.shipment_count}
                  defaultUnit={defaultUnit}
                />

              </Col>
            </Row>
            <DataSource />
          </div>
        </div>
      </section>
    </>
  );
};

export default FuelOverviewView;
