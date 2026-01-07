import { Row, Col } from "reactstrap";
import { VendorOverViewController } from "./vendorOverviewController";
import { formatNumber, sortIcon, checkRolePermission, checkedNullValue, getGraphTitle, formatUnit } from "utils";
import TitleComponent from "component/tittle";
import ChartHighChart from "component/highChart/ChartHighChart";
import { emissionsIntensityCompareChart } from "utils/highchart/emissionsIntensityCompareChart";
import DataSource from "component/aboutLink";
import Heading from "component/heading";
import ImageComponent from "component/images";
import Logo from "component/logo";
import SustainViewCard from "component/cards/sustainabilityTracker";
import GraphStatusBar from "component/graphStatusBar";
import DateShow from "component/DateShow";
import ManagerDetailOverviewCard from "component/cards/manager";
import PerformanceHeading from "component/PerfomanceHeading"
import LaneBreakdown from "component/laneBreakdown"
import { useTranslation } from "react-i18next";
const VendorOverviewView = () => {
  // Destructuring values from VendorOverViewController
  const {
    emissionDates,
    carrierOverviewDetail,
    laneBreakdownDetail,
    laneBreakdownDetailLoading,
    carrierOverviewDetailLoading,
    yearlyData,
    setQuarterDetails,
    setYearlyData,
    quarterDetails,
    handleChangeOrderCarrier,
    colName,
    orderCarrier,
    regionCarrierComparisonDataTable,
    isLoadingRegionCarrierTable,
    navigate,
    backLinkUrl,
    backBtnTitle,
    carrierDetails,
    pId,
    setPId,
    weekId,
    setWeekId,
    timePeriodList,
    configConstants,
    loginDetails
  } = VendorOverViewController();

  const graphHeading = getGraphTitle({
    year: yearlyData,
    regionId: null,
    division: null,
    pId: pId,
    weekId: weekId,
    quarter: quarterDetails,
    regionList: null,
    divisionList: null,
    timeList: timePeriodList,
    loginDetails,
  })
  const { t } = useTranslation();
  const defaultUnit = configConstants?.data?.default_distance_unit
  return (
    <>
      {/* Title Component for the page */}
      <TitleComponent
        title={"Carrier Overview"}
        pageHeading={(carrierDetails?.carrier_name ? `${carrierDetails?.carrier_name} (${carrierDetails?.carrier}) ` : "") + "Carrier Overview"}
      />
      <section
        className="carrierOverview-screen pb-4"
        data-testid="carrier-overview-view"
      >
        {/* Main content section */}
        <div className="carrierOverview-screen-wraper">
          <div className="carrierOverview-section pb-2 px-2">
            <Row className="g-3">
              <Col lg="12">
                <div className="mb-3 border-bottom overview-section">
                  <ManagerDetailOverviewCard
                    backBtnTestId="back-button-carrier"
                    yearDropDownOverviewId="year-drop-down-carrierOverview"
                    quarterDropDownOverviewId="quarter-drop-down-carrierOverview"
                    regionEmissionId="region-drop-down-carrierOverview"
                    showManger={false}
                    backBtnTxt={`Back to ${backBtnTitle()}`}
                    backBtnLink={backLinkUrl()}
                    showDropdown={true}
                    userRole={loginDetails?.data?.role}
                    onChangeYear={(e: any) => {
                      setYearlyData(Number(e.value));
                      setPId(0);
                      setWeekId(0)
                      setQuarterDetails(0);
                    }}
                    onChangeYearQuarter={(e: any) => {
                      setQuarterDetails(e.value);
                      setPId(0);
                      setWeekId(0)
                    }}
                    disabledYear={carrierOverviewDetailLoading}
                    disabledQuarter={carrierOverviewDetailLoading}
                    pId={pId}
                    setPId={setPId}
                    weekId={weekId}
                    setWeekId={setWeekId}
                    yearlyData={yearlyData}
                    quarterDetails={quarterDetails}
                  />
                </div>
                    <div className="emissionTXt d-flex flex-wrap mb-3 pb-2">
                      <div className="emissionsmartWay d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center manager">
                          {carrierOverviewDetail?.data?.responseData &&
                            <h6 className="mb-0 font-18 whiteSpace font-xxl-24 fw-semibold text-capitalize d-flex gap-2 align-items-center">
                              <Logo
                                path={carrierDetails?.carrier_logo}
                                name={carrierDetails?.carrier}
                              />
                              {carrierDetails?.carrier_name} ({carrierDetails?.carrier})
                            </h6>}
                        </div>
                        <div className="verticalLineTwo bigline"></div>

                      </div>
                      <div className="ps-3 rankingImg mt-3 mt-md-0">

                        <div className="d-flex align-items-center gap-2">
                          <ImageComponent path="/images/smartwayRanking.svg" className="pe-0" />
                          <div>
                            <h4 className="font-xxl-18 font-16 fw-semibold mb-2 ">
                              {t('rankingTitle')}
                            </h4>
                            <div className="d-flex flex-wrap dataRank gap-2">
                              {!carrierOverviewDetail?.data?.responseData
                                ?.SmartwayData?.length ? (
                                <h6 className="font-14 ps-4">
                                  No rank available
                                </h6>
                              ) : (
                                carrierOverviewDetail?.data?.responseData?.SmartwayData?.map(
                                  (ranking: any, index: number) => (
                                    <div key={ranking?.year} className="d-flex gap-2 rankingdiff">
                                      <div
                                        key={ranking?.year}
                                        className="d-flex align-items-center rankingLine "
                                      >
                                        <h5 className="font-14 mb-0 fw-medium linebefore">
                                          <span className="font-14 ">
                                            {ranking?.year}&nbsp;:
                                          </span>
                                        </h5>
                                        <h5 className="font-14 fw-medium mb-0 d-flex">
                                          &nbsp;Rank <span className="font-14">&nbsp;{ranking?.ranking}{index !== carrierOverviewDetail?.data?.responseData?.SmartwayData?.length - 1}</span>
                                        </h5>

                                      </div>
                                      <div className="verticalLineTwo"></div>
                                    </div>
                                  )
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                <Row className="g-3">
                  <Col md="4">
                    <SustainViewCard
                      testid={"card-1"}
                      isLoading={carrierOverviewDetailLoading}
                      isData = {!!carrierOverviewDetail?.data?.responseData}
                      cardValue={formatNumber(true, carrierOverviewDetail?.data?.responseData?.intensity, 1)}
                      cardDate={t('emissionIntensityHeading')}
                      cardSubHeading={`${t(defaultUnit === "miles" ? "gco2eUnitMile" : "gco2eUnitKms")}`}
                       imagePath="/images/emissions-new-icon.svg"
                    />
                  </Col>
                  <Col md="4">
                    <SustainViewCard
                      testid={"card-2"}
                      isLoading={carrierOverviewDetailLoading}
                      isData = {!!carrierOverviewDetail?.data?.responseData}
                      cardValue={formatNumber(true, carrierOverviewDetail?.data?.responseData?.vendorEmissionData?.emissions, 2)}
                      cardDate={t('totalEmissionHeading')}
                      cardSubHeading="tCO2e"
                       imagePath="/images/emissions-new-icon.svg"
                    />
                  </Col>
                  <Col md="4">
                    <SustainViewCard
                      testid={"card-3"}
                      isLoading={carrierOverviewDetailLoading}
                      isData = {!!carrierOverviewDetail?.data?.responseData}
                      cardValue={formatNumber(true, carrierOverviewDetail?.data?.responseData?.vendorEmissionData?.shipment_count, 0)}
                      cardDate={t('totalShipmentHeading')}
                       imagePath="/images/shipment-new-icon.svg"
                    />
                  </Col>
                </Row>
                <div className="d-flex gap-3 mt-3 align-items-center">
                  <DateShow dateInfo={emissionDates?.data?.emission_dates} isActive={true} />
                </div>
              </Col>
              <Col lg="6">
                <div className="px-3 mainGrayCards py-3 h-100">
                  <Heading
                    level="6"
                    className="fw-medium font-14"
                    content={graphHeading}
                  />
                  <Heading
                    level="4"
                    content={t('emissionIntensityOverview')}
                    className="fw-semibold font-xxl-20 font-16 mb-2"
                    spanText={`(${t(defaultUnit === "miles" ? "gco2eUnitMile" : "gco2eUnitKms")})`}
                  />
                  <div className="my-3">
                    <GraphStatusBar
                      database={carrierOverviewDetail?.data?.responseData?.intensity}
                      condition={
                        carrierOverviewDetail &&
                        ((carrierOverviewDetail?.data?.responseData?.intensity -
                          carrierOverviewDetail?.data?.responseData?.max) /
                          carrierOverviewDetail?.data?.responseData
                            ?.intensity) *
                        100 <
                        0
                      }
                      content={`${carrierDetails?.carrier_name
                        } Emissions intensity is 
                        ${Math.abs(
                          Math.round(
                            ((Number.parseFloat(
                              carrierOverviewDetail?.data?.responseData
                                ?.intensity || 0
                            ) -
                              Number.parseFloat(
                                carrierOverviewDetail?.data?.responseData?.max
                              )) /
                              Number.parseFloat(
                                carrierOverviewDetail?.data?.responseData
                                  ?.max
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
                        name: carrierDetails?.carrier_name,
                        baseLine:
                          carrierOverviewDetail?.data?.responseData?.baseLine,
                        industrialAverage:
                          carrierOverviewDetail?.data?.responseData
                            ?.industrialAverage,
                        options:
                          carrierOverviewDetail?.data?.responseData?.data || [],
                        carrierName: "All Carriers"
                      })}
                      constructorType=""
                      isLoading={carrierOverviewDetailLoading}
                      database={carrierOverviewDetail?.data?.responseData?.intensity}
                    />
                  </div>
                </div>
              </Col>
              {!checkRolePermission(loginDetails?.data, "regionalManager") && (

                <Col lg="6">
                  <div className="mainGrayCards h-100">
                    <div className="regionWiseTxt">
                      <div className="p-2 p-xxl-3">
                        <Heading
                          level="6"
                          className="mb-1 laneBreakdownHeading fw-medium font-14"
                        > {graphHeading}</Heading>
                        <Heading
                          level="6"
                          content={t('RegionalEmissionTitle')}
                          className="mb-3  laneBreakdownHeading font-14 font-xxl-20 fw-semibold"
                        ></Heading>
                        <PerformanceHeading />
                      </div>
                      <div className="static-table">
                        <div className="tWrap">
                          <div className="tWrap__body">
                            {isLoadingRegionCarrierTable && (
                              <div
                                data-testid="table-data-loading-carrier-overview"
                                className="graph-loader d-flex justify-content-center align-items-center"
                              >
                                <div className="spinner-border spinner-ui">
                                  <span className="visually-hidden"></span>
                                </div>
                              </div>
                            )}
                            {!isLoadingRegionCarrierTable &&
                              (regionCarrierComparisonDataTable?.data?.length >
                                0 ? (
                                <table data-testid="table-graph-data-carrier-overview">
                                  <thead>
                                    <tr>
                                      <th>
                                        <div className="d-flex align-items-center">
                                          {t('regionTitle')}
                                        </div>
                                      </th>
                                      <th
                                        onClick={() =>
                                          handleChangeOrderCarrier("intensity")
                                        }
                                      >
                                        <div
                                          data-testid="change-order-intensity-carrier-overview"
                                          className="d-flex text-capitalize pointer"
                                        >
                                          {t('emissionIntensityHeading')}  <span>
                                            <ImageComponent
                                              className="pe-0"
                                              imageName={`${sortIcon(
                                                "intensity",
                                                colName,
                                                orderCarrier
                                              )}`}
                                            />
                                          </span>
                                        </div>
                                        <h6 className="font-10 mb-0">
                                          {`(${t("gco2eUnit", { unit: formatUnit(defaultUnit) })})`}
                                          <br /> of freight
                                        </h6>
                                      </th>
                                      <th
                                        className="pointer"
                                        onClick={() =>
                                          handleChangeOrderCarrier(
                                            "shipment_count"
                                          )
                                        }
                                      >
                                        <div
                                          data-testid="change-order-shipments-carrier-overview"
                                          className="d-flex"
                                        >
                                          {t('totalShipmentHeading')} <span>
                                            <ImageComponent
                                              className="pe-0"
                                              imageName={`${sortIcon(
                                                "shipment_count",
                                                colName,
                                                orderCarrier
                                              )}`}
                                            />
                                          </span>
                                        </div>
                                      </th>
                                      <th
                                        className="pointer"
                                        onClick={() =>
                                          handleChangeOrderCarrier("emission")
                                        }
                                      >
                                        <div
                                          data-testid="change-order-emission-carrier-overview"
                                          className="d-flex"
                                        >
                                          {t('totalEmissionHeading')} <span>
                                            <ImageComponent
                                              className="pe-0"
                                              imageName={`${sortIcon(
                                                "emission",
                                                colName,
                                                orderCarrier
                                              )}`}
                                            />
                                          </span>
                                        </div>
                                        <h6 className="font-10 mb-0">tCO2e</h6>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className=" text-start ">
                                    {regionCarrierComparisonDataTable?.data?.map(
                                      (row: any, index: any) => (
                                        <tr
                                          data-testid={`table-row-data-carrier-overview${index}`}
                                          key={row?.region_id}
                                          onClick={() =>
                                            navigate(
                                              `/scope3/region-overview/${row?.['regions.name']}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}`
                                            )
                                          }
                                        >
                                          <td>{row?.['regions.name']}</td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <div
                                                className="orange-div me-2"
                                                style={{
                                                  backgroundColor:
                                                    row?.intensity?.color,
                                                }}
                                              ></div>
                                              {formatNumber(
                                                true,
                                                row?.intensity?.value,
                                                1
                                              )}
                                            </div>
                                          </td>
                                          <td>
                                            {formatNumber(
                                              true,
                                              row?.shipment_count,
                                              0
                                            )}
                                          </td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <div
                                                className="orange-div me-2"
                                                style={{
                                                  backgroundColor:
                                                    row?.cost?.color,
                                                }}
                                              ></div>
                                              {formatNumber(
                                                true,
                                                row?.cost?.value,
                                                2
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              ) : (
                                <div className="d-flex justify-content-center align-items-center py-5 mt-2">
                                  <p>{t('noData')}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>)}
              <Col lg="12">

                <LaneBreakdown
                  heading={graphHeading}
                  laneBreakdownIsLoading={laneBreakdownDetailLoading}
                  contributorList={laneBreakdownDetail?.data?.contributor
                    ?.filter((i: any) => i?.total_intensity !== null)
                  }
                  detractorList={laneBreakdownDetail?.data?.detractor
                    ?.filter((i: any) => i?.total_intensity !== null)
                  }
                  totalShipment={carrierOverviewDetail?.data
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

export default VendorOverviewView;