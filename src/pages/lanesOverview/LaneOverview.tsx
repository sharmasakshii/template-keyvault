import styles from 'scss/config/_variable.module.scss'
import { Row, Col } from "reactstrap";
import LaneOverviewController from "./laneOverviewController";
import { laneColumnChart } from "utils/highchart/laneColumnChart";
import GoogleMapView from "component/map";
import Heading from "component/heading";
import TitleComponent from "component/tittle";
import RGPGraph from "component/charts/rgpGraph";
import ChartColumn from "component/charts/chartColumn";
import { Link } from "react-router-dom";
import ImageComponent from "component/images";
import ManagerDetailOverviewCard from "component/cards/manager";
import { formatNumber, getUnitSign, getGramUnitSign, getEmmisonName, isCompanyEnable, checkedNullValue, getGraphTitle } from "utils";
import { rgpChart } from "utils/highchart/rgpChart";
import Logo from "component/logo";
import CarrierRankingTooltip from "component/carrierRankingTooltip"
import Pagination from 'component/pagination';
import SustainViewCard from "component/cards/sustainabilityTracker";
import DateShow from "component/DateShow";
import PerformanceHeading from "component/PerfomanceHeading"
import MapComponent from 'component/map/MapComponent';
import { companySlug } from "constant"
import { useTranslation } from 'react-i18next';
import TableBodyLoad from 'component/tableBodyHandle';

/**
 *
 * @returns LanesOverview view page
 */

const LaneOverview = () => {
  // Importing all states and functions from LanesOverview controller
  const {
    reloadData,
    laneCarrierArr,
    checkedEmissionsReductionGlide,
    laneCarrierEmissionIsloading,
    laneReductionDetailGraphLoading,
    laneCarrierEmission,
    laneReductionDetailGraphData,
    getLaneOverDetailsEmissionData,
    checkedEmissions,
    yearlyData1,
    setCheckedEmissions,
    setYearlyData1,
    setCheckedEmissionsReductionGlide,
    laneCarrierTableDto,
    col_name,
    order,
    currentPage,
    laneName,
    pageSize,
    searchCarrier,
    emissionDates,
    setPageSize,
    navigate,
    handleSearchCarrier,
    setCurrentPage,
    setReloadData,
    handleChangeOrder,
    sortIcon,
    yearlyData,
    setYearlyData,
    quarterDetails,
    setQuarterDetails,
    getLaneOverDetailsEmissionLoading,
    showFullScreen,
    setShowFullScreen,
    pId,
    setPId,
    weekId,
    setWeekId,
    loginDetails,
    timePeriodList,
    regionalId, divisionId,
    regions, divisions,
    laneCarrierTableDtoLoading,
    configConstants
  } = LaneOverviewController();

  const graphHeading = getGraphTitle({
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
  const { t } = useTranslation()
  return (
    <>
      {/* LanesOverview dashboard starts */}
      <TitleComponent title={"LanesOverview"} pageHeading={`${laneName?.split('_').map(word => word.toUpperCase()).join(' to ')} Lane Overview`} />
      <section className="laneOverview-screen pb-4" data-testid="lanes-overview">
        <div className="laneOverview-screen-wraper">
          {/*main lane overview section starts  */}
          <div className="laneOverview-section py-2 px-2">
            <div className="mb-3 border-bottom overview-section">
              <ManagerDetailOverviewCard
                yearDropDownOverviewId="year-dropdown"
                backBtnTestId="back-btn"
                quarterDropDownOverviewId="quarter-dropdown"
                summaryTag={true}
                summaryHeading={`${laneName} Lane`}
                projectHolder="Project Manager"
                managerName={`Manager of Sustainability`}
                backBtnTxt="Back to Lanes"
                backBtnLink={`scope3/lanes`}
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
                disabledYear={getLaneOverDetailsEmissionLoading}
                disabledQuarter={getLaneOverDetailsEmissionLoading}
                pId={pId}
                setPId={setPId}
                weekId={weekId}
                setWeekId={setWeekId}
                yearlyData={yearlyData}
                quarterDetails={quarterDetails}
              />
            </div>

            <Row className='g-3'>
              <Col md="4">
                <SustainViewCard
                  testid="card-1"
                  isLoading={getLaneOverDetailsEmissionLoading}
                  isData={!!getLaneOverDetailsEmissionData?.data?.[0]}
                  cardValue={formatNumber(true, getLaneOverDetailsEmissionData?.data?.[0]?.intensity, 1)}
                  cardDate={t('emissionIntensityHeading')}
                  cardSubHeading={`*gCO2e / Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"} of freight`}
                  imagePath="/images/emissions-new-icon.svg"
                />
              </Col>
              <Col md="4">
                <SustainViewCard
                  testid="card-2"
                  isLoading={getLaneOverDetailsEmissionLoading}
                  isData={!!getLaneOverDetailsEmissionData?.data?.[0]}
                  cardValue={formatNumber(true, getLaneOverDetailsEmissionData?.data?.[0]?.emission, 2)}
                  cardDate={t('totalEmissionHeading')}
                  cardSubHeading="tCO2e"
                  imagePath="/images/emissions-new-icon.svg"
                />
              </Col>
              <Col md="4">
                <SustainViewCard
                  testid="card-3"
                  isLoading={getLaneOverDetailsEmissionLoading}
                  isData={!!getLaneOverDetailsEmissionData?.data?.[0]}
                  cardValue={formatNumber(true, getLaneOverDetailsEmissionData?.data?.[0]?.shipment_count, 0)}
                  cardDate={t('totalShipmentHeading')}
                  imagePath="/images/shipment-new-icon.svg"
                />
              </Col>
            </Row>
            <div className="d-flex gap-3 my-3 align-items-center">
              <DateShow dateInfo={emissionDates?.data?.emission_dates} isActive={true} />
            </div>

            <Row className="g-3">
              {/* RPG graph starts */}
              <Col lg="6">
                <RGPGraph
                  testId="rpg-graph-lane-overview"
                  yearlyData1={yearlyData1}
                  totalEmissionToggleId="lane-overview-toggle-total-emission"
                  emissionIntensityToggleId="lane-overview-toggle-intensity-emission"
                  setYearlyData1={setYearlyData1}
                  graphSubHeading={`${getEmmisonName(checkedEmissionsReductionGlide)
                    } of ${laneName?.split("_").join(" to ")} Lane for ${laneCarrierEmission?.data?.year?.[0]} - ${laneCarrierEmission?.data?.year?.[1]}`}
                  graphHeading={t('reductionTitle')}
                  headingUnit={`(${getUnitSign(!checkedEmissionsReductionGlide, configConstants?.data?.default_distance_unit)
                    })`}
                  checked={checkedEmissionsReductionGlide}
                  isLoading={laneCarrierEmissionIsloading}
                  emissionDates={emissionDates}
                  dataArr={laneCarrierEmission}
                  setReloadData={setReloadData}
                  setChecked={setCheckedEmissionsReductionGlide}
                  options={rgpChart({
                    chart: "emissionReductionFacility",
                    options: laneCarrierEmission?.data,
                    isChecked: checkedEmissionsReductionGlide,
                    reloadData: reloadData,
                    label: [
                      {
                        name: "Company Level",
                        key: "company_level",
                        color: (styles.primary),
                      },
                      {
                        name: "Target/Q",
                        key: "targer_level",
                        color: (styles.secondaryBlue),
                      },
                    ],
                  })}
                />
              </Col>
              {/* RPG graph ends */}

              {/* Carrier Emissions for a lane starts*/}
              {!isCompanyEnable(loginDetails?.data, [companySlug.adm, companySlug.tql]) && (

                <Col lg="6">
                  <ChartColumn
                    testId="lane-overview-data"
                    totalEmissionId="lane-overview-carrier-toggle-total-emission"
                    regionEmissionId="lane-overview-carrier-toggle-emission-intensity"
                    name={"Lane-Overview"}
                    checked={checkedEmissions}
                    setChecked={setCheckedEmissions}
                    graphSubHeading={`${getEmmisonName(checkedEmissions)
                      } of ${laneName?.split("_").join(" to ")} Lane for ${graphHeading}`}
                    graphHeading={t('carrierEmissionTitle')}
                    isLoading={laneReductionDetailGraphLoading}
                    dataArr={laneCarrierArr}
                    noDataMessage={`No Carrier Emissions Found for ${laneName}`}
                    options={laneColumnChart({
                      chart: "lane",
                      isLoading: true,
                      lanePageArr: laneCarrierArr,
                      lanePagecontributor: [],
                      lanePagedetractor: [],
                      reloadData: reloadData,
                      unitDto: getGramUnitSign(checkedEmissions),
                      heading: `Average of all carriers (${formatNumber(true, laneReductionDetailGraphData?.data?.average, 1)} ${getGramUnitSign(checkedEmissions)})`
                    })}
                  />
                </Col>)}
              {/* Carrier Emissions for a lane ends*/}

              {/* Table for lane emission of a region */}
              {!isCompanyEnable(loginDetails?.data, [companySlug.adm, companySlug.tql]) && (
                <Col lg="12" md="12">
                  <div className="mainGrayCards py-3">
                    {emissionDates?.data?.emission_dates && (
                      <h6 className="datafrom-txt  fw-semibold mb-2 leftTitle px-3">
                        Emissions of{" "}
                        <span className="text-uppercase datafrom-txt font-14">{laneName?.split("_").join(" to ")}</span>{" "}
                        Lane for {graphHeading}
                        {/* Graph Represents Regions for Q1 2022 */}
                      </h6>
                    )}
                    <div className="">
                      <div className="d-lg-flex mt-3 px-3">
                        <PerformanceHeading />
                        <div className="d-flex align-items-center ps-lg-4 mb-2">
                          <h6 className="mb-0 ps-2">
                            {t('avgEmissions')} (
                            {formatNumber(
                              true,
                              laneCarrierTableDto?.data?.average,
                              1
                            )}{" "}
                            g)
                          </h6>
                        </div>
                      </div>

                      <div className="position-relative d-flex justify-content-end carrierSearchBar px-3">
                        <span>
                          <ImageComponent path="/images/search.svg" className='search-img' />
                        </span>
                        <input
                          type="text"
                          placeholder="Search Carrier Name"
                          value={searchCarrier}
                          onChange={handleSearchCarrier}
                        />
                      </div>
                      <div className="static-table static-vendor-table  mt-4">
                        <div className="tWrap">
                          <div className="tWrap__body">
                            <table data-testid="table-data-lane-overview">
                              <thead>
                                <tr>
                                  <th onClick={() => handleChangeOrder("carrier_name")}>
                                    <div data-testid="carrier-name-change-sort-order" className="pointer d-flex align-items-center">
                                      {t('carrierTitle')}
                                      <span>
                                        <ImageComponent imageName={`${sortIcon("carrier_name", col_name, order)}`} />
                                      </span>
                                    </div>
                                  </th>

                                  <th onClick={() => handleChangeOrder("intensity")}>
                                    <div
                                      data-testid="emission-intensity-change-sort-order"
                                      className="d-flex align-items-center pointer"
                                    >
                                      {t('emissionIntensityHeading')}
                                      <span>
                                        <ImageComponent imageName={`${sortIcon("intensity", col_name, order)}`} />
                                      </span>
                                    </div>
                                    <h6 className="font-10 mb-0">
                                      {`*gCO2e / Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"} of freight`}
                                    </h6>
                                  </th>
                                  <th
                                    data-testid="total-shipments-change-sort-order"
                                    className="pointer"
                                    onClick={() => handleChangeOrder("shipment_count")}
                                  >
                                    {t('totalShipmentHeading')}
                                    <span>
                                      <ImageComponent
                                        imageName={`${sortIcon(
                                          "shipment_count",
                                          col_name,
                                          order
                                        )}`}
                                      />
                                    </span>
                                  </th>
                                  <th
                                    className="pointer"
                                    data-testid="total-emission-change-sort-order"
                                    onClick={() => handleChangeOrder("emission")}
                                  >
                                    {t('totalEmissionHeading')} {" "}
                                    <span>
                                      <ImageComponent
                                        imageName={`${sortIcon(
                                          "emissions",
                                          col_name,
                                          order
                                        )}`}
                                      />
                                    </span>
                                    <br />
                                    <h6 className="font-10 mb-0">tCO2e</h6>
                                  </th>

                                  <th></th>
                                </tr>
                              </thead>
                              <TableBodyLoad loaderTestId="loader spinner" noDataTestId='no-data-found' isLoading={laneCarrierTableDtoLoading} isData={laneCarrierTableDto?.data?.responseData?.length > 0} colSpan={5}>
                                <tbody>
                                  {laneCarrierTableDto?.data.responseData?.map(
                                    (xx: any) => {
                                      return (
                                        <tr
                                          key={xx?.carrier_name}
                                          onClick={() =>
                                            navigate(
                                              `/scope3/carrier-overview/${xx?.["carrier"]}/lane-detail/${laneName}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}/lanes-overview`
                                            )
                                          }
                                          className="m-cursor"
                                        >
                                          <td data-testid="table-data">
                                            <div className="d-flex align-items-center text-capitalize">
                                              <div className="carrierLogoTooltip text-start">
                                                <CarrierRankingTooltip item={xx} />
                                                <Logo path={xx?.carrier_logo} name={xx.carrier_name} />
                                              </div>

                                              {xx?.carrier_name} ({xx?.carrier})
                                            </div>
                                          </td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <div
                                                className="orange-div me-2"
                                                style={{
                                                  backgroundColor: xx?.intensity?.color,
                                                }}
                                              ></div>
                                              {formatNumber(
                                                true,
                                                xx?.intensity?.value,
                                                1
                                              )}
                                            </div>
                                          </td>
                                          <td>
                                            {formatNumber(
                                              true,
                                              xx?.shipment_count,
                                              0
                                            )}
                                          </td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <div
                                                className="orange-div me-2"
                                                style={{
                                                  backgroundColor: xx?.emissions?.color,
                                                }}
                                              ></div>
                                              {formatNumber(
                                                true,
                                                Math.round(xx?.emissions?.value * 10) /
                                                10,
                                                2
                                              )}
                                            </div>
                                          </td>

                                          <td>
                                            <Link
                                              to={`/scope3/carrier-overview/${xx?.carrier}/lane-detail/${laneName}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}/lanes-overview`}
                                            >
                                              More
                                            </Link>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </TableBodyLoad>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="mt-0 lane-pagination d-flex justify-content-end px-3">
                        <nav aria-label="Page navigation example"
                          className=" d-flex justify-content-end select-box mt-3">

                          <Pagination
                            currentPage={currentPage}
                            pageSize={pageSize}
                            total={laneCarrierTableDto?.data?.pagination?.total_count}
                            handlePageSizeChange={(e: any) => {
                              setPageSize(e);
                              setCurrentPage(1)
                            }}
                            handlePageChange={(page: number) => {
                              setCurrentPage(page);
                            }}
                          />

                        </nav>
                      </div>
                    </div>
                  </div>
                </Col>)}
              {/* map */}
              <Col sm="12">
                <div className="px-3 mainGrayCards laneoverviewMap py-3">
                  <div className="emi-inten">
                    <Heading
                      level="4"
                      className="fw-semibold font-20"
                    >{laneName?.split("_").join(" to ")} Lane En-Route</Heading>
                    {getLaneOverDetailsEmissionData?.data?.[0]?.source &&
                      getLaneOverDetailsEmissionData?.data?.[0]?.destination && (
                        <div data-testid="google-map-data" className='position-relative'>
                          <MapComponent showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>
                            <GoogleMapView
                              reloadData={true}
                              origin={getLaneOverDetailsEmissionData?.data?.[0]?.source}
                              destination={getLaneOverDetailsEmissionData?.data?.[0]?.destination}
                            />
                          </MapComponent>
                        </div>
                      )}

                  </div>
                </div>
              </Col>
            </Row>
          </div>
          {/*main lane overview section ends */}
        </div>
      </section>
      {/* LanesOverview dashboard ends */}
    </>
  );
};

export default LaneOverview;
