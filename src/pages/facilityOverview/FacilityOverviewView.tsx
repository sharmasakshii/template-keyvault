import DataSource from "../../component/aboutLink/index";
import TitleComponent from "../../component/tittle";
import { Row, Col } from "reactstrap";
import FacilityOverviewController from "./facilityOverviewController";
import ChartHighChart from "../../component/highChart/ChartHighChart";
import { laneColumnChart } from "../../utils/highchart/laneColumnChart";
import { facilityComparisonGraph } from "../../utils/highchart/facilityComparisonGraph";
import { rgpChart } from "utils/highchart/rgpChart";
import Heading from "../../component/heading";
import ManagerDetailOverviewCard from "component/cards/manager";
import RGPGraph from "component/charts/rgpGraph";
import {
  formatNumber,
  showSign,
  getUnitSign,
  getMaxValue,
  checkName,
  getRegionName,
  getQuarterName,
  formatUnit,
  formatTransportUnit
} from "utils";
import ChartColumn from "component/charts/chartColumn";
import SustainViewCard from "component/cards/sustainabilityTracker";
import GraphStatusBar from "component/graphStatusBar";
import styles from '../../scss/config/_variable.module.scss'
import DateShow from "component/DateShow";
import { useTranslation } from "react-i18next";
const FacilityOverviewView = () => {

  // Importing all states and functions from Facility Controller
  const {
    setYearlyData1,
    setReloadData,
    setCheckedEmissionsReductionGlide,
    handleBoundsOpen,
    setCheckedInBound,
    setCheckedOutBound,
    handleEmissionOpen,
    setCheckedEmissions,
    setChecked,
    yearlyData1,
    emissionDates,
    facilityOverviewDetailDto,
    facilityReductionGraphDto,
    checkedEmissionsReductionGlide,
    facilityReductionGraphLoading,
    facilityComparisonGraphLoading,
    facilityComparisonGraphDto,
    showBounds,
    checkedInBound,
    checkedOutBound,
    facilityInBoundDto,
    facilityInBoundLoading,
    facilityOutBoundLoading,
    facilityOutBoundDto,
    laneCarrierInBoundArr,
    laneCarrierOutBoundArr,
    showEmission,
    checkedEmissions,
    facilityCarrierComparisonData,
    facilityCarrierComparisonloading,
    laneCarrierArr,
    checked,
    facilityGraphDetailsDto,
    facilityGraphDetailsLoading,
    lanePageArr,
    reloadData,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    facilityOverviewDetailLoading,
    regionalId,
    regions,
    params,
    loginDetails,
    configConstants
  } = FacilityOverviewController();
  const { t } = useTranslation()

  const defaultUnit = configConstants?.data?.default_distance_unit

  return (
    <>
      <TitleComponent
        title={"Facility Overview"}
        pageHeading={`${checkName(
          facilityOverviewDetailDto?.data?.facility?.name
        )} ${t('facilityOvr')}`}
      />
      <section
        className="facilityOverview-screen pb-4"
        data-testid="facility-overview"
      >
        <div className="facilityOverview-screen-wraper">
          <div className="facilityOverview-section p-2">
            <div className="mb-3 border-bottom pb-1">
              <ManagerDetailOverviewCard
                summaryHeading={`${checkName(
                  facilityOverviewDetailDto?.data?.facility?.name
                )} ${t('facilityTitle')}`}
                projectHolder={t('projectMngr')}
                managerName={
                  facilityOverviewDetailDto?.data?.facility?.name
                }
                backBtnTxt={`${t('back')} to ${t('facility')}`}
                backBtnTestId="back-button-facility"
                yearDropDownOverviewId="year-drop-down-facilityOverview"
                quarterDropDownOverviewId="quarter-drop-down-facilityOverview"
                backBtnLink={`scope3/facility`}
                title="dispatch manager"
                showDropdown={true}
                onChangeYear={(e: any) => {
                  setYearlyData(Number(e.value));
                  setYearlyData1(Number(e.value))
                  setQuarterDetails(Number(params?.quarters));
                  setReloadData(false);
                }}

                onChangeYearQuarter={(e: any) => {
                  setQuarterDetails(e.value);
                  setReloadData(false);

                }}
                disabledYear={facilityOverviewDetailLoading}
                disabledQuarter={facilityOverviewDetailLoading}
                yearlyData={yearlyData}
                quarterDetails={quarterDetails}
                isWeekDropdownShow={false}
              />
            </div>
              <Row className="g-3">
                <Col md="4">
                  <SustainViewCard
                    testid={"card-1"}
                    isLoading={facilityOverviewDetailLoading}
                    cardValue={formatNumber(true, facilityOverviewDetailDto?.data?.intensity, 1)}
                    cardDate={t('emissionIntensityHeading')}
                    cardSubHeading={`${t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) })}`}
                  
                    imagePath="/images/emissions-new-icon.svg"
                  />
                </Col>
                <Col md="4">
                  <SustainViewCard
                    testid={"card-2"}
                    isLoading={facilityOverviewDetailLoading}
                    cardValue={formatNumber(true, facilityOverviewDetailDto?.data?.emission, 2)}
                    cardDate={t('totalEmissionHeading')}
                    cardSubHeading={t('tco2eUnit')}
                    imagePath="/images/emissions-new-icon.svg"
                  />
                </Col>
                <Col md="4">
                  <SustainViewCard
                    testid={"card-3"}
                    isLoading={facilityOverviewDetailLoading}
                    cardValue={formatNumber(true, facilityOverviewDetailDto?.data?.shipment_count, 0)}
                    cardDate={t('totalShipmentHeading')}
                    imagePath="/images/shipment-new-icon.svg"
                  />
                </Col>
              </Row>
              <div className="d-flex gap-3 my-3 align-items-center">
                <DateShow dateInfo={emissionDates?.data?.emission_dates} isActive={true} />
              </div>
            <Row className="g-3">
              <Col lg="6" className="mb-3">
                <RGPGraph
                  yearlyData1={yearlyData1}
                  setYearlyData1={setYearlyData1}
                  emissionIntensityToggleId="emission-intensity-toggle"
                  totalEmissionToggleId="total-emission-toggle"
                  graphSubHeading={`${facilityOverviewDetailDto?.data?.facility?.name} for ${getRegionName(regions, regionalId)} ${yearlyData} to ${Number(yearlyData1) + 1}`}
                  graphHeading={t('reductionTitle')}
                  headingUnit={`(${getUnitSign(
                    !checkedEmissionsReductionGlide, defaultUnit
                  )})`}
                  checked={checkedEmissionsReductionGlide}
                  isLoading={facilityReductionGraphLoading}
                  emissionDates={emissionDates}
                  dataArr={facilityReductionGraphDto}
                  setReloadData={setReloadData}
                  setChecked={setCheckedEmissionsReductionGlide}
                  options={rgpChart({
                    key: 1,
                    chart: "emissionReductionFacility",
                    isChecked: checkedEmissionsReductionGlide,
                    options: facilityReductionGraphDto?.data,
                    regionName: `${facilityOverviewDetailDto?.data?.facility?.name} Facility`,
                    reloadData: reloadData,
                    maxRegionsValue: getMaxValue(
                      facilityReductionGraphDto?.data?.region_level
                    ),
                    label: [
                      {
                        name: `${facilityOverviewDetailDto?.data?.facility?.name} Target/Q`,
                        key: "targer_level",
                        color: (styles.secondaryBlue),
                      },
                      {
                        name: `${facilityOverviewDetailDto?.data?.facility?.name} Facility`,
                        key: "facility_level",
                        color: (styles.primary),
                      },
                    ],
                  })}
                />
              </Col>
              <Col lg="6" className="mb-3">
                <div className="mainGrayCards p-3 h-100 slider-icons position-relative">
                  <div className="emi-inten">
                    <Heading level="6" className="fw-semibold mb-1">
                      {facilityOverviewDetailDto?.data?.facility?.name} for {" "} {getRegionName(regions, regionalId)}
                      {" "} {getQuarterName(loginDetails, quarterDetails, yearlyData)} {yearlyData}
                    </Heading>

                    <div className="d-flex align-items-end margin-b">
                      <Heading
                        level="4"
                        content={t('facilityEmissions')}
                        className="fw-semibold font-xxl-20 font-16 mb-2"
                        spanText={`(gCO2e/Ton-${formatUnit(defaultUnit)})`}
                      />
                    </div>
                    <div className="my-3">
                      <GraphStatusBar database={facilityComparisonGraphDto} condition={facilityComparisonGraphDto && ((facilityComparisonGraphDto?.data?.responseData
                        ?.intensity -
                        facilityComparisonGraphDto?.data?.responseData
                          ?.industrialAverage) /
                        facilityComparisonGraphDto?.data?.responseData
                          ?.intensity) *
                        100 <
                        0}
                        content={`Your emissions intensity per ${formatTransportUnit(defaultUnit)} is ${Math.abs(
                          Math.round(
                            ((facilityComparisonGraphDto?.data?.responseData
                              ?.intensity -
                              facilityComparisonGraphDto?.data?.responseData
                                ?.industrialAverage) /
                              facilityComparisonGraphDto?.data?.responseData
                                ?.intensity) *
                            100
                          )
                        )}
                      % /status/ than industry average.`}
                      />
                    </div>
                    <ChartHighChart
                      testId="high-chart-emission-intensity"
                      options={facilityComparisonGraph({
                        isLoading: facilityComparisonGraphLoading,
                        reloadData: reloadData,
                        chart: "facilityComparison",
                        options: facilityComparisonGraphDto?.data?.responseData,
                        revenueType: 1,
                        facilityName:
                          facilityOverviewDetailDto?.data?.facility?.name,
                      })}
                      constructorType=""
                      isLoading={facilityComparisonGraphLoading}
                      database={facilityComparisonGraphDto}
                    />

                  </div>
                </div>
              </Col>
            </Row>

            <div className="accordian custom-accordian">
              <button
                data-testid="Show InBound and OutBound Graphs"
                className="accordian-header mb-2 d-flex justify-content-between align-items-center border-0 text-start w-100"
                onClick={handleBoundsOpen}
              >
                <Heading
                  level="4"
                  content={t('inBoundOutBound')}
                  className="fw-semibold font-xxl-20 font-16 mb-0"
                />

                <div className="sign">{showSign(showBounds)}</div>
              </button>
              {showBounds && (
                <Row className="g-3">
                  <Col lg="6" className="mb-3">
                    <ChartColumn
                      chartTestId="region-overview-chart"
                      totalEmissionId="facility-overview-total-emission"
                      regionEmissionId="facility-overview-region-emission"
                      name={"InBound"}
                      checked={checkedInBound}
                      setChecked={setCheckedInBound}
                      graphSubHeading={`${facilityOverviewDetailDto?.data?.facility?.name
                        } for ${getRegionName(regions, regionalId)}  ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                      isLoading={facilityInBoundLoading}
                      graphHeading={t('inBoundEmissions')}
                      dataArr={laneCarrierInBoundArr}
                      options={laneColumnChart({
                        chart: "lane",
                        isLoading: true,
                        lanePageArr: laneCarrierInBoundArr,
                        lanePagecontributor: [],
                        lanePagedetractor: [],
                        reloadData: reloadData,
                        unitDto: facilityInBoundDto?.data?.unit,
                        heading: ` Average of ${facilityOverviewDetailDto?.data?.facility?.name} facility (
                          ${formatNumber(
                          true,
                          facilityInBoundDto?.data?.average,
                          1
                        )}
                          ${facilityInBoundDto?.data?.unit})`
                      })}
                    />
                  </Col>

                  <Col lg="6" className="mb-3">
                    <ChartColumn
                      totalEmissionId="facility-overview-OutBound-total-emission"
                      regionEmissionId="facility-overview-OutBound-region-emission"
                      name={"OutBound"}
                      checked={checkedOutBound}
                      setChecked={setCheckedOutBound}
                      graphSubHeading={`${facilityOverviewDetailDto?.data?.facility?.name
                        } for ${getRegionName(regions, regionalId)}  ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                      isLoading={facilityOutBoundLoading}
                      graphHeading={t('outBoundEmissions')}
                      dataArr={laneCarrierOutBoundArr}
                      options={laneColumnChart({
                        chart: "lane",
                        isLoading: true,
                        lanePageArr: laneCarrierOutBoundArr,
                        lanePagecontributor: [],
                        lanePagedetractor: [],
                        reloadData: reloadData,
                        unitDto: facilityOutBoundDto?.data?.unit,
                        heading: `  Average of ${facilityOverviewDetailDto?.data?.facility?.name} facility (
                          ${formatNumber(
                          true,
                          facilityOutBoundDto?.data?.average,
                          1
                        )}
                          ${facilityOutBoundDto?.data?.unit})`
                      })}
                    />
                  </Col>
                </Row>
              )}
            </div>
            <div className="accordian custom-accordian">
              <button data-testid="Show-Emission-Graph" className="accordian-header mb-2 d-flex justify-content-between align-items-center w-100 text-start border-0"
                onClick={handleEmissionOpen}
              >
                <Heading
                  level="4"
                  content={t('emissionsGraph')}
                  className="fw-semibold font-xxl-20 font-16 mb-0"
                />
                <div className="sign">{showSign(showEmission)}</div>
              </button>
              {showEmission && (
                <div className="openAccor">
                  <Row className="g-3">
                    <Col lg="6" className="mb-3 mb-lg-0">
                      <ChartColumn
                        totalEmissionId="facility-carrier-total-emission"
                        regionEmissionId="facility-carrier-emission-intensity"
                        name={"Carrier"}
                        checked={checkedEmissions}
                        setChecked={setCheckedEmissions}
                        graphSubHeading={` ${facilityOverviewDetailDto?.data?.facility?.name
                          } for ${getRegionName(regions, regionalId)}  ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                        isLoading={facilityCarrierComparisonloading}
                        graphHeading={t('carrierEmissionTitle')}
                        dataArr={laneCarrierArr}
                        options={laneColumnChart({
                          chart: "lane",
                          isLoading: true,
                          lanePageArr: laneCarrierArr,
                          lanePagecontributor: [],
                          lanePagedetractor: [],
                          reloadData: reloadData,
                          unitDto: facilityCarrierComparisonData?.data?.unit,
                          heading: `${t('avgOfAll')} ${t('carrier')}s (
                            ${formatNumber(
                            true,
                            facilityCarrierComparisonData?.data?.average,
                            1
                          )}
                            ${facilityCarrierComparisonData?.data?.unit})`
                        })}
                      />
                    </Col>
                    <Col lg="6" className="mb-3 mb-lg-0">
                      <ChartColumn
                        totalEmissionId="facility-lane-total-emission"
                        regionEmissionId="facility-lane-total-emission-intensity"
                        name={"Lanes"}
                        checked={checked}
                        setChecked={setChecked}
                        graphSubHeading={`${facilityOverviewDetailDto?.data?.facility?.name
                          } for ${getRegionName(regions, regionalId)}  ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                        isLoading={facilityGraphDetailsLoading}
                        graphHeading={t('laneEmissionTitle')}
                        dataArr={lanePageArr}
                        options={laneColumnChart({
                          chart: "lane",
                          isLoading: true,
                          lanePageArr: lanePageArr,
                          lanePagecontributor: [],
                          lanePagedetractor: [],
                          reloadData: reloadData,
                          unitDto: facilityGraphDetailsDto?.data?.unit,
                          heading: `${t('avgOfAll')} ${t('laneTitle')}s (
                            ${formatNumber(
                            true,
                            facilityGraphDetailsDto?.data?.average,
                            1
                          )}
                            ${facilityGraphDetailsDto?.data?.unit})`
                        })}
                      />
                    </Col>
                  </Row>
                </div>
              )}
            </div>
            <DataSource />
          </div>
        </div>
      </section>
    </>
  );
};

export default FacilityOverviewView;
