import SustainController from "./sustainController";
import TitleComponent from "../../component/tittle";
import { Row, Col } from "reactstrap";
import ImageComponent from "../../component/images";
import { Link } from "react-router-dom";
import ChartHighChart from "../../component/highChart/ChartHighChart";
import { pieChart } from "../../utils/highchart/pieChart";
import { verticalColumnChart } from "../../utils/highchart/verticalColumnChart";
import DataSource from "../../component/aboutLink/index";
import SustainViewCard from "../../component/cards/sustainabilityTracker";
import SelectDropdown from "../../component/forms/dropdown";
import styles from '../../scss/config/_variable.module.scss'
import {
  formatNumber,
  getCurrentQuarter,
  getRevenueType,
  isCompanyEnable,
  getGraphTitle,
  normalizedList,
  formatUnit
} from "utils";
import RGPGraph from "component/charts/rgpGraph";
import { verticalColumnEmissionChart } from "utils/highchart/verticalColumnEmissionChart";
import { rgpChart } from "utils/highchart/rgpChart";
import GraphStatusBar from "component/graphStatusBar";
import CustomModal from "component/DailogBox/CustomModal";
import { companySlug } from "constant"
import RegionFilter from "component/forms/regionFilter";
import { useTranslation } from 'react-i18next';
import { setDivisionId, setRegionalId } from "store/auth/authDataSlice";
import ProjectCount from "./ProjectCount";

/**
 *
 * @returns Sustainable view page
 */
const SustainView = () => {
  // Importing all states and functions from sustainable controller
  const {
    reloadData,
    regionsLevel,
    setRegionsLevel,
    divisionLevel,
    setDivisionLevel,
    revenueType,
    yearlyData,
    setYearlyData,
    yearlyData1,
    setYearlyData1,
    setReloadData,
    graphRegionChart,
    yearOption,
    emissionIntensityDetails,
    regionEmission,
    isLoadingProjectCount,
    projectCountData,
    regionOption,
    divisionOptions,
    isLoadingGraphRegionEmission,
    regionEmissionIsLoading,
    emissionIntensityDetailsIsLoading,
    checkedEmissionsReductionGlide,
    setCheckedEmissionsReductionGlide,
    emissionDates,
    configConstants,
    configConstantsIsLoading,
    isShowPasswordExpire,
    closeIsPasswordExpirePopup,
    handleResetPassword,
    loginDetails,
    regions,
    divisions,
    dispatch,
    isBrambleEnable
  } = SustainController();
  const { t } = useTranslation()

  const defaultUnit = configConstants?.data?.default_distance_unit


  return (

    <>
      {/* Sustainable dashboard */}
      <TitleComponent title={"Sustain Dashboard"} pageHeading={t('sustainablePageHeading')} />
      <section className="substain-screen pb-4" data-testid="sustain-view">
        <CustomModal
          testId="custom-modal-password"
          show={
            isShowPasswordExpire &&
            loginDetails?.data?.is_password_expired === 1
          }
          handleClose={closeIsPasswordExpirePopup}
          modalBody={`Your password is about to expire in ${loginDetails?.data?.password_reset_days || 0} days. Please update it.`}
          primaryButtonText={"Update"}
          primaryButtonTestId="update-button"
          secondaryButtonTestId="close-button"
          secondaryButtonText={"Close"}
          secondaryButtonClick={closeIsPasswordExpirePopup}
          primaryButtonClick={handleResetPassword}
          primaryButtonClass="btn-deepgreen font-14"
          modalClass="passwordExpire"
          secondaryButtonclass="gray-btn font-14"
        > <div className="text-center mb-4"><ImageComponent path="/images/warning.svg" className="pe-0" />
          </div>
        </CustomModal>
        <div className="substain-screen-wraper">
          <div className="substain-section pb-5">
            <div className="subs-inner-heading py-2 pb-4">

              <div className="d-sm-flex flex-wrap align-items-center gap-3 border-bottom px-2 pb-3">
                <h2 className="fw-medium mb-0 font-xxl-20 font-18">
                  {t('sustainabilityDashboardTitle')}
                </h2>


                <div className="select-box d-sm-flex flex-wrap gap-2 align-items-center">
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
                      setReloadData(false);
                      setRegionsLevel(e.value);
                      dispatch(setRegionalId(e.value))
                    }}
                  />
                  <SelectDropdown
                    aria-label="year-dropdown"
                    disabled={emissionIntensityDetailsIsLoading}
                    options={yearOption}
                    placeholder={t('year')}
                    customClass=" yearDropdown"
                    selectedValue={yearOption?.filter(
                      (el: any) => el.value === yearlyData
                    )}
                    onChange={(e: any) => {
                      setReloadData(false);
                      setYearlyData(e.value);
                      setYearlyData1(e.value)
                    }}
                  />
                </div>
              </div>
              {/* new-ui */}
              <div className="px-2 pt-3">
                <div className="tragetsCard">
                  <div className="titleTop font-16 font-xl-20 font-xxl-24 fw-semibold mb-3" data-testid="emission-reduction-title">
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
                        cardValue={!isBrambleEnable ? Math.abs(Number.parseInt(configConstants?.data?.EMISSION_REDUCTION_TARGET_2)) :"5"}
                        cardDate={configConstants?.data?.EMISSION_REDUCTION_TARGET_2_YEAR && `By ${configConstants?.data?.CURRENT_PERIOD ?? getCurrentQuarter(true)} ${configConstants?.data?.EMISSION_REDUCTION_TARGET_2_YEAR}`}
                        showPercentage
                        testid={"card-2"}
                      />
                    </Col>
                    <Col lg="4">
                      <SustainViewCard
                        isLoadingTestid="card-3-loader"
                        isLoading={configConstantsIsLoading}
                        cardValue={!isBrambleEnable ? Math.abs(Number.parseInt(configConstants?.data?.GAP_TO_TARGET)):'3'}
                        cardDate={`*Gap to ${configConstants?.data?.CURRENT_PERIOD ?? getCurrentQuarter(true)} Target`}
                        className="lastBoxcard"
                        showPercentage
                        testid={"card-3"}
                      />
                    </Col>
                  </Row>
                  <div className="textDown pt-3 font-14 font-xxl-16 fw-medium">
                    {
                      isBrambleEnable
                        ? (
                          <span>
                            <span className="star">*</span>
                            {''}
                            Reduction needed between now and June 2026
                          </span>
                        )
                        : (
                          <span>
                            <span className="star">*</span>Reduction needed between now and  {configConstants?.data?.CURRENT_PERIOD ?? getCurrentQuarter(true)} {new Date().getFullYear()}
                          </span>
                        )
                    }
                  </div>
                  {isCompanyEnable(loginDetails?.data, [companySlug.lw]) && <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://corporate.lowes.com/our-responsibilities/corporate-responsibility-reports-policies"
                    className="text-decoration-underline font-xxl-14 font-12 fw-normal text-dark"
                  >
                    {" "}
                    See company commitment
                  </a>}
                </div>
              </div>
              {/* new-ui end */}
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
                      year: yearlyData1,
                      regionId: regionsLevel,
                      division: divisionLevel,
                      pId: null,
                      weekId: null,
                      quarter: null,
                      regionList: regions,
                      regionName: null,
                      divisionList: divisions,
                      timeList: [],
                      loginDetails
                    })}
                    graphHeading={`${t('reductionTitle')} ${" "}`}
                    headingUnit={`(${!checkedEmissionsReductionGlide ? t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) }) : t('tco2eUnit')
                      })`}
                    checked={checkedEmissionsReductionGlide}
                    isLoading={regionEmissionIsLoading}
                    emissionDates={emissionDates}
                    dataArr={regionEmission}
                    setReloadData={setReloadData}
                    setChecked={setCheckedEmissionsReductionGlide}
                    quartelyDataText={false}
                    options={rgpChart({
                      chart: "emissionReductionFacility",
                      isChecked: checkedEmissionsReductionGlide,
                      options: regionEmission?.data,
                      reloadData: reloadData,
                      label: [
                        {
                          name: `Company Level`,
                          key: "company_level",
                          color: (styles.primary),
                        },
                        {
                          name: `Target/Q`,
                          key: "targer_level",
                          color: (styles.secondaryBlue),
                        },
                      ],
                    })}
                  />
                </Col>
                <Col lg="6">
                  <div className="mainGrayCards p-3 h-100 position-relative">
                    <h6 className="mb-1 fw-semibold">  {getGraphTitle({
                      year: yearlyData,
                      regionId: regionsLevel,
                      division: divisionLevel,
                      pId: null,
                      weekId: null,
                      quarter: null,
                      regionList: regions,
                      regionName: null,
                      divisionList: divisions,
                      timeList: [],
                      loginDetails
                    })}</h6>
                    <div className="d-md-block d-lg-flex  mb-2">
                      <div className="lh-1">
                        <h3 className="fw-semibold font-xxl-20 font-16 mb-0">
                          {t('emissionIntensityHeading')}{" "}
                          <span className="font-12 color-primary fw-normal">
                            ({t("gco2eUnit", { unit: formatUnit(defaultUnit) })})
                          </span>
                        </h3>

                      </div>
                    </div>
                    <div className="my-3">
                      <GraphStatusBar database={emissionIntensityDetails?.data?.length} condition={emissionIntensityDetails?.data?.length > 0 && ((emissionIntensityDetails?.data?.[0]?.max -
                        emissionIntensityDetails?.data?.[0]
                          ?.industrialAverage) /
                        emissionIntensityDetails?.data?.[0]?.max) *
                        100 < 0}
                        content={`Your emissions intensity per ${getRevenueType(Number(revenueType), defaultUnit)} is ${Math.abs(Math.round(
                          ((emissionIntensityDetails?.data?.[0]
                            ?.max -
                            emissionIntensityDetails?.data?.[0]
                              ?.industrialAverage) /
                            emissionIntensityDetails?.data?.[0]
                              ?.max) *
                          100
                        )) + "%"} /status/ than industry average`}
                      />
                    </div>
                    <ChartHighChart
                      loadingTestId="high-chart-emission-intensity-loader"
                      testId="high-chart-emission-intensity"
                      options={verticalColumnEmissionChart({
                        options: emissionIntensityDetails?.data,
                        chart: 2,
                        reloadData: true,
                      })}
                      constructorType=""
                      isLoading={emissionIntensityDetailsIsLoading}
                      database={emissionIntensityDetails?.data?.length}
                    />
                    {/* Bar element graph plot is here */}
                  </div>
                </Col>
              </Row>
              <div className="mb-4">
                <DataSource />
              </div>

              <Row className="g-3">
                <Col lg="6" md="12">
                  <div className="mainGrayCards p-3 h-100 position-relative">
                    <div className="mb-3 d-md-block d-lg-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-semibold">{getGraphTitle({
                          year: yearlyData,
                          regionId: regionsLevel,
                          division: divisionLevel,
                          pId: null,
                          weekId: null,
                          quarter: null,
                          regionList: regions,
                          regionName: null,
                          divisionList: divisions,
                          timeList: [],
                          loginDetails
                        })}</h6>
                        <h3 className="fw-semibold font-xxl-20 font-16 mb-0">
                          {t('intensityByRegionTitle')}{" "}
                          <span className="font-12 fw-normal">
                            ({t("tco2eUnit")})
                          </span>
                        </h3>

                      </div>
                    </div>
                    <ChartHighChart
                      loadingTestId="emission-intensity-by-region-loader"
                      testId="high-chart-emission-intensity-by-region"
                      options={verticalColumnChart({
                        reloadData: true,
                        options: normalizedList(graphRegionChart?.data),
                      })}
                      constructorType=""
                      isLoading={isLoadingGraphRegionEmission}
                      database={normalizedList(graphRegionChart?.data)?.filter((ele: any) => ele?.name === "list")?.[0]?.data?.length > 0}
                    />
                  </div>
                </Col>
                <Col lg="6" md="12">
                  <div className="project-overview mainGrayCards p-3 h-100">
                    <h6 className="mb-1 fw-semibold">{getGraphTitle({
                      year: yearlyData,
                      regionId: regionsLevel,
                      division: divisionLevel,
                      pId: null,
                      weekId: null,
                      quarter: null,
                      regionList: regions,
                      regionName: null,
                      divisionList: divisions,
                      timeList: [],
                      loginDetails
                    })}</h6>
                    <h3 className="fw-semibold text-capitalize mb-0">
                      {t('projectOverviewTitle')}
                    </h3>
                    <Row className="align-items-center p-xxl-4 p-3">
                      <Col md="12" xl="6">
                        <div>
                          <Link to="/scope3/projects">
                            <ChartHighChart
                              loadingTestId="project-count-data-loader"
                              testId="project-count-data"
                              options={pieChart({
                                reloadData: true,
                                pieChartCount: formatNumber(
                                  true,
                                  projectCountData?.data?.Total || 0,
                                  0
                                ),
                              })}
                              constructorType=""
                              isLoading={isLoadingProjectCount}
                              database={projectCountData?.data}
                            />
                          </Link>
                          {/* <PieChart /> */}
                        </div>
                      </Col>
                      <ProjectCount projectCountData={projectCountData} />
                    </Row>
                  </div>
                </Col>
              </Row>

              <div>
                <DataSource />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SustainView;
