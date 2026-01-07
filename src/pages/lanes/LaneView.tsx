import { Table } from "reactstrap";
import TitleComponent from "component/tittle";
import Heading from "component/heading";
import DataSource from "component/aboutLink";
import { Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import LanesController from "./laneController";
import ImageComponent from "component/images";
import {
  getGraphTitle, sortIcon,
  getQuarterName,
  getRegionName,
  formatNumber,
  sortList,
  isCompanyEnable,
  checkedNullValue
} from "utils";
import Logo from "component/logo";
import LaneTableHeading from "./LaneTableHeading";
import CarrierRankingTooltip from "component/carrierRankingTooltip";
import ButtonComponent from "component/forms/button";
import Pagination from 'component/pagination';
import PerformanceHeading from "component/PerfomanceHeading"
import { companySlug } from "constant"
import SearchODPair from 'component/forms/searchODpair/SearchODPair';
import DateFilter from "component/forms/dateFilter";
import RegionFilter from "component/forms/regionFilter";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import TableBodyLoad from 'component/tableBodyHandle';
import { setDivisionId, setRegionalId } from "store/auth/authDataSlice";

/**
 *
 * @returns Lanes view page
 */

const LaneView = () => {
  // Importing all states and functions from lanes controller
  const {
    configConstants,
    quarterDetails,
    yearlyData,
    regionalLevel,
    regionName,
    laneEmissionData,
    isLaneEmissionDataLoading,
    pageSize,
    setPageSize,
    setRegionalLevel,
    setYearlyData,
    setQuarterDetails,
    regionOption,
    colName,
    order,
    navigate,
    handleChangeOrder,
    getCarrier,
    carrierEmissionData,
    isCarrierEmissionDataLoading,
    handleLaneSort,
    orderLane,
    colNameLane,
    handleSortBy,
    setCurrentPage,
    currentPage,
    childRef,
    handleChangeLocation,
    resetLane,
    pId,
    setPId,
    divisionOptions,
    divisionLevel,
    setDivisionLevel,
    regions,
    divisions,
    timePeriodList,
    loginDetails,
    weekId,
    setWeekId,
    dispatch
  } = LanesController();

  const graphHeading = getGraphTitle({
    year: yearlyData,
    regionId: regionalLevel,
    division: divisionLevel,
    pId: pId,
    weekId: weekId,
    quarter: quarterDetails,
    regionList: regions,
    divisionList: divisions,
    timeList: timePeriodList,
    loginDetails
  })
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleToggle = (index: number, laneName: string) => {
    const key = index.toString();

    if (activeKey !== key) { // Only call getCarrier if we're opening the accordion item
      getCarrier(laneName);
    }
    setActiveKey(activeKey === key ? null : key);
  };


  return (
    <>
      {/* Lanes dashboard starts */}
      <TitleComponent
        title={"Lanes"}
        pageHeading={t('byLaneTitle')}
      />
      <section
        className="lane-screen laneNew-screen pb-4"
        data-testid="lanes"
      >
        <div className="lane-screen-wraper bg-transparent border-0 p-0 text-start">
          <div className="lane-section py-3 px-2 overview-section">
            <div className="emi-inten mb-3">
              <Heading
                level="4"
                content={`${graphHeading} Lane Breakdown by Tonnage and Total Emissions`}
                className="fw-medium font-16 font-xxl-20 laneBreakdownHeading"
              />
            </div>
            <div className="select-box filters d-flex flex-wrap mb-3 gap-2 align-items-center p-3">
              <RegionFilter
                isDisabled={isLaneEmissionDataLoading}
                regionAriaLabel="region-dropdown"
                regionOption={regionOption}
                divisionOptions={divisionOptions}
                regionalLevel={regionalLevel}
                divisionLevel={divisionLevel}
                handleChangeDivision={(e: any) => {
                  setDivisionLevel(e.value)
                  dispatch(setDivisionId(e.value))
                  setRegionalLevel("");
                  setCurrentPage(1)
                  dispatch(setRegionalId(""))
                }}
                handleChangeRegion={(e: any) => {
                  setRegionalLevel(e.value);
                  dispatch(setRegionalId(e.value))
                  dispatch(setRegionalId(""))
                  setCurrentPage(1)
                }}
              />
              {/* Dropdown for selecting yearly data */}
              <DateFilter
                yearDropDownId="year-dropdown"
                quarterDropDownId="quarter-dropdown"
                isLoading={isLaneEmissionDataLoading}
                yearlyId={yearlyData}
                quarterId={quarterDetails}
                pId={pId}
                setPId={setPId}
                weekId={weekId}
                setWeekId={setWeekId}
                updateYear={(e: any) => {
                  setYearlyData(e.value)
                  setQuarterDetails(0)
                  setPId(0)
                  setWeekId(0)
                  setCurrentPage(1)
                }}
                updateQuarter={(e: any) => {
                  setQuarterDetails(e.value)
                  setPId(0)
                  setWeekId(0)
                  setCurrentPage(1)
                }}
              />
              <SearchODPair
                ref={childRef}
                data-testid="search-lane-filter"
                handleChangeLocation={handleChangeLocation}
                handleGetSearchData={() => { }}
                handleResetODpair={resetLane}
                page="LaneEmissionsComparison"
                odParams={{
                  "region_id": regionalLevel,
                  year: yearlyData,
                  quarter: quarterDetails,
                }} />
            </div>
            <div className="lanes-data position-relative">
              <div className="lane-breakdown position-relative">
                <div className="d-lg-flex p-3 pt-4 performance">
                  <PerformanceHeading />
                  <div className="d-flex align-items-center mb-2">
                    <h6 className="mb-0 ps-2 font-xxl-14 font-12">
                      {t('avgEmissionsTitle')}
                      ({laneEmissionData?.data?.average} tCO2e)
                    </h6>
                  </div>
                </div>

                <div className="tab-content bg-transparent border-0 p-0 pb-3">
                  <Table className="mt-0 mb-0 w-100 lanenewTable" data-testid="lane-table-data">
                    <thead>
                      <tr className="topRow">
                        <th data-testid="lane-change-name" onClick={() => handleLaneSort("name")}>
                          <div className="d-flex align-items-center fw-normal">
                            {t('laneTitle')}
                            <span className="pe-auto d-flex">
                              <ImageComponent className="pe-0"
                                imageName={`${sortIcon(
                                  "name",
                                  colNameLane,
                                  orderLane
                                )}`}
                              />
                            </span>
                          </div>
                        </th>
                        <th data-testid="emission-intensity-name" onClick={() => handleLaneSort("intensity")} className="customWidth">
                          <div className="d-flex align-items-baseline font-12 font-xxl-14 fw-normal">
                            <span className="table-heading">{t('emissionIntensityHeading')}{" "}</span>

                            <span className="pe-auto d-flex">
                              <ImageComponent className="pe-0"
                                imageName={`${sortIcon(
                                  "intensity",
                                  colNameLane,
                                  orderLane
                                )}`}
                              />
                            </span>
                          </div>
                          <h6 className="font-10">
                            {`*gCO2e / Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"} of freight`}
                            <br />
                          </h6>
                        </th>
                        <th data-testid="total-shipment-name" onClick={() => handleLaneSort("shipment_count")} className="customWidth">
                          <div className="d-flex align-items-baseline font-12 font-xxl-14 fw-normal">
                            <span className="table-heading">{t('totalShipmentHeading')}{" "}</span>
                            <span className="pe-auto d-flex">
                              <ImageComponent className="pe-0"
                                imageName={`${sortIcon(
                                  "shipment_count",
                                  colNameLane,
                                  orderLane
                                )}`}
                              />
                            </span>
                          </div>
                        </th>
                        <th data-testid="total-emissions-name" onClick={() => handleLaneSort("emissions")} className="customWidth">
                          <div className="d-flex align-items-baseline font-12 font-xxl-14 fw-normal">
                            <span className="table-heading">{t('totalEmissionHeading')}{" "}</span>
                            <span className="pe-auto d-flex">
                              <ImageComponent className="pe-0"
                                imageName={`${sortIcon(
                                  "emissions",
                                  colNameLane,
                                  orderLane
                                )}`}
                              />
                            </span>
                          </div>
                          <h6 className="font-10">tCO2e</h6>
                        </th>
                        <th data-testid="above-below-average" onClick={() => handleLaneSort("ab_average")} className="customWidth">
                          <div className="d-flex align-items-baseline font-12 font-xxl-14 fw-normal">
                            <span className="table-heading">Above/Below Emissions Average{" "}</span>
                            <span className="pe-auto d-flex">
                              <ImageComponent className="pe-0"
                                imageName={`${sortIcon(
                                  "ab_average",
                                  colNameLane,
                                  orderLane
                                )}`}
                              />
                            </span>
                          </div>
                        </th>
                        <th data-testid="sort-by" className="customWidth">
                          <div className="d-flex align-items-center font-12 font-xxl-14">
                            <span className="table-heading fw-normal">Sort By</span>
                            <div className="ms-2 d-flex">
                              <div className="toolTip">
                                <span className="tooltipText">{t('highPerformance')}</span>
                                <ButtonComponent data-testid="sort-asc" text="" onClick={() => handleSortBy("asc")} btnClass="greenToolTipActive p-0">
                                  <div className={`sort-arrow ${orderLane === "asc" && colNameLane === "intensity" && "sort-arrow-active"}`}>
                                    <ImageComponent path="/images/greenArrowDowm.svg" className="pe-0" />
                                  </div>
                                </ButtonComponent>
                              </div>
                              <div className="toolTip">
                                <span className="tooltipText">{t('lowPerformance')}</span>
                                <ButtonComponent data-testid="sort-desc" text="" onClick={() => handleSortBy("desc")} btnClass="greenToolTipActive p-0">
                                  <div className={`sort-arrow ${orderLane === "desc" && colNameLane === "intensity" && "sort-arrow-active-orange"}`}>
                                    <ImageComponent path="/images/redDownArrow.svg" className="pe-0" />
                                  </div>
                                </ButtonComponent>
                              </div>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <TableBodyLoad isLoading={isLaneEmissionDataLoading} isData={laneEmissionData?.data?.responseData?.length > 0} colSpan={6}>

                      <tr>
                        <td className="p-0" colSpan={6}>
                          {!isLaneEmissionDataLoading && (
                            <Accordion
                              className={`newAccordion ${isCompanyEnable(loginDetails?.data, [companySlug.adm, companySlug?.tql]) ? 'remove-arrow' : ''}`}
                            >

                              {laneEmissionData?.data?.responseData?.map(
                                (x: any, index: number) => (
                                  <tr className="d-block" key={x?.name}>
                                    <Accordion.Item
                                      key={x.name}
                                      eventKey={index?.toString()}
                                    >
                                      <Accordion.Header data-testid={`click-row-lane-${index}`}
                                        onClick={() => handleToggle(index, x?.name)}
                                      >
                                        <td>
                                          <Link className="text-dark" to={`/scope3/by-lane-planning/${x?.name}/lanes`}>
                                            <div className="d-flex align-items-center gap-2 text-decoration-underline font-14 font-xxl-14 firstTD">
                                              <span
                                                className={
                                                  "orange-div"
                                                }
                                                style={{
                                                  backgroundColor: x?.color,
                                                }}
                                              ></span>
                                              <h3 className="font-14 font-xxl-14 fw-semibold mb-0">{x?.name.split("_").join(" to ")}</h3>
                                            </div>
                                          </Link>
                                        </td>

                                        <td className="fw-normal customWidth">
                                          <div className="d-flex align-items-center table-show fw-normal">
                                            <div className="font-14 font-xxl-14">
                                              {formatNumber(
                                                true,
                                                x?.intensity,
                                                1
                                              )}{" "}
                                              g
                                            </div>
                                          </div>
                                        </td>

                                        <td className="fw-normal customWidth">
                                          <div className="table-show font-14 font-xxl-14">
                                            {formatNumber(
                                              true,
                                              x?.shipment_count,
                                              0
                                            )}
                                          </div>
                                        </td>
                                        <td className="fw-normal customWidth">
                                          <div className="table-show font-14 font-xxl-14">
                                            {formatNumber(
                                              true,
                                              x?.emissions,
                                              2
                                            )}
                                          </div>
                                        </td>
                                        <td className="fw-normal customWidth">
                                          <div className="table-show font-14 font-xxl-14">
                                            {x?.ab_average > 0 && "+"}{formatNumber(
                                              true, x?.ab_average, 1)}
                                          </div>
                                        </td>
                                        <td className="customWidth ">
                                          <Link
                                            to={`/scope3/lanes-overview/${x?.name}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}`}
                                            className="text-decoration-underline moreLink fw-normal table-show font-14 font-xxl-14"
                                          >
                                            More
                                          </Link>
                                        </td>
                                      </Accordion.Header>
                                      {!isCompanyEnable(loginDetails?.data, [companySlug.adm, companySlug?.tql]) && (
                                        <Accordion.Body className="px-0 pt-0">
                                          <h6 className="datafrom-txt mb-2 pt-4 px-3">
                                            Emissions Intensity of{" "}
                                            {getRegionName(
                                              regionName,
                                              regionalLevel,
                                              true
                                            )}{" "}
                                            for{" "}
                                            {getQuarterName(loginDetails,
                                              quarterDetails,
                                              yearlyData
                                            )}{" "}
                                            {yearlyData}
                                          </h6>

                                          {isCarrierEmissionDataLoading ? (
                                            <div className="graph-loader d-flex justify-content-center align-items-center py-5">
                                              <div className="spinner-border  spinner-ui">
                                                <span className="visually-hidden"></span>
                                              </div>
                                            </div>
                                          ) :
                                            (<Table
                                              data-testid={`accordion-table-data-${index}`}
                                              responsive
                                              className="mt-0 mb-0 pb-0 lanesnew-table w-100"
                                            >
                                              <LaneTableHeading
                                                emissionIntensity={`emission-intensity-${index}`}
                                                totalShipments={`total-shipments-${index}`}
                                                totalEmissions={`total-emission-${index}`}
                                                shipmentCount={`shipment-count-${index}`}
                                                handleChange={
                                                  handleChangeOrder
                                                }
                                                column={colName}
                                                order={order}
                                                configConstants={configConstants}
                                              />

                                              <tbody>
                                                {sortList(
                                                  [...carrierEmissionData?.data || []],
                                                  colName,
                                                  order
                                                )?.map((res: any) => (
                                                  <tr
                                                    key={res?.carrier_name}
                                                    data-testid={`carrier-row-nav-${res?.carrier_name}`}
                                                    onClick={() =>
                                                      navigate(
                                                        `/scope3/lanes-overview/${x?.["name"]}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}`
                                                      )
                                                    }
                                                    className="m-cursor"
                                                  >
                                                    <td className="">
                                                      <div className="d-flex align-items-center">
                                                        <div className="carrierLogoTooltip d-flex align-items-center">
                                                          <CarrierRankingTooltip
                                                            item={res}
                                                          />
                                                          <Logo
                                                            path={
                                                              res?.carrier_logo
                                                            }
                                                            name={
                                                              res?.carrier_name
                                                            }
                                                          />({res?.carrier})
                                                        </div>
                                                      </div>
                                                    </td>

                                                    <td className="">
                                                      <div className="d-flex align-items-center">
                                                        <div className="me-2"></div>
                                                        {formatNumber(
                                                          true,
                                                          res?.intensity,
                                                          1
                                                        )}
                                                      </div>
                                                    </td>
                                                    <td className="">
                                                      {res.shipment_count}
                                                    </td>
                                                    <td className="">
                                                      <div className="d-flex align-items-center">
                                                        {formatNumber(
                                                          true,
                                                          res?.emissions,
                                                          2
                                                        )}
                                                      </div>
                                                    </td>

                                                    <td className="">
                                                      <div className="d-flex align-items-center">
                                                        <div className="me-2">
                                                          {Number.parseFloat(
                                                            res.shipment_count
                                                          ) !== 0
                                                            ? (
                                                              (res.shipment_count /
                                                                x?.shipment_count) *
                                                              100
                                                            ).toFixed(1)
                                                            : 0}
                                                          %
                                                        </div>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>

                                            </Table>)}
                                        </Accordion.Body>
                                      )}
                                    </Accordion.Item>
                                  </tr>
                                )
                              )}

                            </Accordion>
                          )}
                        </td>
                      </tr>

                    </TableBodyLoad>
                  </Table>
                </div>
                <div className="pb-3">
                  <nav aria-label="Page navigation example" className=" d-flex justify-content-end select-box align-items-center">
                    <Pagination
                      currentPage={currentPage}
                      pageSize={pageSize}
                      total={laneEmissionData?.data?.pagination?.total_count}
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
          </div>
          <DataSource />
        </div>
      </section>
    </>
  );
};

export default LaneView;
