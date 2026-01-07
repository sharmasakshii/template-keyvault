import { Row, Col } from "reactstrap";
import styles from '../../scss/config/_variable.module.scss'
import { formatNumber, getLaneSubTitle, getEmmisonName, checkRolePermission, getGraphTitle, checkName, formatUnit } from "../../utils";
import TitleComponent from "../../component/tittle";
import BusinessUnitOverviewController from "./businessUnitOverviewController";
import { laneColumnChart } from "../../utils/highchart/laneColumnChart";
import ChartColumn from "../../component/charts/chartColumn";
import RGPGraph from "component/charts/rgpGraph";
import { rgpChart } from 'utils/highchart/rgpChart';
import ManagerDetailOverviewCard from "component/cards/manager";
import SustainViewCard from "component/cards/sustainabilityTracker";
import DateShow from "component/DateShow";
import { useTranslation } from 'react-i18next';
/**
 *
 * @returns RegionalOverview page
 */

const BusinessUnitOverview = () => {
  // Importing all states and functions from Region Overview Controller
  const {
    checked,
    reloadData,
    emissionDates,
    yearlyData1,
    checkedEmissions,
    lanePageArr,
    checkedEmissionsReductionGlide,
    businessCarrierComparisonData,
    businessLaneGraphDetailsLoading,
    businessLaneGraphDetails,
    laneCarrierArr,
    businessCarrierComparisonLoading,
    setCheckedEmissionsReductionGlide,
    setCheckedEmissions,
    setChecked,
    setReloadData,
    setYearlyData1,
    businessUnitOverviewDetailData,
    businessUnitLevelGlideData,
    isLoadingBusinessUnitLevelGlidePath,
    setCheckedRegion,
    checkedRegion,
    businessUnitRegionGraphDetailsLoading,
    businessUnitRegionGraphDetails,
    regionCarrierArr,
    yearlyData,
    setYearlyData,
    quarterDetails,
    setQuarterDetails,
    businessUnitOverviewDetailLoading,
    pId,
    setPId,
    loginDetails,
    regions, divisions, timePeriodList, regionalId, divisionId,
    weekId,
    setWeekId,
    configConstants,
    defaultUnit
  } = BusinessUnitOverviewController();

  const { t } = useTranslation()

  const graphTitle = getGraphTitle({
    year: yearlyData,
    regionId: regionalId,
    division: divisionId,
    pId: pId,
    weekId: weekId,
    quarter: quarterDetails,
    regionList: regions,
    divisionList: divisions,
    timeList: timePeriodList,
    loginDetails
  })

  return (
    <>
      <TitleComponent title={"Business Unit Overview"} pageHeading={businessUnitOverviewDetailData?.data?.businessUnit?.description && `${businessUnitOverviewDetailData?.data?.businessUnit?.description} Business Unit Overview`} />

      <section className="regionOverview-screen pb-4" data-testid="business-overview">
        <div className="regionOverview-screen-wraper">
          <div className="regionOverview-section py-2 pt-0 px-2">
            <Row className="g-3">
              <Col lg="12">
                <div className="mb-3 border-bottom pb-1 overview-section">
                  {/* modifiled Object */}
                  <ManagerDetailOverviewCard
                    yearDropDownOverviewId="year-dropdown-business-overview"
                    quarterDropDownOverviewId="quarter-dropdown-business-overview"
                    backBtnTestId="export-btn-business-overview"
                    summaryTag={true}
                    summaryHeading={`${businessUnitOverviewDetailData?.data?.businessUnit?.description} ${t('businessUnitTitle')}`}
                    projectHolder={t('projectMngr')}
                    managerName={businessUnitOverviewDetailData?.data?.businessUnit?.description}
                    title="dispatch manager"
                    backBtnTxt={`${t('back')} to ${t('businessUnitTitle')}`}
                    backBtnLink="scope3/business-unit"
                    showDropdown={true}
                    onChangeYear={(e: any) => {
                      setYearlyData(Number(e.value));
                      setYearlyData1(Number(e.value));
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
                    disabledYear={businessUnitOverviewDetailLoading}
                    disabledQuarter={businessUnitOverviewDetailLoading}
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
                        isLoading={businessUnitOverviewDetailLoading}
                        isData={!!businessUnitOverviewDetailData?.data?.carrierDto}
                        cardValue={formatNumber(true, businessUnitOverviewDetailData?.data?.carrierDto?.[0]?.intensity, 1)}
                        cardDate={t('emissionIntensityHeading')}
                        cardSubHeading={`*gCO2e / Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"} of freight`}
                        imagePath="/images/emissions-new-icon.svg"
                      />
                    </Col>
                    <Col md="4">
                      <SustainViewCard
                        testid={"card-2"}
                        isLoading={businessUnitOverviewDetailLoading}
                        isData={!!businessUnitOverviewDetailData?.data?.carrierDto}
                        cardValue={formatNumber(true, businessUnitOverviewDetailData?.data?.carrierDto?.[0]?.emissions, 2)}
                        cardDate={t('totalEmissionHeading')}
                        cardSubHeading={t('tco2eUnit')}
                        imagePath="/images/emissions-new-icon.svg"
                      />
                    </Col>
                    <Col md="4">
                      <SustainViewCard
                        testid={"card-3"}
                        isLoading={businessUnitOverviewDetailLoading}
                        isData={!!businessUnitOverviewDetailData?.data?.carrierDto}
                        cardValue={formatNumber(true, businessUnitOverviewDetailData?.data?.carrierDto?.[0]?.shipment_count, 0)}
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
                  graphSubHeading={`${getEmmisonName(checkedEmissionsReductionGlide)
                    } of ${businessUnitOverviewDetailData?.data?.businessUnit?.description} ${t('businessUnitTitle')} for ${getGraphTitle({
                      year: yearlyData,
                      regionId: regionalId,
                      division: divisionId,
                      pId: null,
                      weekId: null,
                      quarter: null,
                      regionList: regions,
                      divisionList: divisions,
                      timeList: [],
                      loginDetails
                    })}`}
                  graphHeading={t('reductionTitle')}
                  headingUnit={`(${!checkedEmissionsReductionGlide ? t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) }) : t('tco2eUnit')
                    })`}
                  checked={checkedEmissionsReductionGlide}
                  isLoading={isLoadingBusinessUnitLevelGlidePath}
                  emissionDates={emissionDates}
                  dataArr={businessUnitLevelGlideData}
                  setReloadData={setReloadData}
                  setChecked={setCheckedEmissionsReductionGlide}
                  options={rgpChart({
                    chart: "emissionReductionFacility",
                    isChecked: checkedEmissionsReductionGlide,
                    options: businessUnitLevelGlideData?.data,
                    regionName: `${businessUnitOverviewDetailData?.data?.businessUnit?.name} Business Unit`,
                    reloadData: reloadData,
                    maxRegionsValue:
                      Math.max(
                        ...(businessUnitLevelGlideData?.data?.region_level || [1])
                      ) * 1.1,
                    label: [
                      {
                        name: `${businessUnitOverviewDetailData?.data?.businessUnit?.name} Target/Q`,
                        key: "targer_level",
                        color: (styles.secondaryBlue),
                      },
                      {
                        name: `${businessUnitOverviewDetailData?.data?.businessUnit?.name} Business Unit`,
                        key: "region_level",
                        color: (styles.primary),
                      },
                    ],
                  })}
                />
              </Col>


              {/* carrier Emissions of a region */}
              <Col lg="6">
                <ChartColumn
                  name={"Carrier"}
                  totalEmissionId="total-emission-carrier-toggle"
                  regionEmissionId="emission-intensity-carrier-toggle"
                  checked={checkedEmissions}
                  setChecked={setCheckedEmissions}
                  graphSubHeading={`${checkedEmissions
                    ? `Total ${t('carrierEmissionTitle')}`
                    : `${t('carrier')} ${t('emissionIntensityHeading')}`
                    } of ${businessUnitOverviewDetailData?.data?.businessUnit?.description ?? ""} ${t('businessUnitTitle')} for ${graphTitle}`}
                  graphHeading={t('carrierEmissionTitle')}
                  isLoading={businessCarrierComparisonLoading}
                  dataArr={laneCarrierArr}
                  options={laneColumnChart({
                    chart: "lane",
                    lanePageArr: laneCarrierArr,
                    lanePagecontributor: [],
                    lanePagedetractor: [],
                    unitDto: businessCarrierComparisonData?.data?.unit,
                    heading: `${t('avgOfAll')} ${t('carrier')}s (${formatNumber(
                      true,
                      businessCarrierComparisonData?.data?.average,
                      1
                    )}
                  ${businessCarrierComparisonData?.data?.unit})`
                  })}
                />
              </Col>

              {/* Lane Emissions of a region */}
              <Col lg="6">
                <ChartColumn
                  name={"Lanes"}
                  totalEmissionId="total-emission-lane-toggle"
                  regionEmissionId="emission-intensity-lane-toggle"
                  checked={checked}
                  setChecked={setChecked}
                  graphSubHeading={`${getLaneSubTitle(checked)} of ${checkName(businessUnitOverviewDetailData?.data?.businessUnit?.description)} ${t('businessUnitTitle')} for ${graphTitle}`}
                  graphHeading={t('laneEmissionTitle')}
                  isLoading={businessLaneGraphDetailsLoading}
                  dataArr={lanePageArr}
                  options={laneColumnChart({
                    chart: "lane",
                    lanePageArr: lanePageArr,
                    lanePagecontributor: [],
                    lanePagedetractor: [],
                    unitDto: businessLaneGraphDetails?.data?.unit,
                    heading: `${t('avgOfAll')} ${t('laneTitle')}s (${formatNumber(
                      true,
                      businessLaneGraphDetails?.data?.average,
                      1
                    )}
                    ${businessLaneGraphDetails?.data?.unit})`
                  })}
                />
              </Col>

              {/* Region Emissions*/}
              {!checkRolePermission(loginDetails?.data, "regionalManager") && (
                <Col lg="6">
                  <ChartColumn
                    name={"Regions"}
                    totalEmissionId="total-emission-region-toggle"
                    regionEmissionId="emission-intensity-region-toggle"
                    checked={checkedRegion}
                    setChecked={setCheckedRegion}
                    graphSubHeading={`${checkedRegion
                      ? `${t('region')} ${t('emissions')}`
                      : `${t('region')} ${t('emissionIntensityHeading')}`
                      } of ${businessUnitOverviewDetailData?.data?.businessUnit?.description
                      } ${t('businessUnitTitle')} for ${getGraphTitle({
                        year: yearlyData,
                        regionId: null,
                        division: divisionId,
                        pId: pId,
                        weekId: weekId,
                        quarter: quarterDetails,
                        regionList: [],
                        divisionList: divisions,
                        timeList: timePeriodList,
                        loginDetails
                      })}`}

                    graphHeading={t('RegionEmissionHeading')}
                    isLoading={businessUnitRegionGraphDetailsLoading}
                    dataArr={regionCarrierArr}
                    options={laneColumnChart({
                      chart: "lane",
                      lanePageArr: regionCarrierArr,
                      lanePagecontributor: [],
                      lanePagedetractor: [],
                      unitDto: businessUnitRegionGraphDetails?.data?.unit,
                      heading: `${t('avgOfAll')} ${t('regionTitle')} (${formatNumber(
                        true,
                        businessUnitRegionGraphDetails?.data?.average,
                        1
                      )}
                    ${businessUnitRegionGraphDetails?.data?.unit})`
                    })}
                  />
                </Col>)}
            </Row>
          </div>
        </div>
      </section>
    </>
  );
};

export default BusinessUnitOverview;
