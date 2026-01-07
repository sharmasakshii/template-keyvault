import { Row, Col } from "reactstrap";
import { formatNumber, formatUnit, getGraphTitle } from "utils";
import CarrierTypeOverviewController from "./carrierTypeOverviewController";
import { laneColumnChart } from "utils/highchart/laneColumnChart";
import ChartColumn from "component/charts/chartColumn";
import ManagerDetailOverviewCard from "component/cards/manager";
import TitleComponent from "component/tittle";
import RGPGraph from "component/charts/rgpGraph";
import { rgpChart } from "utils/highchart/rgpChart";
import SustainViewCard from "component/cards/sustainabilityTracker";
import DateShow from "component/DateShow";
import styles from 'scss/config/_variable.module.scss'
import { useTranslation } from 'react-i18next';

/**
 *
 * @returns CarrierTypeOverview page
 */

const CarrierTypeOverview = () => {
  // Importing all states and functions from Region Overview Controller
  const {
    userProfile,
    checked,
    emissionDates,
    yearlyData1,
    reloadData,
    carrierTypeLaneEmissionList,
    checkedEmissionsReductionGlide,
    carrierTypeOverviewDetailDto,
    carrierTypeLaneEmissionGraphDtoLoading,
    setCheckedEmissionsReductionGlide,
    setChecked,
    setReloadData,
    setYearlyData1,
    isLoadingTypeOverviewDetail,
    yearlyData,
    setYearlyData,
    setQuarterDetails,
    quarterDetails,
    pId,
    setPId,
    regions,
    timePeriodList,
    loginDetails,
    divisionId,
    weekId,
    setWeekId,
    configConstants,
    carrierTypeReductionGraphDto, isLoadingCarrierTypeReductionGraph,
    carrierTypeLaneEmissionGraphDto
  } = CarrierTypeOverviewController();
  const { t } = useTranslation()
  const defaultUnit = configConstants?.data?.default_distance_unit;

  const subHeading = getGraphTitle({
    year: yearlyData,
    regionId: null,
    division: divisionId,
    pId: pId,
    weekId: weekId,
    quarter: quarterDetails,
    regionList: regions,
    divisionList: [],
    timeList: timePeriodList,
    loginDetails
  })
  const carrierTypeName = carrierTypeOverviewDetailDto?.data?.name || ''
  return (
    <>
      <TitleComponent
        title={"Carrier Overview"}
        pageHeading={`${carrierTypeName} ${t('carrierTypeTitle')} Overview`}
      />
      <section
        className="regionOverview-screen pb-4"
        data-testid="carrier-type-overview">
        <div className="regionOverview-screen-wraper">
          <div className="regionOverview-section py-2 pt-0 px-2">
            <Row className="g-3">
              <Col lg="12">
                <div className="mb-3 border-bottom overview-section pb-2">
                  <ManagerDetailOverviewCard
                    quarterDropDownOverviewId="quarter-drop-down"
                    yearDropDownOverviewId="year-drop-down"
                    backBtnTestId="back-button"
                    summaryTag={true}
                    summaryHeading={`${carrierTypeName}`}
                    projectHolder="Regional Manager"
                    managerName={`Manager of Sustainability`}
                    name={`${userProfile?.data?.profile?.first_name} ${userProfile?.data?.profile?.last_name}`}
                    backBtnTxt={`${t('back')} to ${t('carrierTypeTitle')}`}
                    backBtnLink={`scope3/by-carrier-type`}
                    showDropdown={true}
                    onChangeYear={(e: any) => {
                      setYearlyData(Number(e.value));
                      setYearlyData1(Number(e.value))
                      setQuarterDetails(0);
                      setPId(0);
                      setWeekId(0)
                      setReloadData(false);
                    }}
                    onChangeYearQuarter={(e: any) => {
                      setQuarterDetails(e.value);
                      setReloadData(false);
                      setPId(0);
                      setWeekId(0)
                    }}
                    disabledYear={isLoadingTypeOverviewDetail}
                    disabledQuarter={isLoadingTypeOverviewDetail}
                    pId={pId}
                    setPId={setPId}
                    weekId={weekId}
                    setWeekId={setWeekId}
                    yearlyData={yearlyData}
                    quarterDetails={quarterDetails}
                  />
                </div>

                <div className="reagionCards">
                  <Row className="g-3">
                    <Col md="4">
                      <SustainViewCard
                        testid={"card-1"}
                        isLoading={isLoadingTypeOverviewDetail}
                        isData={!!carrierTypeOverviewDetailDto?.data?.emissionsIntensity}
                        cardValue={formatNumber(
                          true,
                          carrierTypeOverviewDetailDto?.data?.emissionsIntensity,
                          1
                        )}
                        imagePath="/images/emissions-new-icon.svg"
                        cardDate={t('emissionIntensityHeading')}
                        cardSubHeading={`*gCO2e / Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"} of freight`}

                      />
                    </Col>
                    <Col md="4">
                      <SustainViewCard
                        testid={"card-2"}
                        isLoading={isLoadingTypeOverviewDetail}
                        isData={!!carrierTypeOverviewDetailDto?.data?.totalEmissions}
                        cardValue={formatNumber(
                          true,
                          carrierTypeOverviewDetailDto?.data?.totalEmissions,
                          2
                        )}
                        imagePath="/images/emissions-new-icon.svg"
                        cardDate={t('totalEmissionHeading')}
                        cardSubHeading={t('tco2eUnit')}
                      />
                    </Col>
                    <Col md="4">
                      <SustainViewCard
                        testid={"card-3"}
                        isLoading={isLoadingTypeOverviewDetail}
                        isData={carrierTypeOverviewDetailDto?.data?.totalShipments}
                        cardValue={formatNumber(
                          true,
                          carrierTypeOverviewDetailDto?.data?.totalShipments,
                          0
                        )}
                        cardDate={t('totalShipmentHeading')}
                        imagePath="/images/shipment-new-icon.svg"
                      />
                    </Col>
                  </Row>
                  <div className="d-flex gap-3 mt-3 align-items-center">
                    <DateShow dateInfo={emissionDates?.data?.emission_dates} isActive={true} />
                  </div>
                </div>
              </Col>
              {/* Emissions Reduction Glide Path Graph */}
              <Col lg="6">
                <RGPGraph
                  emissionIntensityToggleId="emission-intensity-toggle"
                  totalEmissionToggleId="total-emission-toggle"
                  yearlyData1={yearlyData1}
                  setYearlyData1={setYearlyData1}
                  graphSubHeading={getGraphTitle({
                    year: yearlyData,
                    regionId: null,
                    division: divisionId,
                    pId: null,
                    weekId: null,
                    quarter: null,
                    regionList: regions,
                    divisionList: [],
                    timeList: null,
                    loginDetails
                  })}
                  graphHeading={t('reductionTitle')}
                  headingUnit={`(${!checkedEmissionsReductionGlide ? t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) }) : t('tco2eUnit')
                    })`}
                  checked={checkedEmissionsReductionGlide}
                  isLoading={isLoadingCarrierTypeReductionGraph}
                  emissionDates={emissionDates}
                  dataArr={carrierTypeReductionGraphDto}
                  setReloadData={setReloadData}
                  setChecked={setCheckedEmissionsReductionGlide}
                  options={rgpChart({
                    chart: "emissionReductionFacility",
                    isChecked: checkedEmissionsReductionGlide,
                    options: carrierTypeReductionGraphDto?.data,
                    regionName: `${carrierTypeName} ${t('carrierTypeTitle')}`,
                    reloadData: reloadData,
                    maxRegionsValue:
                      Math.max(
                        ...(carrierTypeReductionGraphDto?.data?.region_level || [1])
                      ) * 1.1,
                    label: [
                      {
                        name: `${carrierTypeName} Target/Q`,
                        key: "targer_level",
                        color: (styles.secondaryBlue),
                      },
                      {
                        name: `${carrierTypeName}`,
                        key: "company_level",
                        color: (styles.primary),
                      },
                    ],
                  })}
                />
              </Col>


              {/* Lane Emissions of a region */}
              <Col lg="6">
                <ChartColumn
                  totalEmissionId="region-overview-total-emission-lane"
                  regionEmissionId="region-overview-intensity-emission-lane"
                  name={"Lane"}
                  checked={checked}
                  setChecked={setChecked}
                  graphSubHeading={subHeading}
                  graphHeading={t('laneEmissionTitle')}
                  isLoading={carrierTypeLaneEmissionGraphDtoLoading}
                  dataArr={carrierTypeLaneEmissionList}
                  options={laneColumnChart({
                    chart: "lane",
                    lanePageArr: carrierTypeLaneEmissionList,
                    lanePagecontributor: [],
                    lanePagedetractor: [],
                    unitDto: carrierTypeLaneEmissionGraphDto?.data?.unit,
                    heading: `${t('avgOfAll')} ${t('laneTitle')}s (${formatNumber(
                      true,
                      carrierTypeLaneEmissionGraphDto?.data?.average,
                      1
                    )}
                  ${carrierTypeLaneEmissionGraphDto?.data?.unit})`
                  })}
                />
              </Col>



            </Row>
          </div>
        </div>
      </section>
    </>
  );
};

export default CarrierTypeOverview;
