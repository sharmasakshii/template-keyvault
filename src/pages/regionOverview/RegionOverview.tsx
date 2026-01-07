import { Row, Col } from "reactstrap";
import { formatNumber, formatUnit, getGraphTitle, isCompanyEnable } from "utils";
import RegionOverviewController from "./regionOverviewController";
import { laneColumnChart } from "utils/highchart/laneColumnChart";
import { lineColumnChart } from "utils/highchart/lineColumnChart";
import ChartColumn from "component/charts/chartColumn";
import ManagerDetailOverviewCard from "component/cards/manager";
import TitleComponent from "component/tittle";
import RGPGraph from "component/charts/rgpGraph";
import { rgpChart } from "utils/highchart/rgpChart";
import SustainViewCard from "component/cards/sustainabilityTracker";
import DateShow from "component/DateShow";
import styles from 'scss/config/_variable.module.scss'
import { companySlug } from "constant"
import { useTranslation } from 'react-i18next';

/**
 *
 * @returns RegionalOverview page
 */

const RegionOverview = () => {
  // Importing all states and functions from Region Overview Controller
  const {
    companyName,
    userProfile,
    params,
    checked,
    emissionDates,
    yearlyData1,
    checkedFacilityEmissions,
    checkedEmissions,
    reloadData,
    lanePageArr,
    checkedEmissionsReductionGlide,
    getRegionOverviewDetailData,
    regionEmission,
    regionEmissionIsLoading,
    regionCarrierComparisonData,
    regionFacilityEmissionIsLoading,
    regionFacilityEmissionDto,
    laneGraphDetailsLoading,
    laneGraphDetails,
    laneCarrierArr,
    regionCarrierComparisonLoading,
    laneFacilityEmessionArr,
    setCheckedEmissionsReductionGlide,
    setCheckedEmissions,
    setChecked,
    setCheckedFacilityEmissions,
    setReloadData,
    setYearlyData1,
    businessUnitList,
    businessUnitGraphDetails,
    businessUnitGraphDetailsLoading,
    checkedBusinessUnit,
    setCheckedBusinessUnit,
    getRegionOverviewDetailLoading,
    yearlyData,
    setYearlyData,
    setQuarterDetails,
    quarterDetails,
    pId,
    setPId,
    regions,
    divisions,
    timePeriodList,
    loginDetails,
    divisionId,
    regionName,
    weekId,
    setWeekId,
    configConstants
  } = RegionOverviewController();
  const { t } = useTranslation()
  const defaultUnit = configConstants?.data?.default_distance_unit;

  const subHeading = getGraphTitle({
    year: yearlyData,
    regionId: regionName,
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
      <TitleComponent
        title={"Regional Overview"}
        pageHeading={`${params?.regionId} ${t('region')} Overview`}
      />
      <section
        className="regionOverview-screen pb-4"
        data-testid="region-overview">
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
                    summaryHeading={`${params?.regionId} Region`}
                    projectHolder="Regional Manager"
                    managerName={`Manager of Sustainability`}
                    name={`${userProfile?.data?.profile?.first_name} ${userProfile?.data?.profile?.last_name}`}
                    backBtnTxt={`${t('back')} to ${t('regionTitle')}`}
                    backBtnLink={`scope3/regional`}
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
                    disabledYear={getRegionOverviewDetailLoading}
                    disabledQuarter={getRegionOverviewDetailLoading}
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
                        isLoading={getRegionOverviewDetailLoading}
                        isData={!!getRegionOverviewDetailData?.data?.carrierDto[0]}
                        cardValue={formatNumber(
                          true,
                          getRegionOverviewDetailData?.data?.carrierDto[0]
                            ?.intensity,
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
                        isLoading={getRegionOverviewDetailLoading}
                        isData={!!getRegionOverviewDetailData?.data?.carrierDto[0]}
                        cardValue={formatNumber(
                          true,
                          getRegionOverviewDetailData?.data?.carrierDto[0]
                            ?.emissions,
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
                        isLoading={getRegionOverviewDetailLoading}
                        isData={!!getRegionOverviewDetailData?.data?.carrierDto[0]}
                        cardValue={formatNumber(
                          true,
                          getRegionOverviewDetailData?.data?.carrierDto[0]
                            ?.shipment_count,
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
                    regionId: regionName,
                    division: divisionId,
                    pId: null,
                    weekId: null,
                    quarter: null,
                    regionList: regions,
                    divisionList: divisions,
                    timeList: null,
                    loginDetails
                  })}
                  graphHeading={t('reductionTitle')}
                  headingUnit={`(${!checkedEmissionsReductionGlide ? t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) }) : t('tco2eUnit')
                    })`}
                  checked={checkedEmissionsReductionGlide}
                  isLoading={regionEmissionIsLoading}
                  emissionDates={emissionDates}
                  dataArr={regionEmission}
                  setReloadData={setReloadData}
                  setChecked={setCheckedEmissionsReductionGlide}
                  options={rgpChart({
                    chart: "emissionReductionFacility",
                    isChecked: checkedEmissionsReductionGlide,
                    options: regionEmission?.data,
                    regionName: `${params?.regionId} ${t('region')}`,
                    reloadData: reloadData,
                    maxRegionsValue:
                      Math.max(
                        ...(regionEmission?.data?.region_level || [1])
                      ) * 1.1,
                    label: [
                      {
                        name: `${params?.regionId} Target/Q`,
                        key: "targer_level",
                        color: (styles.secondaryBlue),
                      },
                      {
                        name: `${params?.regionId} Region`,
                        key: "company_level",
                        color: (styles.primary),
                      },
                    ],
                  })}
                />
              </Col>

              {/* carrier Emissions of a region */}
              {!isCompanyEnable(loginDetails?.data, [companySlug?.adm, companySlug?.tql]) && (<Col lg="6">
                <ChartColumn
                  totalEmissionId="region-overview-total-emission"
                  regionEmissionId="region-overview-region-emission"
                  chartTestId="region-overview-chart"
                  name={"Carrier"}
                  checked={checkedEmissions}
                  setChecked={setCheckedEmissions}
                  graphSubHeading={subHeading}
                  graphHeading={t('carrierEmissionTitle')}
                  isLoading={regionCarrierComparisonLoading}
                  dataArr={laneCarrierArr}
                  options={laneColumnChart({
                    chart: "lane",
                    lanePageArr: laneCarrierArr,
                    lanePagecontributor: [],
                    lanePagedetractor: [],
                    unitDto: regionCarrierComparisonData?.data?.unit,
                    heading: `${t('avgOfAll')} ${t('carrier')}s (${formatNumber(
                      true,
                      regionCarrierComparisonData?.data?.average,
                      1
                    )}
                ${regionCarrierComparisonData?.data?.unit})`
                  })}
                />
              </Col>)}

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
                  isLoading={laneGraphDetailsLoading}
                  dataArr={lanePageArr}
                  options={laneColumnChart({
                    chart: "lane",
                    lanePageArr: lanePageArr,
                    lanePagecontributor: [],
                    lanePagedetractor: [],
                    unitDto: laneGraphDetails?.data?.unit,
                    heading: `${t('avgOfAll')} ${t('laneTitle')}s (${formatNumber(
                      true,
                      laneGraphDetails?.data?.average,
                      1
                    )}
                  ${laneGraphDetails?.data?.unit})`
                  })}
                />
              </Col>

              {/* Business unit of a region */}
              {isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) && (
                <Col lg="6">
                  <ChartColumn
                    totalEmissionId="region-overview-total-emission-business"
                    regionEmissionId="region-overview-intensity-emission-business"
                    name={"Business"}
                    checked={checkedBusinessUnit}
                    setChecked={setCheckedBusinessUnit}
                    isLoading={businessUnitGraphDetailsLoading}
                    dataArr={businessUnitList}
                    graphHeading={t('businessEmissionTitle')}
                    graphSubHeading={subHeading}
                    options={lineColumnChart({
                      chart: "region",
                      reloadData: reloadData,
                      regionPageArr: businessUnitList,
                      unitDto: businessUnitGraphDetails?.data?.unit,
                      companyName: companyName,
                      heading: `${t('avgOfAll')} ${t('businessUnitTitle')}s (
                        ${formatNumber(
                        true,
                        businessUnitGraphDetails?.data?.average,
                        1
                      )}
                        <span>${businessUnitGraphDetails?.data?.unit}</span>)`
                    })}
                  />
                </Col>
              )}

              {isCompanyEnable(loginDetails?.data, [companySlug.lw]) && (
                <Col lg="6">
                  <ChartColumn
                    totalEmissionId="region-overview-total-emission-facility"
                    regionEmissionId="region-overview-intensity-emission-facility"
                    name={"Facility"}
                    checked={checkedFacilityEmissions}
                    setChecked={setCheckedFacilityEmissions}
                    graphSubHeading={subHeading}
                    graphHeading={t('facilityEmissionTitle')}
                    isLoading={regionFacilityEmissionIsLoading}
                    dataArr={laneFacilityEmessionArr}
                    options={lineColumnChart({
                      chart: "region",
                      regionPageArr: laneFacilityEmessionArr,
                      lanePagecontributor: [],
                      lanePagedetractor: [],
                      reloadData: reloadData,
                      unitDto: regionFacilityEmissionDto?.data?.unit,
                      companyName: companyName,
                      heading: `${t('avgOfAll')} ${t('facility')} (${formatNumber(
                        true,
                        regionFacilityEmissionDto?.data?.average,
                        1
                      )}
                  ${regionFacilityEmissionDto?.data?.unit})`
                    })}
                  />
                </Col>
              )}
            </Row>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegionOverview;
