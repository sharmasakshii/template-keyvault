import { Row, Col } from "reactstrap";
import TitleComponent from "../../component/tittle";
import DataSource from "../../component/aboutLink";
import { lineColumnChart } from "../../utils/highchart/lineColumnChart";
import ChartColumn from "../../component/charts/chartColumn";
import SelectDropdown from "../../component/forms/dropdown";
import Heading from "../../component/heading";
import FacilityViewController from "./facilityViewController";
import ImageComponent from "../../component/images";
import {
  sortIcon,
  getQuarterName,
  formatNumber,
  getSubTitleFacility,
  checkRolePermission,
} from "../../utils";
import ButtonComponent from "component/forms/button";
import PerformanceHeading from "component/PerfomanceHeading";
import { defaultQuarter } from "constant";
import DateFilter from "component/forms/dateFilter";
import { setRegionalId } from "store/auth/authDataSlice";

const FacilityView = () => {
  // Importing all states and functions from Facility Controller
  const {
    dataCheck,
    handleDownloadCsv,
    companyName,
    regionalLevel,
    regions,
    yearlyData,
    quarterDetails,
    checked,
    facilityGraphDetails,
    regionPageArr,
    facilityGraphDetailLoading,
    reloadData,
    setRegionalLevel,
    setReloadData,
    setYearlyData,
    setQuarterDetails,
    setChecked,
    regionOption,
    col_name,
    order,
    facilityTableDetails,
    facilityTableDetailLoading,
    handleChangeOrder,
    navigate,
    dispatch,
    loginDetails,
    configConstants,
    t
  } = FacilityViewController();

  const defaultUnit = configConstants?.data?.default_distance_unit
  
  return (
    <>
      {/* Title component */}
      <TitleComponent title={"Facility"} pageHeading={t('byFacilityTitle')} />
      {/* Main section */}
      <section className="facility-screen pb-4" data-testid="facility">
        <div className="facility-screen-wraper pb-5">
          <div className="facility-heading">
            {/* Row for header */}
            {/* Display current date and time */}
          </div>
          {/* Row for content */}
          <div className="facility-section py-3 px-2">
            <div className="d-flex flex-wrap justify-content-between border-bottom mb-3">
              <div className="select-box d-flex flex-wrap mb-3 gap-2">
                {/* Dropdown for selecting regional level */}
                {!checkRolePermission(dataCheck?.userdata, "regionalManager") && (
                  <SelectDropdown
                    aria-label="regions-data-dropdown-facility"
                    disabled={facilityGraphDetailLoading}
                    options={regionOption}
                    placeholder="Region"
                    selectedValue={regionOption?.filter(
                      (el: any) => el.value === regionalLevel?.toString()
                    )}
                    onChange={(e: any) => {
                      setRegionalLevel(e.value);
                      setReloadData(false);
                      dispatch(setRegionalId(e.value))
                    }}
                  />
                )}
                <DateFilter
                  isLoading={facilityGraphDetailLoading}
                  yearDropDownId="year-dropdown-facility"
                  quarterDropDownId="quarter-dropdown-facility"
                  yearlyId={yearlyData}
                  quarterId={quarterDetails}
                  updateYear={(e: any) => {
                    setYearlyData(Number(e.value));
                    setQuarterDetails(defaultQuarter);
                    setReloadData(false);
                  }}
                  updateQuarter={(e: any) => {
                    setQuarterDetails(e.value);
                    setReloadData(false);
                  }}
                  isWeekDropdownShow={false}
                />
              </div>
              <ButtonComponent
                disabled={!facilityTableDetails?.data.length}
                onClick={handleDownloadCsv}
                imagePath="/images/export.svg"
                data-testid="export-btn-facility"
                text={t('export')}
                btnClass="btn-deepgreen border-0 font-14 font-xxl-16 mb-3 exportSvg-icon"
              />
            </div>
            <Row className="g-3">
              <Col lg="6" md="12">
                <ChartColumn
                  name={"Facility"}
                  checked={checked}
                  setChecked={setChecked}
                  regionEmissionId="emission-intensity-toggle-region"
                  totalEmissionId="total-emission-toggle-region"
                  testId="graph-data-facility"
                  graphSubHeading={`${t('facilityTitle')} ${getSubTitleFacility(
                    checked,
                    regionalLevel,
                    regions?.data?.regions
                  )} for ${getQuarterName(loginDetails, 
                    quarterDetails,
                    yearlyData
                  )} ${yearlyData}`}
                  isLoading={facilityGraphDetailLoading}
                  dataArr={regionPageArr}
                  options={lineColumnChart({
                    chart: "region",
                    regionPageArr: regionPageArr,
                    reloadData: reloadData,
                    unitDto: facilityGraphDetails?.data?.unit,
                    companyName: companyName,
                    heading: `${t('avgOfAll')} ${t('facility')} (
                      ${formatNumber(
                      true,
                      facilityGraphDetails?.data?.average,
                      1
                    )}
                      <span>${facilityGraphDetails?.data?.unit}</span>)`
                  })}
                />
              </Col>
              <Col lg="6" md="12">
                <div className="mainGrayCards h-100">
                  <div className="p-3">
                    <Heading
                      level="6"
                      content={`${t('facilityTitle')} ${getSubTitleFacility(
                        checked,
                        regionalLevel,
                        regions?.data?.regions
                      )} for ${getQuarterName(loginDetails, 
                        quarterDetails,
                        yearlyData
                      )} ${yearlyData}`}
                      className="mb-3 laneBreakdownHeading fw-semibold font-xxl-20  font-14"
                    />
                    <PerformanceHeading />
                  </div>

                  <div className="static-table pb-3">
                    <div className="tWrap">
                      <div className="tWrap__body">
                        {facilityTableDetailLoading && (
                          <div
                            data-testid="table-data-loading-facility"
                            className="graph-loader d-flex justify-content-center align-items-center"
                          >
                            <div className="spinner-border  spinner-ui">
                              <span className="visually-hidden"></span>
                            </div>
                          </div>
                        )}
                        {!facilityTableDetailLoading &&
                          facilityTableDetails?.data?.length > 0 && (
                            <table data-testid="table-graph-data-facility">
                              <thead>
                                <tr>
                                  <th>
                                    <div className="d-flex align-items-center">
                                      {t('facilityTitle')}
                                    </div>
                                  </th>
                                  <th className="pointer">
                                    <button
                                      data-testid="change-order-intensity-facility"
                                      className="d-flex bg-transparent p-0 border-0 text-start"
                                      onClick={() =>
                                        handleChangeOrder("intensity")
                                      }
                                    >
                                      {t('emissionIntensityHeading')}
                                      <span>
                                        <ImageComponent
                                          imageName={`${sortIcon(
                                            "intensity",
                                            col_name,
                                            order
                                          )}`}
                                        />
                                      </span>
                                    </button>
                                    <h6 className="font-10">
                                    {t(defaultUnit === "miles" ? "gco2e/tonMilesUnit" : "gco2e/tonKmsUnit")}
                                    </h6>
                                  </th>
                                  <th className="pointer">
                                    <button
                                      data-testid="change-order-shipments-facility"
                                      className="d-flex bg-transparent p-0 border-0 text-start"
                                      onClick={() =>
                                        handleChangeOrder("shipments")
                                      }
                                    >
                                      {t('totalShipmentHeading')}
                                      <span>
                                        <ImageComponent
                                          imageName={`${sortIcon(
                                            "shipments",
                                            col_name,
                                            order
                                          )}`}
                                        />
                                      </span>
                                    </button>
                                  </th>
                                  <th className="pointer">
                                    <button
                                      data-testid="change-order-emission-facility"
                                      className="d-flex bg-transparent p-0 border-0 text-start"
                                      onClick={() =>
                                        handleChangeOrder("emission")
                                      }
                                    >
                                      {t('totalEmissionHeading')}
                                      <span>
                                        <ImageComponent
                                          imageName={`${sortIcon(
                                            "emission",
                                            col_name,
                                            order
                                          )}`}
                                        />
                                      </span>
                                    </button>
                                    <h6 className="font-10">{t('tco2eUnit')}</h6>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {facilityTableDetails?.data?.map(
                                  (xx: any, index: any) => (
                                    <tr
                                      data-testid={`table-row-data-facility${index}`}
                                      key={xx?.["Facility.name"]}
                                      onClick={() =>
                                        navigate(
                                          `/scope3/facility-overview/${xx?.["Facility.id"]
                                          }/${yearlyData}/${quarterDetails || 0
                                          }`
                                        )
                                      }
                                      className="m-cursor"
                                    >
                                      <td>{xx?.["Facility.name"]}</td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div
                                            style={{
                                              backgroundColor: `${xx?.intensity?.color}`,
                                            }}
                                            className="orange-div me-2"
                                          ></div>
                                          {formatNumber(
                                            true,
                                            xx?.intensity?.value,
                                            1
                                          )}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          {formatNumber(true, xx.shipments, 0)}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div
                                            style={{
                                              backgroundColor: `${xx?.emission?.color}`,
                                            }}
                                            className="orange-div me-2"
                                          ></div>
                                          {formatNumber(
                                            true,
                                            xx?.emission?.value,
                                            2
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          )}

                        {!facilityTableDetailLoading &&
                          facilityTableDetails?.data?.length === 0 && <div className="d-flex justify-content-center align-items-center my-5 py-5">
                            <p>{t('noData')}</p>
                          </div>}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <DataSource />
          </div>
        </div>
      </section>
    </>
  );
};

export default FacilityView;
