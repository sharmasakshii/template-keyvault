import "scss/regionalLevel/_index.scss";
import ChartColumn from "component/charts/chartColumn";
import SustainViewCard from "component/cards/sustainabilityTracker";
import DataSource from "component/aboutLink/index";
import styles from 'scss/config/_variable.module.scss'
import DateFilter from "component/forms/dateFilter";

import {
  FormGroup,
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Link } from "react-router-dom";
import {
  getQuarterName,
  getRegionName,
  formatNumber,
  getUnitSign,
  getMaxValue,
  getEmmisonName,
  getColumnChartHeading,
  isCompanyEnable,
  checkRolePermission,
  getCurrentQuarter,
  getGraphTitle,
  normalizedList,
  formatUnit
} from "utils";
import RegionalLevelController from "./regionalLevelController";
import ChartHighChart from "component/highChart/ChartHighChart";
import { pieChart } from "utils/highchart/pieChart";
import { verticalColumnChart } from "utils/highchart/verticalColumnChart";
import { laneColumnChart } from "utils/highchart/laneColumnChart";
import ImageComponent from "component/images";
import RGPGraph from "component/charts/rgpGraph";
import { rgpChart } from "utils/highchart/rgpChart";
import { lineColumnChart } from "utils/highchart/lineColumnChart";
import { verticalColumnEmissionChart } from "utils/highchart/verticalColumnEmissionChart";
import TitleComponent from "component/tittle";
import ButtonComponent from "component/forms/button";
import GraphStatusBar from "component/graphStatusBar";
import VendorTable from "pages/carrier/VendorTable";
import { companySlug } from "constant"
import RegionFilter from "component/forms/regionFilter";
import { useTranslation } from 'react-i18next';
import { setDivisionId, setRegionalId } from "store/auth/authDataSlice";
import ProjectCount from "pages/sustainable/ProjectCount";


/**
 *
 * @returns RegionalLevel page
 */

const OverviewCard = ({
  title,
  description,
  avgTitle,
  imagePath,
  checked,
  onChange,
  dataTestId,
}: any) => (
  <Col lg="3" md="6" className="mb-3 mb-lg-0">
    <div className="card-border p-3 h-100">
      <div className="card-wrapper-txt minHeightTxt">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h6 className="mb-0 font-xxl-20 font-16 fw-medium">{title}</h6>
          <FormGroup check>
            <Input
              data-testid={dataTestId}
              type="checkbox"
              checked={checked}
              onChange={onChange}
            />
          </FormGroup>
        </div>
        <p className="font-xxl-16 font-14">{description}</p>
      </div>
      <div className="text-center">
        <h6 className="fw-medium font-xxl-16 font-14 text-center">{avgTitle}</h6>
        <ImageComponent className="text-center img-fluid" path={imagePath} />
      </div>
    </div>
  </Col>
);


const RegionalLevelView = () => {
  // Importing all states and functions from Regional Level Controller
  const {
    companyName,
    reloadData,
    isLoadingProjectCount,
    regionName,
    quarterDetails,
    emissionDates,
    yearlyData,
    yearlyData1,
    lanePageArr,
    laneFacilityEmessionArr,
    regionPageArr,
    projectCountData,
    checkedFacilityEmissions,
    regionFacilityEmissionIsLoading,
    checkedEmissionsReductionGlide,
    regionEmission,
    regionEmissionIsLoading,
    regionFacilityEmissionDto,
    pieChartCount,
    isFacilityState,
    isCarrierState,
    isLaneState,
    isRegionState,
    isBusinessUnitState,
    laneGraphDetails,
    laneGraphDetailsLoading,
    emissionIntensityDetails,
    emissionIntensityDetailsIsLoading,
    setCheckedFacilityEmissions,
    changeRegion,
    changeLane,
    changeCarrier,
    changeBusinessUnit,
    changeFacility,
    changeFuel,
    changeVehicle,
    isFuelState,
    setIsFuelState,
    isVehicleState,
    setIsVehicleState,
    checkedRegion,
    setCheckedRegion,
    regionsLevel,
    regionGraphDetails,
    regionGraphDetailsLoading,
    isRegion,
    isLane,
    isCarrier,
    isFacility,
    isFuel,
    isVehicle,
    businessUnitList,
    businessUnitGraphDetails,
    businessUnitGraphDetailsLoading,
    isBusinessUnit,
    setIsBusinessUnitState,
    modal,
    setCheckedEmissionsReductionGlide,
    checkedBusinessUnitEmissions,
    setCheckedBusinessUnitEmissions,
    setYearlyData,
    setYearlyData1,
    setQuarterDetails,
    dispatch,
    toggle,
    setIsRegionState,
    setIsLaneState,
    setIsCarrierState,
    setIsFacilityState,
    setRegionsLevel,
    setReloadData,
    setChecked,
    regionOption,
    checked,
    configConstants,
    isLoadingGraphRegionEmission,
    graphRegionChart,
    configConstantsIsLoading,
    emissionsValue,
    checkedFuel,
    setCheckedFuel,
    checkedVehicle,
    setCheckedVehicle,
    fuelArrayList,
    vehicleArrayList,
    fuelGraphDto,
    fuelGraphDtoLoading,
    vehicleGraphDtoLoading,
    vehicleGraphDto,
    pId,
    setPId,
    divisionLevel,
    setDivisionLevel,
    divisionOptions,
    regions,
    timePeriodList,
    divisions,
    loginDetails,
    isLoading,
    weekId,
    setWeekId,
    timeId,
    additionalRef,
    defaultUnit,
    isBrambleEnable,
    showLatestYear,
  } = RegionalLevelController();

  const { t } = useTranslation();

  return (
    <>
      {/* Region page */}

      <TitleComponent
        title={"Region Level"}
        pageHeading={t('sustainablePageHeading')}
      />
      <section className="regional-screen pb-4 pt-2" data-testid="region-level">
        <div className="regional-screen-wraper">
          <div className="regional-section">
            <div className="subs-inner-heading pt-2 pb-4">
              <div className="d-sm-flex flex-wrap align-items-center gap-2 border-bottom px-2 pb-3">
                <h2 className="fw-medium mb-0 font-xxl-20 font-18">{t('regionalLevelTitle')}</h2>
                <div className="select-box d-sm-flex gap-1 flex-wrap">
                  <RegionFilter
                    isDisabled={emissionIntensityDetailsIsLoading}
                    regionAriaLabel="regions-data-dropdown"
                    regionOption={regionOption}
                    divisionOptions={divisionOptions}
                    regionalLevel={regionsLevel}
                    divisionLevel={divisionLevel}
                    handleChangeDivision={(e: any) => {
                      setDivisionLevel(e.value)
                      setReloadData(false);
                      dispatch(setDivisionId(e.value))
                      setRegionsLevel("");
                      dispatch(setRegionalId(""))
                    }}
                    handleChangeRegion={(e: any) => {
                      setRegionsLevel(e.value);
                      setReloadData(false);
                      dispatch(setRegionalId(e.value))
                    }}
                  />

                  <DateFilter
                    yearDropDownId="year-dropdown"
                    quarterDropDownId="quarter-dropdown"
                    isLoading={emissionIntensityDetailsIsLoading || isLoading}
                    yearlyId={yearlyData}
                    quarterId={quarterDetails}
                    pId={pId}
                    setPId={setPId}
                    weekId={weekId}
                    setWeekId={setWeekId}
                    updateYear={(e: any) => {
                      setYearlyData1(Number(e.value));
                      setYearlyData(Number(e.value));
                      setQuarterDetails(0)
                      setPId(0)
                      setWeekId(0)
                      setReloadData(false);
                    }}
                    updateQuarter={(e: any) => {
                      setQuarterDetails(e.value);
                      setReloadData(false);
                      setPId(0)
                      setWeekId(0)
                    }}
                  />

                </div>
                <div className="add-btn mt-2 mt-sm-0">
                  <ButtonComponent
                    btnClass=" btn-deepgreen px-3 font-12 font-xxl-14 py-2 d-flex align-items-center justify-content-center"
                    data-testid="add-additional-btn"
                    imagePath="/images/regional/plus.svg"
                    text={t('addData')}
                    onClick={() => {
                      setIsRegionState(isRegion);
                      setIsLaneState(isLane);
                      setIsCarrierState(isCarrier);
                      setIsFacilityState(isFacility);
                      setIsBusinessUnitState(isBusinessUnit);
                      toggle();
                    }} />
                </div>
              </div>
              <div className="tragetsCard pt-3 px-2">
                <div
                  className="titleTop font-16 font-xl-20 font-xxl-24 fw-semibold mb-3"
                  data-testid="emission-reduction-title"
                >
                  {isBrambleEnable ? t('emissionReductionTarget') : t('emissionsReductionTitle')}
                </div>
              <Row className="g-3">
                  <Col lg={"4"}>
                    <SustainViewCard
                      isLoadingTestid="card-1-loader"
                      isLoading={configConstantsIsLoading}
                      cardValue={Math.abs(Number.parseInt(configConstants?.data?.EMISSION_REDUCTION_TARGET_1))}
                      cardDate={configConstants?.data?.EMISSION_REDUCTION_TARGET_1_YEAR && `By ${configConstants?.data?.EMISSION_REDUCTION_TARGET_1_YEAR}`}
                      showPercentage
                      testid={"card-1"}
                    />
                  </Col>

                  <Col lg={"4"}>
                    <SustainViewCard
                      isLoadingTestid="card-2-loader"
                      isLoading={configConstantsIsLoading}
                      cardValue={!isBrambleEnable ? Math.abs(Number.parseInt(configConstants?.data?.EMISSION_REDUCTION_TARGET_2)) : "5"}
                      cardDate={configConstants?.data?.EMISSION_REDUCTION_TARGET_2_YEAR && `By ${configConstants?.data?.CURRENT_PERIOD ?? getCurrentQuarter(true)} ${configConstants?.data?.EMISSION_REDUCTION_TARGET_2_YEAR}`}
                      showPercentage
                      testid={"card-2"}
                    />
                  </Col>

                    <Col lg="4">
                      <SustainViewCard
                        isLoadingTestid="card-3-loader"
                        isLoading={configConstantsIsLoading}
                        cardValue={!isBrambleEnable ? Math.abs(Number.parseInt(configConstants?.data?.GAP_TO_TARGET)): "3"}
                        cardDate={`*Gap to ${configConstants?.data?.CURRENT_PERIOD ?? getCurrentQuarter(true)} Target`}
                        className="lastBoxcard"
                        showPercentage
                        testid={"card-3"}
                      />
                    </Col>
                </Row>
                <div className="textDown pt-3 fw-normal font-xxl-16 font-14">
                  {
                    isBrambleEnable
                      ? (
                        <span>
                          <span className="star">*</span>{""}
                          Reduction needed between now and June 2026
                        </span>
                      )
                      : (
                        <span>
                          <span className="star">*</span>
                          Reduction needed between now and {configConstants?.data?.CURRENT_PERIOD ?? getCurrentQuarter(true)} {new Date().getFullYear()}
                        </span>
                      )
                  }
                </div>
                {isCompanyEnable(loginDetails?.data, [companySlug.lw]) && <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://corporate.lowes.com/our-responsibilities/corporate-responsibility-reports-policies"
                  className="text-decoration-underline font-xxl-14 font-12 fw-normal text-dark"
                >{t('companyComitment')}</a>}
              </div>
            </div>
            <div className="px-2">
              <Row className="g-3">
                <Col lg="6">
                  <RGPGraph
                    isLoadingtestId="RPG-graph-data-loading"
                    testId="RPG-graph-data"
                    emissionIntensityToggleId="emission-intensity-toggle"
                    totalEmissionToggleId="total-emission-toggle"
                    yearlyData1={yearlyData1}
                    setYearlyData1={setYearlyData1}
                    graphSubHeading={getGraphTitle({
                      year: regionEmission?.data?.year[0],
                      regionId: regionsLevel,
                      division: divisionLevel,
                      pId: null,
                      weekId: null,
                      quarter: null,
                      regionList: regions,
                      regionName: regionName,
                      divisionList: divisions,
                      timeList: [],
                      loginDetails
                    })}

                    graphHeading={t('reductionTitle')}
                    headingUnit={`(${getUnitSign(
                      !checkedEmissionsReductionGlide, configConstants?.data?.default_distance_unit
                    )})`}
                    checked={checkedEmissionsReductionGlide}
                    isLoading={regionEmissionIsLoading}
                    emissionDates={emissionDates}
                    dataArr={regionEmission}
                    setReloadData={setReloadData}
                    setChecked={setCheckedEmissionsReductionGlide}
                    options={rgpChart({
                      chart: "emissionReductionFacility",
                      options: regionEmission?.data,
                      isChecked: checkedEmissionsReductionGlide,
                      regionName: `${regionName} ${t('region')}`,
                      reloadData: reloadData,
                      maxRegionsValue: getMaxValue(
                        regionEmission?.data?.region_level
                      ),
                      label: [
                        {
                          name: `${regionName} Target/Q`,
                          key: "targer_level",
                          color: (styles.secondaryBlue),
                        },
                        {
                          name: `${regionName} Region`,
                          key: "company_level",
                          color: (styles.primary),
                        },
                      ],
                    })}
                  />
                </Col>
                <Col lg="6">
                  <div className="mainGrayCards p-3 h-100 slider-icons position-relative">
                    <div className="emi-inten">
                      <h6 className="mb-1 ps-1 fw-semibold">
                        {getGraphTitle({
                          year: yearlyData,
                          regionId: regionsLevel,
                          division: divisionLevel,
                          pId: null,
                          weekId: null,
                          quarter: quarterDetails,
                          regionList: regions,
                          regionName: regionName,
                          divisionList: divisions,
                          timeList: [],
                          loginDetails
                        })}
                      </h6>
                      <div className="d-flex align-items-center mb-3 mt-2">
                        <div>
                          <h3 className="fw-semibold font-xxl-20 font-16 ps-1 mb-0 ">
                            {t('emissionIntensityHeading')}{" "}
                            <span className="font-12 fw-normal">
                              {`(${t("gco2eUnit", { unit: formatUnit(defaultUnit) })})`}
                            </span>
                          </h3>

                        </div>
                        <div className="select-box d-flex ms-5"></div>
                      </div>
                    </div>
                    <div className="my-3">
                      <GraphStatusBar
                        database={
                          emissionIntensityDetails?.data?.[0]?.dataset?.length > 0
                        }
                        condition={
                          ((emissionIntensityDetails?.data?.[0]?.max -
                            emissionIntensityDetails?.data?.[0]
                              ?.industrialAverage) /
                            emissionIntensityDetails?.data?.[0]?.max) *
                          100 <
                          0
                        }
                        content={`Your emissions intensity for the ${regionName} region is 
                      ${Math.abs(
                          Math.round(
                            ((emissionIntensityDetails?.data?.[0]?.max -
                              emissionIntensityDetails?.data?.[0]
                                ?.industrialAverage) /
                              emissionIntensityDetails?.data?.[0]?.max) *
                            100
                          )
                        ) + "% "
                          } /status/ than industry average for this region`}
                      />
                    </div>
                    <ChartHighChart
                      loadingTestId="high-chart-emission-intensity-loader"
                      testId="high-chart-emission-intensity"
                      options={verticalColumnEmissionChart({
                        chart: "emissionIntensity",
                        options: emissionIntensityDetails?.data,
                        reloadData: reloadData,
                        quartelyData: quarterDetails,
                        showQuarter: true,
                      })}
                      constructorType=""
                      isLoading={emissionIntensityDetailsIsLoading}
                      database={
                        emissionIntensityDetails?.data?.[0]?.dataset?.length > 0
                      }
                    />
                  </div>
                </Col>
              </Row>
              <DataSource />
              {/* pacific section */}
              <div className="pacific-overview mt-3">
                <Row className="g-3">
                  <Col lg="6">
                    <div className="mainGrayCards p-3 h-100 position-relative">
                      <div className="mb-3 d-md-block d-lg-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-semibold">{getGraphTitle({
                            year: yearlyData,
                            regionId: regionsLevel,
                            division: divisionLevel,
                            pId: null,
                            weekId: null,
                            quarter: quarterDetails,
                            regionList: regions,
                            regionName: regionName,
                            divisionList: divisions,
                            timeList: [],
                            loginDetails
                          })}</h6>
                          <h3 className="fw-semibold  font-xxl-20 font-16 mb-0">
                            {t('intensityByRegionTitle')}{" "}
                            <span className="font-12 fw-normal">
                              {`(${t("tco2eUnit")})`}
                            </span>
                          </h3>

                        </div>
                      </div>
                      <ChartHighChart
                        loadingTestId="emission-intensity-by-region-loader"
                        testId="high-chart-emission-intensity-by-region"
                        options={verticalColumnChart({
                          reloadData: true,
                          options: normalizedList(graphRegionChart?.data)
                        })}
                        constructorType=""
                        isLoading={isLoadingGraphRegionEmission}
                        database={normalizedList(graphRegionChart?.data)?.filter((ele: any) => ele?.name === "list")?.[0]?.data?.length > 0}
                      />
                    </div>
                  </Col>

                  <Col lg="6">
                    <div className="project-overview mainGrayCards p-3 h-100 slider-icons position-relative">
                      <h6 className="mb-1 fw-semibold">
                        {getGraphTitle({
                          year: yearlyData,
                          regionId: regionsLevel,
                          division: divisionLevel,
                          pId: null,
                          weekId: null,
                          quarter: quarterDetails,
                          regionList: regions,
                          regionName: regionName,
                          divisionList: divisions,
                          timeList: [],
                          loginDetails
                        })}

                      </h6>
                      <h3 className="mb-0 fw-semibold">
                        {t('projectOverviewTitle')}
                      </h3>
                      <Row className="align-items-center p-xxl-4 p-3">
                        <Col md="12" xl="6">
                          <div className="project-outer position-relative">
                            <Link to="/scope3/projects" className="text-decoration-none">
                              <ChartHighChart
                                loadingTestId="project-count-data-loader"
                                testId="project-count-data"
                                options={pieChart({
                                  reloadData: reloadData,
                                  pieChartCount: formatNumber(
                                    true,
                                    pieChartCount,
                                    0
                                  ),
                                })}
                                constructorType=""
                                isLoading={isLoadingProjectCount}
                                database={pieChartCount !== null}
                              />
                            </Link>
                          </div>
                        </Col>
                        <ProjectCount projectCountData={projectCountData} />
                      </Row>
                    </div>
                  </Col>
                  <Col lg="12">
                    <div>
                      <DataSource />
                    </div>
                  </Col>

                </Row>
                <Row className="mt-2">
                  {/* Carrier Graph */}
                  <div ref={additionalRef}></div>
                  {isCarrier && (
                    <Col lg="12" md="12">
                      <div className=" mainGrayCards h-100 py-3">
                        <h6 className="datafrom-txt mb-1 fw-semibold px-3">
                          Emissions of Carriers for {getGraphTitle({
                            year: yearlyData,
                            regionId: regionsLevel,
                            division: divisionLevel,
                            pId: pId,
                            weekId: weekId,
                            quarter: quarterDetails,
                            regionList: regions,
                            regionName: regionName,
                            divisionList: divisions,
                            timeList: timePeriodList,
                            loginDetails
                          })}
                        </h6>
                        <div className="emi-inten d-flex justify-content-between mb-2  px-3">
                          <div>
                            <h4 className="fw-semibold font-xxl-20 font-17 mb-0">{t('carrierEmissionTitle')}</h4>
                            <div className="avg-img"></div>
                          </div>
                          <Link
                            data-testid="show-all-navigate"
                            to={"/scope3/carrier"}
                            className="text-dark fs-14"
                          >
                            Show All
                          </Link>
                        </div>
                        <VendorTable
                          performanceTestId="performance-heading"
                          tableTestId="get-table"
                          carrierTestId="carrier-name"
                          emissionTestId="emission-intensity"
                          shipmentTestId="total-shipments"
                          totalEmissionTestId="total-emission"
                          clickRowTestId="click-row-carrier"
                          regionalLevel={regionsLevel}
                          divisionLevel={divisionLevel}
                          yearlyData={yearlyData}
                          quarterDetails={quarterDetails}
                          emissionsValue={emissionsValue}
                          isDashbord={true}
                          pId={pId}
                          weekId={weekId}
                          timeId={timeId}
                          defaultUnit={configConstants?.data?.default_distance_unit}       
                          showLatestYear={showLatestYear}            
                            />
                      </div>
                    </Col>
                  )}
                  {/* Region Emissions Graph */}
                  {isRegion && (
                    <Col lg="6" className="mt-3">
                      <ChartColumn
                        chartTestId="regional-emission"
                        regionEmissionId="region-emission-toggle"
                        totalEmissionId="total-region-emission-toggle"
                        name={t('region')}
                        checked={checkedRegion}
                        setChecked={setCheckedRegion}
                        graphSubHeading={`Region-Wise ${getEmmisonName(
                          checkedRegion
                        )} for ${getGraphTitle({
                          year: yearlyData,
                          regionId: null,
                          division: divisionLevel,
                          pId: pId,
                          weekId: weekId,
                          quarter: quarterDetails,
                          regionList: [],
                          divisionList: divisions,
                          timeList: timePeriodList,
                          loginDetails
                        })}`}
                        graphHeading={t('RegionalEmissionTitle')}
                        isLoading={regionGraphDetailsLoading}
                        dataArr={regionPageArr}
                        options={lineColumnChart({
                          chart: "region",
                          regionPageArr: regionPageArr,
                          reloadData: reloadData,
                          unitDto: regionGraphDetails?.data?.unit,
                          companyName: companyName,
                          heading: `${getColumnChartHeading(
                            regionGraphDetails?.data,
                            "regions"
                          )}`
                        })}
                      />
                    </Col>
                  )}
                  {isLane && (
                    <Col lg="6" className="mt-3">
                      <ChartColumn
                        chartTestId="lane-by"
                        regionEmissionId="lane-emission-toggle"
                        totalEmissionId="total-lane-emission-toggle"
                        name={"Lanes"}
                        checked={checked}
                        setChecked={setChecked}
                        graphSubHeading={`${getEmmisonName(
                          checked
                        )} for ${getGraphTitle({
                          year: yearlyData,
                          regionId: regionsLevel,
                          division: divisionLevel,
                          pId: pId,
                          weekId: weekId,
                          quarter: quarterDetails,
                          regionList: regions,
                          regionName: regionName,
                          divisionList: divisions,
                          timeList: timePeriodList,
                          loginDetails
                        })} `}
                        graphHeading={t('laneEmissionTitle')}
                        isLoading={laneGraphDetailsLoading}
                        dataArr={lanePageArr}
                        options={laneColumnChart({
                          chart: "lane",
                          isLoading: true,
                          lanePageArr: lanePageArr,
                          lanePagecontributor: [],
                          lanePagedetractor: [],
                          unitDto: regionGraphDetails?.data?.unit,
                          heading: `${getColumnChartHeading(
                            laneGraphDetails?.data,
                            "lane"
                          )}`
                        })}
                      />
                    </Col>
                  )}
                  {isFacility && (
                    <Col lg="6" className="mt-3">
                      <ChartColumn
                        chartTestId="facility-by"
                        regionEmissionId="facility-emission-toggle"
                        totalEmissionId="total-facility-emission-toggle"
                        name={"Facility"}
                        checked={checkedFacilityEmissions}
                        setChecked={setCheckedFacilityEmissions}
                        graphSubHeading={`${getEmmisonName(
                          checkedFacilityEmissions
                        )} of ${getRegionName(
                          regionName,
                          regionsLevel,
                          true
                        )} Facilities for ${getQuarterName(loginDetails,
                          quarterDetails,
                          yearlyData
                        )} ${yearlyData}`}
                        graphHeading={t('facilityEmissionTitle')}
                        isLoading={regionFacilityEmissionIsLoading}
                        dataArr={laneFacilityEmessionArr}
                        options={lineColumnChart({
                          companyName: companyName,
                          chart: "region",
                          regionPageArr: laneFacilityEmessionArr,
                          reloadData: reloadData,
                          unitDto: regionFacilityEmissionDto?.data?.unit,
                          heading: `${getColumnChartHeading(
                            regionFacilityEmissionDto?.data,
                            "facilities"
                          )}`
                        })}
                      />
                    </Col>
                  )}
                  {isBusinessUnit && (
                    <Col lg="6" className="mt-3">
                      <ChartColumn
                        chartTestId="business-by"
                        regionEmissionId="business-emission-toggle"
                        totalEmissionId="total-business-emission-toggle"
                        name={"Business"}
                        checked={checkedBusinessUnitEmissions}
                        setChecked={setCheckedBusinessUnitEmissions}
                        isLoading={businessUnitGraphDetailsLoading}
                        dataArr={businessUnitList}
                        graphHeading={t('businessEmissionTitle')}
                        graphSubHeading={`${t('businessUnitTitle')} ${getEmmisonName(checkedBusinessUnitEmissions)} for ${getGraphTitle({
                          year: yearlyData,
                          regionId: regionsLevel,
                          division: divisionLevel,
                          pId: pId,
                          weekId: weekId,
                          quarter: quarterDetails,
                          regionList: regions,
                          regionName: regionName,
                          divisionList: divisions,
                          timeList: timePeriodList,
                          loginDetails
                        })}`}
                        options={lineColumnChart({
                          chart: "region",
                          regionPageArr: businessUnitList,
                          reloadData: reloadData,
                          unitDto: businessUnitGraphDetails?.data?.unit,
                          companyName: companyName,
                          heading: `${t('avgOfAll')} ${t('businessUnitTitle')} (
                          ${formatNumber(
                            true,
                            businessUnitGraphDetails?.data?.average,
                            1
                          )}
                          <span>${businessUnitGraphDetails?.data?.unit
                            }</span>)`,
                        })}
                      />
                    </Col>
                  )}
                  {isFuel && (
                    <Col lg="6" className="mt-3">
                      <ChartColumn name={"Fuel"}
                        checked={checkedFuel} setChecked={setCheckedFuel}
                        regionEmissionId="emission-intensity-toggle-region"
                        totalEmissionId="total-emission-toggle-region"
                        testId="graph-data"
                        heading=""
                        isLoading={fuelGraphDtoLoading}
                        dataArr={fuelArrayList}
                        graphSubHeading={`Fuel-Wise ${getEmmisonName(checkedFuel)} of ${getRegionName(
                          regionName,
                          regionsLevel,
                          true
                        )} for ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                        options={lineColumnChart({
                          chart: "region",
                          regionPageArr: fuelArrayList,
                          reloadData: reloadData,
                          unitDto: fuelGraphDto?.data?.unit,
                          companyName: companyName,
                          heading: `${t('avgOfAll')} ${t('fuelType')} (${formatNumber(true, fuelGraphDto?.data?.average, 1)} <span>${fuelGraphDto?.data?.unit}</span>)`
                        }
                        )} />
                    </Col>
                  )}
                  {isVehicle && (
                    <Col lg="6" className="mt-3">
                      <ChartColumn name={"Vehicle"}
                        checked={checkedVehicle} setChecked={setCheckedVehicle}
                        regionEmissionId="emission-intensity-toggle-region"
                        totalEmissionId="total-emission-toggle-region"
                        testId="graph-data"
                        heading=""
                        isLoading={vehicleGraphDtoLoading} dataArr={vehicleArrayList}
                        graphSubHeading={`Vehicle-Wise ${getEmmisonName(checkedVehicle)} of ${getRegionName(
                          regionName,
                          regionsLevel,
                          true
                        )} for ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                        options={lineColumnChart({
                          chart: "region",
                          regionPageArr: vehicleArrayList,
                          reloadData: reloadData,
                          unitDto: vehicleGraphDto?.data?.unit,
                          companyName: companyName,
                          heading: `${t('avgOfAll')} Vehicle Model (${formatNumber(true, vehicleGraphDto?.data?.average, 1)} <span>${vehicleGraphDto?.data?.unit}</span>)`
                        }
                        )} />
                    </Col>
                  )}
                </Row>
              </div>
            </div>

          </div>
        </div>
      </section>
      <Modal
        isOpen={modal}
        toggle={() => toggle()}
        className="data-tile-screen"
        data-testid="modal-open"
      >
        <ModalHeader
          data-testid="modal-header"
          toggle={() => toggle()}
          className="border-0 align-items-start"
        >
          <p className="mb-1 font-xxl-24 font-20 fw-semibold">
            Select and add additional data tiles to your
            dashboard
          </p>
          <p className="font-16 fw-normal mb-0">
            These visuals created based on your{" "}
            <span className="text-decoration-none">profile settings</span>.
          </p>
        </ModalHeader>
        <ModalBody className="pt-2">
          <Row className="g-3" data-testid="modal-body">
            {!checkRolePermission(loginDetails?.data, "regionalManager") && (
              <OverviewCard
                title={t('regionalOvr')}
                description="See transportation emissions data by region."
                avgTitle={`${t('avgOfAll')} ${t('regionTitle')}`}
                imagePath="/images/regional/avg-lanes.png"
                checked={isRegionState}
                onChange={() => setIsRegionState(!isRegionState)}
                dataTestId="regional-checkbox"
              />
            )}

            <OverviewCard
              title={`${t('by')} ${t('laneTitle')}`}
              description="Drill down to lane-level emissions for both inbound and outbound logistics."
              avgTitle={`${t('avgOfAll')} ${t('laneTitle')}s`}
              imagePath="/images/regional/avg-lanes.png"
              checked={isLaneState}
              onChange={() => setIsLaneState(!isLaneState)}
              dataTestId="lane-checkbox"
            />

            {!isCompanyEnable(loginDetails?.data, [companySlug?.adm, companySlug?.tql]) && (
              <OverviewCard
                title={`${t('by')} ${t('carrier')}`}
                description="Identify the carriers with highest and lowest emissions intensity."
                avgTitle={`${t('avgOfAll')} ${t('carrier')}s`}
                imagePath="/images/regional/avg-carrier.png"
                checked={isCarrierState}
                onChange={() => setIsCarrierState(!isCarrierState)}
                dataTestId="carrier-checkbox"
              />
            )}

            {isCompanyEnable(loginDetails?.data, [companySlug?.lw]) && (
              <OverviewCard
                title={`${t('by')} ${t('facilityTitle')}`}
                description="Compare emissions by facility."
                avgTitle={`${t('avgOfAll')} ${t('facility')}`}
                imagePath="/images/regional/avg-lanes.png"
                checked={isFacilityState}
                onChange={() => setIsFacilityState(!isFacilityState)}
                dataTestId="facility-checkbox"
              />
            )}

            {isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) && (
              <OverviewCard
                title={`${t('by')} ${t('businessUnitTitle')}`}
                description="Identify the business unit with highest and lowest emissions intensity."
                avgTitle={`${t('avgOfAll')} ${t('businessUnitTitle')}`}
                imagePath="/images/regional/avg-lanes.png"
                checked={isBusinessUnitState}
                onChange={() => setIsBusinessUnitState(!isBusinessUnitState)}
                dataTestId="business-checkbox"
              />
            )}

            {isCompanyEnable(loginDetails?.data, [companySlug?.adm]) && (
              <>
                <OverviewCard
                  title={`${t('by')} ${t('fuel')}`}
                  description="Identify the fuel with highest and lowest emissions intensity."
                  avgTitle={`${t('avgOfAll')} ${t('fuel')}`}
                  imagePath="/images/regional/avg-lanes.png"
                  checked={isFuelState}
                  onChange={() => setIsFuelState(!isFuelState)}
                  dataTestId="fuel-checkbox"
                />

                <OverviewCard
                  title={`${t('by')} ${t('vehicle')}`}
                  description="Identify the vehicle with highest and lowest emissions intensity."
                  avgTitle={`${t('avgOfAll')} ${t('vehicle')}`}
                  imagePath="/images/regional/avg-lanes.png"
                  checked={isVehicleState}
                  onChange={() => setIsVehicleState(!isVehicleState)}
                  dataTestId="vehicle-checkbox"
                />
              </>)}
          </Row>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-end border-0">
          <ButtonComponent
            data-testid="apply-btn"
            text={t('apply')}
            disabled={!(isRegionState || isFacilityState || isBusinessUnitState || isCarrierState || isLaneState || isFuelState || isVehicleState)}
            onClick={() => {
              toggle(true);
              dispatch(changeRegion(isRegionState));
              dispatch(changeLane(isLaneState));
              dispatch(changeCarrier(isCarrierState));
              dispatch(changeFacility(isFacilityState));
              dispatch(changeBusinessUnit(isBusinessUnitState));
              dispatch(changeFuel(isFuelState))
              dispatch(changeVehicle(isVehicleState))
            }}
            btnClass="px-5 btn-deepgreen font-14 py-2"
          />
        </ModalFooter>
      </Modal>
    </>
  );
};
export default RegionalLevelView;
