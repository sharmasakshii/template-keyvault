import { Row, Col } from "reactstrap";
import DivisionOverViewController from "./divisionOverviewController";
import { checkRolePermission, getGraphTitle, getPercentage } from "utils";
import TitleComponent from "../../component/tittle";
import ChartHighChart from "../../component/highChart/ChartHighChart";
import { emissionsIntensityCompareChart } from "../../utils/highchart/emissionsIntensityCompareChart";
import DataSource from "../../component/aboutLink";
import Heading from "../../component/heading";
import GraphStatusBar from "component/graphStatusBar";
import ManagerDetailOverviewCard from "component/cards/manager";
import multiBarChart from "utils/highchart/multiBarChart";
import LaneBreakdown from "component/laneBreakdown";
import { useTranslation } from 'react-i18next';
import EmissionsTable from "./EmissionTable";
import styles from '../../scss/config/_variable.module.scss'

const DivisionOverviewView = () => {
  // Destructuring values from VendorOverViewController
  const {
    loginDetails,
    laneBreakdownDetailIsLoading,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    handleChangeOrderCarrier,
    colName,
    orderCarrier,
    getDivisionRegionComparisonDataDto,
    getDivisionRegionComparisonDataDtoLoading,
    pId,
    setPId,
    divisionOverviewDetailDto,
    divisionOverviewDetailDtoLoading,
    businessUnitEmissionDivisionListDto,
    businessUnitEmissionDivisionListDtoLoading,
    orderCarrierBusiness,
    colNameBusiness,
    businessUnitEmissionDivisionDto,
    businessUnitEmissionDivisionDtoLoading,
    laneBreakdownDetailForDivisionDto,
    timePeriodList,
    params,
    divisions,
    weekId,
    setWeekId,
    configConstants
  } = DivisionOverViewController();

  const graphTitle = getGraphTitle({
    year: yearlyData,
    regionId: null,
    division: params?.divisionId,
    pId: pId,
    weekId: weekId,
    quarter: quarterDetails,
    regionList: null,
    divisionList: divisions,
    timeList: timePeriodList,
    loginDetails
  })
  const { t } = useTranslation()
  const defaultUnit = configConstants?.data?.default_distance_unit;
  return (
    <>
      {/* Title Component for the page */}
      <TitleComponent
        title={"Division Overview"}
        pageHeading={divisionOverviewDetailDto?.data?.summerisedDivisiondetail?.name && `${divisionOverviewDetailDto?.data?.summerisedDivisiondetail?.name} ${t('division')} Overview`}
      />
      <section
        className="carrierOverview-screen pb-4"
        data-testid="division-overview"
      >
        {/* Main content section */}
        <div className="carrierOverview-screen-wraper">
          <div className="carrierOverview-section py-2 pt-0 px-2">
            <div className="mb-3 border-bottom overview-section pb-1">
              <ManagerDetailOverviewCard
                backBtnTestId="back-button-division"
                yearDropDownOverviewId="year-drop-down-division"
                quarterDropDownOverviewId="quarter-drop-down-division"
                regionEmissionId="region-drop-down-division"
                showManger={false}
                backBtnTxt={`${t('back')} to By ${t('division')}`}
                backBtnLink={'scope3/division'}
                showDropdown={true}
                userRole={loginDetails?.data?.role}
                onChangeYear={(e: any) => {
                  setYearlyData(Number(e.value));
                  setQuarterDetails(0);
                  setPId(0);
                  setWeekId(0)
                }}
                onChangeYearQuarter={(e: any) => {
                  setQuarterDetails(e.value);
                  setPId(0);
                  setWeekId(0)
                }}
                disabledYear={divisionOverviewDetailDtoLoading}
                disabledQuarter={divisionOverviewDetailDtoLoading}
                pId={pId}
                setPId={setPId}
                weekId={weekId}
                setWeekId={setWeekId}
                yearlyData={yearlyData}
                quarterDetails={quarterDetails}
              />
            </div>
            <Row className="g-3">
              <Col lg="6">
                <div className="px-3 mainGrayCards py-3 h-100">
                  <Heading
                    level="6"
                    className="fw-medium mb-1 font-14"
                    content={graphTitle}
                  />
                  <Heading
                    level="4"
                    content={t('emissionIntensityOverview')}
                    className="fw-semibold font-xxl-20 font-16 mb-2"
                    spanText={`(${t(defaultUnit === "miles" ? "gco2eUnitMile" : "gco2eUnitKms")})`}
                  />
                  <div className="my-3">
                    <GraphStatusBar
                      database={divisionOverviewDetailDto?.data?.data?.length > 0}
                      condition={divisionOverviewDetailDto?.data && getPercentage(divisionOverviewDetailDto?.data?.max, divisionOverviewDetailDto?.data?.intensity) < 0}
                      content={`${divisionOverviewDetailDto?.data?.summerisedDivisiondetail?.name
                        } ${t('emissionIntensityHeading')} is 
                        ${Math.abs(getPercentage(divisionOverviewDetailDto?.data?.max, divisionOverviewDetailDto?.data?.intensity)
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
                        name: divisionOverviewDetailDto?.data?.summerisedDivisiondetail?.name,
                        baseLine:
                          divisionOverviewDetailDto?.data?.baseLine,
                        industrialAverage:
                          divisionOverviewDetailDto?.data
                            ?.industrialAverage,
                        options:
                          divisionOverviewDetailDto?.data?.data || [],
                        carrierName: "All Divisions",
                      })}
                      constructorType=""
                      isLoading={divisionOverviewDetailDtoLoading}
                      database={divisionOverviewDetailDto?.data?.data?.length > 0}
                    />
                  </div>
                </div>
              </Col>
              {!checkRolePermission(loginDetails?.data, "regionalManager") && (
                <EmissionsTable
                  graphTitle={graphTitle}
                  data={getDivisionRegionComparisonDataDto?.data}
                  handleChangeOrder={handleChangeOrderCarrier}
                  type="region"
                  colName={colName}
                  order={orderCarrier}
                  title={`${t('emissionIntensityHeading')} of All ${t('regionTitle')}`}
                  firstColName={t('regionTitle')}
                  isLoading={getDivisionRegionComparisonDataDtoLoading}
                  colSpan={4}
                  rowIdentifier="region.id"
                  rowFields={'region'}
                  intensityTitle={t('emissionIntensityHeading')}
                  shipmentTitle={t('totalShipmentHeading')}
                  emissionTitle={t('totalEmissionHeading')}
                  configConstants={configConstants}
                />
              )}
              <Col lg="12">
                <LaneBreakdown
                  heading={graphTitle}
                  laneBreakdownIsLoading={laneBreakdownDetailIsLoading}
                  contributorList={laneBreakdownDetailForDivisionDto?.data?.responseData?.contributor
                    ?.filter((i: any) => i?.total_intensity !== null)
                  }
                  detractorList={laneBreakdownDetailForDivisionDto?.data?.responseData?.detractor
                    ?.filter((i: any) => i?.total_intensity !== null)
                  }
                  totalShipment={10}
                  defaultUnit={defaultUnit}
                />
              </Col>

              <Col lg="6">
                <div className="px-3 mainGrayCards py-3 h-100">
                  <Heading
                    level="6"
                    className="fw-semibold font-18"
                    content={t('businessUnitEmissionstitle')}
                    spanText={`(${t(defaultUnit === "miles" ? "gco2eUnitMile" : "gco2eUnitKms")})`}
                  />
                  <div>
                    <ChartHighChart
                      loadingTestId="emission-intensity-by-region-loader"
                      testId="high-chart-emission-intensity-by-region"
                      options={multiBarChart({
                        yTitle: `${t("emissionIntensityHeading")} (*gCO2e / Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"
                          } of freight)`,
                        xTitle: t("businessUnitTitle"),
                        options: businessUnitEmissionDivisionDto?.data || [],
                        barColor: styles.primary,
                      })}
                      constructorType=""
                      isLoading={businessUnitEmissionDivisionDtoLoading}
                      database={businessUnitEmissionDivisionDto?.data?.length > 0}
                    />

                  </div>
                </div>
              </Col>
              <EmissionsTable
                graphTitle={graphTitle}
                data={businessUnitEmissionDivisionListDto?.data}
                handleChangeOrder={handleChangeOrderCarrier}
                type="business"
                colName={colNameBusiness}
                order={orderCarrierBusiness}
                title={`${t('emissionIntensityHeading')} of All ${t('businessUnitTitle')}s`}
                firstColName={t('businessUnitTitle')}
                isLoading={businessUnitEmissionDivisionListDtoLoading}
                colSpan={4}
                rowIdentifier="businessUnit.id"
                rowFields={'businessUnit'}
                intensityTitle={t('emissionIntensityHeading')}
                shipmentTitle={t('totalShipmentHeading')}
                emissionTitle={t('totalEmissionHeading')}
                configConstants={configConstants}
              />

            </Row>
            <DataSource />
          </div>
        </div>
      </section>
    </>
  );
};

export default DivisionOverviewView;
