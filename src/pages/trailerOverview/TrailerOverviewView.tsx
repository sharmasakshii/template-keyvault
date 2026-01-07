import { Row, Col } from "reactstrap";
import TrailerOverviewController from './trailerOverviewController';
import { formatNumber, checkRolePermission, getQuarterName, checkedNullValue, formatUnit } from "utils";
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

const TrailerOverviewView = (props: any) => {

  const {
    emissionDates,
    configConstants,
    dataCheck,
    trailerOverviewDto,
    trailerLaneBreakdown,
    trailerLaneBreakdownLoading,
    trailerOverviewDtoLoading,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    handleChangeOrderCarrier,
    colName,
    orderCarrier,
    trailerCarrierEmissionTableDtoLoading,
    navigate,
    backBtnTitle,
    trailerCarrierEmissionTableDto,
    loginDetails,
    t
  } = TrailerOverviewController(props);
  const { pageTitle } = props
  const defaultUnit = configConstants?.data?.default_distance_unit;
  return (
    <>
      {/* Title Component for the page */}
      <TitleComponent
        title={`${pageTitle} Overview`}
        pageHeading={trailerLaneBreakdown?.data?.responseData?.headerName && `${trailerLaneBreakdown?.data?.responseData?.headerName?.name} ${pageTitle} Overview`}
      />
      <section
        className="carrierOverview-screen pb-4"
        data-testid="trailer-overiew-screen-view"
      >
        {/* Main content section */}
        <div className="carrierOverview-screen-wraper">
          <div className="carrierOverview-section py-2 pt-0 px-2">
            <Row className="g-3">
              <Col lg="12">
              <div className="mb-3 border-bottom pb-2">
                  <ManagerDetailOverviewCard
                    backBtnTestId="back-button-trailer"
                    yearDropDownOverviewId="year-drop-down-trailer"
                    quarterDropDownOverviewId="quarter-drop-down-trailer"
                    regionEmissionId="region-drop-down-trailer"
                    showManger={false}
                    backBtnTxt={`Back to ${backBtnTitle()}`}
                    backBtnLink="scope3/trailer"
                    showDropdown={true}
                    userRole={dataCheck?.userdata?.role}
                    onChangeYear={(e: any) => {
                      setYearlyData(Number(e.value));
                      setQuarterDetails(1);
                    }}
                    onChangeYearQuarter={(e: any) => {
                      setQuarterDetails(e.value);
                    }}
                    disabledYear={trailerOverviewDtoLoading}
                    disabledQuarter={trailerOverviewDtoLoading}
                    yearlyData={yearlyData}
                    quarterDetails={quarterDetails}
                  />
                </div>


                  <div className="reagionCards">
                    <Row className="g-3">
                      <Col md="4">
                        <SustainViewCard
                          testid={"card-1"}
                          isLoading={trailerOverviewDtoLoading}
                          cardValue={formatNumber(true, trailerOverviewDto?.data?.responseData?.intensity, 1)}
                          cardDate="Emissions Intensity"
                         cardSubHeading={`${t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) })}`}
                          imagePath="/images/emissions-new-icon.svg"
                        />
                      </Col>
                      <Col md="4">
                        <SustainViewCard
                          testid={"card-2"}
                          isLoading={trailerOverviewDtoLoading}
                          cardValue={formatNumber(true, trailerOverviewDto?.data?.responseData?.vendorEmissionData?.emissions, 2)}
                          cardDate="Total Emissions"
                          cardSubHeading="tCO2e"
                           imagePath="/images/emissions-new-icon.svg"
                        />
                      </Col>
                      <Col md="4">
                        <SustainViewCard
                          testid={"card-3"}
                          isLoading={trailerOverviewDtoLoading}
                          cardValue={formatNumber(true, trailerOverviewDto?.data?.responseData?.vendorEmissionData?.shipment_count, 0)}
                          cardDate="Total Shipments"
                           imagePath="/images/shipment-new-icon.svg"
                        />
                      </Col>
                    </Row>
                    <div className="d-flex gap-3 mt-3 align-items-center">
                      <DateShow dateInfo={emissionDates?.data?.emission_dates} isActive={true} />
                    </div>
                  </div>

              </Col>
              <Col lg="6">
                <div className="px-3 mainGrayCards py-3 h-100">
                  <Heading
                    level="6"
                    className="fw-medium font-14"
                    content={`${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                  />
                  <Heading
                    level="4"
                    content={`Emissions Intensity Overview`}
                    className="fw-semibold font-xxl-20 font-16 mb-2"
                    spanText={`(${t("gco2eUnit", { unit: formatUnit(defaultUnit) })})`}
                  />
                  <div className="my-3">
                    <GraphStatusBar
                      database={trailerOverviewDto?.data?.responseData?.vendorEmissionData}
                      condition={
                        trailerOverviewDto &&
                        ((trailerOverviewDto?.data?.responseData?.intensity -
                          trailerOverviewDto?.data?.responseData?.max) /
                          trailerOverviewDto?.data?.responseData
                            ?.intensity) *
                        100 <
                        0
                      }
                      content={`${trailerOverviewDto?.data?.responseData?.vendorEmissionData?.["TrailerType.name"]
                        } Emissions intensity is 
                      ${Math.abs(
                          Math.round(
                            ((Number.parseFloat(
                              trailerOverviewDto?.data?.responseData
                                ?.intensity
                            ) -
                              Number.parseFloat(
                                trailerOverviewDto?.data?.responseData?.max
                              )) /
                              Number.parseFloat(
                                trailerOverviewDto?.data?.responseData
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
                        name: trailerOverviewDto?.data?.responseData?.vendorEmissionData?.["TrailerType.name"],
                        baseLine: trailerOverviewDto?.data?.responseData?.baseLine,
                        industrialAverage: trailerOverviewDto?.data?.responseData?.industrialAverage,
                        options: trailerOverviewDto?.data?.responseData?.data || [],
                        carrierName: `All ${pageTitle}`
                      })}
                      constructorType=""
                      isLoading={trailerOverviewDtoLoading}
                      database={trailerOverviewDto?.data?.responseData?.vendorEmissionData}
                    />
                  </div>
                </div>
              </Col>
              {!checkRolePermission(dataCheck?.userdata, "regionalManager") && (

                <Col lg="6">
                  <div className="mainGrayCards h-100">
                    <div className="regionWiseTxt">
                      <div className="p-2 p-xxl-3">
                        <Heading
                          level="6"
                          className="mb-3 laneBreakdownHeading font-14 font-xxl-20 fw-semibold"
                        > {getQuarterName(loginDetails, quarterDetails, yearlyData)} {yearlyData}</Heading>
                        <Heading
                          level="6"
                          content={`Regional Emissions`}
                          className="mb-3  laneBreakdownHeading font-14 font-xxl-20 fw-semibold"
                        ></Heading>
                        <PerformanceHeading />
                      </div>
                      <EmissionsIntensityTable
                        order={orderCarrier}
                        nameKey="Region.name"
                        colName={colName}
                        handleChangeOrder={handleChangeOrderCarrier}
                        loadingTableData={trailerCarrierEmissionTableDtoLoading}
                        emissionList={trailerCarrierEmissionTableDto?.data}
                        colLabel="Regions"
                        configConstants={configConstants?.data?.default_distance_unit}
                        navigateLink={(row: any) => {
                          navigate(
                            `/scope3/region-overview/${row?.["Region.name"]
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
                  heading={`${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                  laneBreakdownIsLoading={trailerLaneBreakdownLoading}
                  contributorList={trailerLaneBreakdown?.data?.responseData?.contributor
                    ?.filter((i: any) => i?.total_intensity !== null)
                  }
                  detractorList={trailerLaneBreakdown?.data?.responseData?.detractor
                    ?.filter((i: any) => i?.total_intensity !== null)
                  }
                  totalShipment={trailerOverviewDto?.data
                    ?.responseData?.vendorEmissionData
                    ?.shipment_count}
                  defaultUnit={configConstants?.data?.default_distance_unit}
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

export default TrailerOverviewView;
