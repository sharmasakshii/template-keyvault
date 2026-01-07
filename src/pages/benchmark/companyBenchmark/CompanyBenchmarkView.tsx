import TitleComponent from "../../../component/tittle";
import SelectDropdown from "../../../component/forms/dropdown";
import { Link } from "react-router-dom";
import CompanyBenchmarkController from "./companyBenchmarkController";
import { Row, Col, Table } from "reactstrap";
import {
  capitalizeText,
  formatNumber,
  returnBandNumber,
  typeCheck,
  checkNumberUndefined,
  getRegionOptionsBenchmark,
  checkRolePermission,
  isCompanyEnable,
} from "../../../utils";
import BackBtn from "component/forms/backLink";
import Heading from "component/heading";

import ButtonComponent from "component/forms/button";
import Form from "react-bootstrap/Form";
import ChartHighChart from "../../../component/highChart/ChartHighChart";
import { lineColumnChart } from "../../../utils/highchart/lineColumnChart";
import ImageComponent from "component/images";
import Logo from "component/logo";
import TableHeader from "pages/benchmarkCarrierTable/CarrierTableHeader";
import LaneTableHeader from "pages/benchmarkLaneTable/LaneTableHeader";
import IntensityMarker from "../IntensityMarker";
import CarrierRankingTooltip from "../../../component/carrierRankingTooltip"
import Spinner from "component/spinner";
import { companySlug } from "constant";
import TableBodyLoad from "component/tableBodyHandle";

/**
 *
 * @returns Lanes view page
 */

const CompanyBenchmarkView = () => {
  // Importing all states and functions from lanes controller
  const {
    companyName,
    isPageLoading,
    quarterDetails,
    isLoadingGetBand,
    setQuarterDetails,
    bandRange,
    yearlyData,
    setYearlyData,
    lowCarrierEmission,
    setLowCarrierEmission,
    lowIndustryStandardEmission,
    setLowIndustryStandardEmission,
    regionId,
    dataCheck,
    setRegionId,
    benchmarkDetailSwitch,
    setBenchmarkDetailSwitch,
    bandNumber,
    setBandNumber,
    benchmarkCompanyDetail,
    benchmarkRegionList,
    benchmarkCompanyCarrierEmissionsList,
    industryStandardEmissionsLoading,
    industryStandardEmissionsList,
    emissionIntensityTrendDto,
    emissionIntensityTrendLoading,
    benchmarkLCompanyarrierEmissionsLoading,
    yearOption,
    quarterOption,
    params,
    benchmarkCompanyDetailLoading,
    loginDetails
  } = CompanyBenchmarkController();

  let quarterRouteCond = quarterDetails || "all";
  return (
    <>
      {/* Lowe's Benchmarks dashboard starts */}
      <section data-testid="company-benchmark" className="pb-4 pt-2 px-2">
        <TitleComponent title={"Benchmarks"} pageHeading={`${companyName} Benchmarks`} />

        <div className="main-lowerbench pb-3">
          <div className="d-flex flex-wrap emission-outer justify-content-between align-items-center border-bottom pb-3">
            <div className="d-flex flex-wrap gap-2">
              <BackBtn backBtnTestId="back-btn-company-overview" link="scope3/benchmarks" />
              <div className="emission-left">
                <ImageComponent path="/images/co2.svg" />
                <Heading
                  level="4"
                  className="fw-semibold font-20 mb-0"
                >Emissions Intensity by {typeCheck(params?.type === "weight", "Weight", "Distance")}</Heading>
                <h5 className="fw-semibold font-20 mb-0">
                  {returnBandNumber(bandRange)?.filter((el: any) => el.value === bandNumber)?.[0]?.label}{" "}
                  {typeCheck(params?.type === "weight", "Pounds", "Mile")}
                </h5>
              </div>
            </div>
            <div className="emission-right">
              <div className="toggle-switch">
                <Form className="custom-form">
                  <span>WTW</span>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    data-testid="toggle-Detail"
                    checked={benchmarkDetailSwitch}
                    onChange={() =>
                      setBenchmarkDetailSwitch(!benchmarkDetailSwitch)
                    }
                    className=""
                    disabled={benchmarkCompanyDetailLoading}
                  />
                  <span>TTW</span>
                </Form>
              </div>
              <div className="select-box">
                <SelectDropdown
                  id="exampleSelect"
                  aria-label="ranges-data-dropdown-companyBechmark"
                  name="select"
                  type="select"
                  disabled={benchmarkCompanyDetailLoading || isLoadingGetBand}
                  selectedValue={returnBandNumber(bandRange)?.filter((el: any) => el.value === bandNumber)}
                  options={returnBandNumber(bandRange)}
                  onChange={(e: any) => {
                    setBandNumber(e.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="ql-outer pb-3 select-box gap-2">

            <SelectDropdown
              id="exampleSelect"
              name="select"
              aria-label="year-drop-down-companyBenchmarkView"
              customClass="yearDropdown"
              type="select"
              disabled={isPageLoading}
              options={yearOption}
              selectedValue={yearOption?.filter(
                (el: any) => el.value === yearlyData
              )}
              onChange={(e: any) => {
                setYearlyData(e.value);
              }}
            />


            <SelectDropdown
              id="exampleSelect"
              aria-label="quarter-drop-down-companyBenchmarkView"
              name="select"
              customClass="quarterDropdown"
              type="select"
              disabled={isPageLoading}
              selectedValue={quarterOption?.filter(
                (el: any) => el.value === quarterDetails
              )}
              options={quarterOption}
              onChange={(e: any) => {
                setQuarterDetails(e.value);
              }}
            />

          </div>
          <Row className="mb-3 g-3">
            <Col lg={6} md={12}>
              <div data-testid="card-1" className="grey-bg">
                <div className="emission-sipment pt-0 border-bottom-0">
                  <div className="icon-text"></div>
                  <div className="average-outer emasion-average">
                    <h4>
                      <span>{companyName}</span>
                    </h4>{" "}
                    <span className="line"></span>
                    <h5>
                      <span>Industry Average</span>
                    </h5>
                  </div>
                </div>
                {benchmarkCompanyDetailLoading ? <Spinner spinnerClass='mt-5
                justify-content-center'/> : (
                  <>
                    <div className="emission-sipment pt-0">
                      <div className="icon-text">
                        <ImageComponent path="/images/emissions-Intensity.svg" />
                        <div className="text-inner">
                          <h5>Emissions Intensity</h5>
                          <p>gCO2e / Ton-Mile of freight</p>
                        </div>
                      </div>
                      <div className="average-outer emasion-average">
                        <h4>
                          <span className="custom-h4">
                            {formatNumber(
                              true,
                              benchmarkCompanyDetail?.data?.mileBands
                                ?.company_intensity,
                              1
                            )}
                          </span>
                        </h4>{" "}
                        <span className="line"></span>
                        <h5>
                          <span className="custom-h5">
                            {formatNumber(
                              true,
                              benchmarkCompanyDetail?.data?.mileBands
                                ?.industry_intensity,
                              1
                            )}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="emission-sipment">
                      <div className="icon-text">
                        <ImageComponent path="/images/shipments.svg" />

                        <div className="text-inner">
                          <h5>Shipments</h5>
                        </div>
                      </div>
                      <div className="average-outer emasion-average">
                        <h4>
                          <span className="custom-h4">
                            {formatNumber(
                              true,
                              benchmarkCompanyDetail?.data?.mileBands
                                ?.company_shipment,
                              0
                            )}
                          </span>
                        </h4>{" "}
                        <span className="line"></span>
                        <h5>
                          <span className="custom-h5">
                            {formatNumber(
                              true,
                              benchmarkCompanyDetail?.data?.mileBands
                                ?.industry_shipments,
                              0
                            )}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div className="emission-sipment border-bottom-0 pb-0">
                      <div className="icon-text">
                        <ImageComponent path="/images/lanes.svg" />

                        <div className="text-inner">
                          <h5>Lanes</h5>
                        </div>
                      </div>
                      <div className="average-outer emasion-average">
                        <h4>
                          <span className="custom-h4">
                            {formatNumber(
                              true,

                              benchmarkCompanyDetail?.data?.mileBands
                                ?.company_lane_count,
                              0
                            )}
                          </span>
                        </h4>{" "}
                        <span className="line"></span>
                        <h5>
                          <span className="custom-h5">
                            {formatNumber(
                              true,

                              benchmarkCompanyDetail?.data?.mileBands
                                ?.industry_lane_count,
                              0
                            )}
                          </span>
                        </h5>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <Row>
                <Col lg={6}>
                  <div data-testid="card-2" className="emission-sipment innermodal-outer">
                    <div className="icon-text">
                      <ImageComponent path="/images/Intermodal.svg" />

                      <div className="text-inner">
                        <h5>Intermodal Index</h5>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="average-outer">
                      <h4>
                        {formatNumber(
                          true,

                          benchmarkCompanyDetail?.data?.interModelIndex
                            ?.company_intermodal_index,
                          1
                        )}{" "}
                        <span>
                          {companyName}{" "}
                        </span>
                      </h4>{" "}
                      <span className="line"></span>
                      <h5>
                        {formatNumber(
                          true,

                          benchmarkCompanyDetail?.data?.interModelIndex
                            ?.intermodal_index,
                          1
                        )}
                        <span>Industry Average</span>
                      </h5>
                    </div>
                    <div className="view-btn mt-3">
                      <ButtonComponent
                        text="View Recommendations"
                        btnClass="btn btn-primary view-recommend font-14 p-2"
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div data-testid="card-3" className="emission-sipment innermodal-outer">
                    <div className="icon-text">
                      <ImageComponent path="/images/alternative.svg" />

                      <div className="text-inner">
                        <h5>Alternative Fuel Index</h5>
                      </div>
                    </div>
                    <hr></hr>
                    <div className="average-outer fuel-outer">
                      <h4>
                        {formatNumber(
                          true,

                          benchmarkCompanyDetail?.data?.alternateIndex
                            ?.company_alternate_index,
                          1
                        )}{" "}
                        <span>
                          {companyName}{" "}
                        </span>
                      </h4>{" "}
                      <span className="line"></span>
                      <h5>
                        {formatNumber(
                          true,

                          benchmarkCompanyDetail?.data?.alternateIndex
                            ?.alternate_index,
                          1
                        )}
                        <span>Industry Average</span>
                      </h5>
                    </div>
                    <div className="view-btn mt-3">
                      <ButtonComponent
                        text="View Recommendations"
                        btnClass="btn btn-primary view-recommend font-14 p-2"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3 g-3">
            <Col lg={6} md={12}>
              <div className="intencity-outer h-100">
                <h4 className="fw-semibold font-xxl-20 font-16">
                  Emissions Intensity Trends: {companyName} Compared to Benchmark
                </h4>
                {!checkRolePermission(dataCheck?.userdata, "regionalManager") && <div className="region-outer select-box">
                  <SelectDropdown
                    id="exampleSelect"
                    name="select"
                    type="select"
                    aria-label="regions-data-dropdown-companyBechmark"
                    disabled={emissionIntensityTrendLoading}
                    selectedValue={getRegionOptionsBenchmark(
                      benchmarkRegionList?.data
                    )?.filter((el: any) => el.value === regionId)}
                    onChange={(e: any) => {
                      setRegionId(e?.value);
                    }}
                    options={getRegionOptionsBenchmark(
                      benchmarkRegionList?.data
                    )}
                  />
                </div>}
                <div className="h-100 inner-data-region slider-icons position-relative highchart-benchmark">
                  <ChartHighChart
                    testId="high-chart-emission-intensity"
                    options={lineColumnChart({
                      chart: "emissionIntensityTrends",
                      xkey: "company_intensity",
                      ykey: "industry_intensity",
                      yLabel: "gCO2e/Ton-Mile of freight",
                      options: emissionIntensityTrendDto?.data,
                      reloadData: true,
                      companyName: companyName,
                      maxRegionsValue:
                        Math.max(
                          ...(emissionIntensityTrendDto?.data
                            ?.region_level || [1])
                        ) * 1.1,
                    })}
                    constructorType=""
                    isLoading={emissionIntensityTrendLoading}
                    database={emissionIntensityTrendDto?.data?.length > 0}
                  />
                </div>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="intencity-outer h-100 custom-standard">
                <div className="heading-view">
                  <h4 className="fw-semibold font-xxl-20 font-16">
                    {companyName} Emissions
                    Intensity by Lanes

                    <div className="view-more">
                      <Link
                        to={`/scope3/benchmarkLaneTable/${bandNumber}/${typeCheck(
                          lowIndustryStandardEmission,
                          0,
                          1
                        )}/${quarterRouteCond}/${params?.type
                          }/${yearlyData}/${typeCheck(
                            benchmarkDetailSwitch,
                            1,
                            0
                          )}`}
                        className="d-flex align-items-center color-primary text-decoration-none"
                      >
                        View More
                      </Link>
                    </div>
                  </h4>
                </div>
                <div className="stardrd-main">
                  <div className="stardrd-inner">
                    <h5>
                      {companyName} Standard:{" "}
                      {formatNumber(
                        true,
                        benchmarkCompanyDetail?.data?.mileBands
                          ?.company_intensity,
                        1
                      )}{" "}
                      <span>gCO2e / Ton-Mile of freight</span>
                    </h5>
                  </div>
                  <div className="lowh-toggle emission-right">
                    <div className="toggle-switch">
                      <Form className="custom-form">
                        <span>Low Emissions Intensity</span>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          data-testid="toggle-lane-benchmark-company"
                          className=""
                          checked={lowIndustryStandardEmission}
                          onChange={() =>
                            setLowIndustryStandardEmission(
                              !lowIndustryStandardEmission
                            )
                          }
                          disabled={industryStandardEmissionsLoading}
                        />
                        <span>High Emissions Intensity</span>
                      </Form>
                    </div>
                  </div>
                </div>
                <div data-testid="lane-emission-table-data" className="custom-table table-scroll table-bg">
                  <Table responsive hover>
                    <LaneTableHeader companyName={companyName} />
                    <TableBodyLoad loaderTestId="CompanyBenchmark-loading-benchmark" colSpan={5} isLoading={industryStandardEmissionsLoading} isData={industryStandardEmissionsList?.data?.emissionIntensityLanes?.length > 0}>
                      <tbody>
                        {industryStandardEmissionsList?.data?.emissionIntensityLanes?.map((i: any) => (
                          <tr key={i?.name}>
                            <td>{i?.name.split("_").join(" to ")} </td>
                            <td>
                              <p
                                className={typeCheck(
                                  Number.parseFloat(
                                    checkNumberUndefined(
                                      industryStandardEmissionsList?.data
                                        ?.emissionIntensityAverage
                                        ?.industrial_average
                                    )
                                  ) >
                                  Number.parseFloat(
                                    checkNumberUndefined(
                                      i?.company_intensity
                                    )
                                  ),
                                  "custom-green",
                                  ""
                                )}
                              >
                                <span className="table-box"></span>{" "}
                                {formatNumber(true, i?.company_intensity, 1)}
                              </p>
                            </td>
                            <td>
                              <p
                                className={typeCheck(
                                  Number.parseFloat(
                                    industryStandardEmissionsList?.data
                                      ?.emissionIntensityAverage
                                      ?.industrial_average
                                  ) >
                                  Number.parseFloat(
                                    checkNumberUndefined(
                                      i?.industrial_intensity
                                    )
                                  ),
                                  "custom-green",
                                  ""
                                )}
                              >
                                <span className="table-box"></span>{" "}
                                {formatNumber(
                                  true,
                                  i?.industrial_intensity,
                                  1
                                )}
                              </p>
                            </td>
                          </tr>
                        )
                        )}
                      </tbody>
                    </TableBodyLoad>
                  </Table>
                </div>
                <IntensityMarker isLoading={industryStandardEmissionsLoading} />
              </div>
            </Col>
          </Row>
          {!isCompanyEnable(loginDetails?.data, [companySlug.adm]) && <div className="carrier-outer mt-4">
            <div className="carrier-inner">
              <h4 className="fw-semibold font-xxl-20 font-16">
                Carrier Emissions Intensity
              </h4>
              <div className="lowh-toggle emission-right">
                <div className="toggle-switch">
                  <Form className="custom-form">
                    <span>Low Emissions Intensity</span>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      data-testid="toggle-carrier-benchmark-company"
                      className=""
                      checked={lowCarrierEmission}
                      onChange={(e) =>
                        setLowCarrierEmission(!lowCarrierEmission)
                      }
                      disabled={benchmarkLCompanyarrierEmissionsLoading}
                    />
                    <span>High Emissions Intensity</span>
                  </Form>
                </div>

                <div className="view-more">
                  <Link
                    to={`/scope3/benchmarks/view-more/${typeCheck(
                      lowCarrierEmission,
                      0,
                      1
                    )}/${params?.type
                      }/${quarterRouteCond}/${yearlyData}/${typeCheck(
                        benchmarkDetailSwitch,
                        1,
                        0
                      )}/${bandNumber}`}
                    className="d-flex align-items-center color-primary text-decoration-none"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
            <Row className="g-3">
              <Col lg={6} md={12}>
                <div data-testid="table-graph-data-carrier" className="intencity-outer top5-outer">
                  <h4 className="fw-semibold font-xxl-20 font-16">
                    Top 5 {companyName} Carriers
                  </h4>
                  <div className="stardrd-main">
                    <div className="stardrd-inner">
                      <h5>
                        {companyName} Standard:{" "}
                        {formatNumber(
                          true,
                          benchmarkCompanyDetail?.data?.mileBands
                            ?.company_intensity,
                          1
                        )}{" "}
                        <span>gCO2e / Ton-Mile of freight</span>
                      </h5>
                    </div>
                    <div className="lowh-toggle emission-right">
                      <ButtonComponent
                        text="Recommend Carrier"
                        btnClass="outlineBtn-deepgreen opacity-25 mb-2 border-0 fw-medium text-decoration-underline font-12 font-xxl-14 py-1"
                      />
                    </div>
                  </div>
                  <div className="custom-table table-bg">
                    <Table data-testid="high-emission-table-data" responsive hover>
                      <TableHeader />
                      <TableBodyLoad colSpan={5} loaderTestId="benchmark-CompanyBenchmark-loading-industryStandard" isLoading={benchmarkLCompanyarrierEmissionsLoading} isData={benchmarkCompanyCarrierEmissionsList?.data?.company_carrier?.length > 0}>
                        <tbody>
                          {benchmarkCompanyCarrierEmissionsList?.data?.company_carrier?.map((i: any) => (
                            <tr key={i?.name} data-testid="table-graph-data-carrier">
                              <td>
                                <div className="logo-list">
                                  <div className="carrierLogoTooltip">
                                    <CarrierRankingTooltip item={i} />
                                    <Logo
                                      path={i?.carrier_logo}
                                      name={i?.name}
                                    />
                                  </div>

                                  <span className="custom-title">
                                    {capitalizeText(i?.name)}({i?.carrier})
                                  </span>
                                </div>
                              </td>

                              <td>
                                <p
                                  className={typeCheck(
                                    Number.parseFloat(benchmarkCompanyDetail?.data?.mileBands?.company_intensity
                                    ) >
                                    Number.parseFloat(
                                      checkNumberUndefined(
                                        i?.emission_intensity
                                      )
                                    ),
                                    "custom-green",
                                    ""
                                  )}
                                >
                                  <span className="table-box"></span>

                                  {formatNumber(
                                    true,

                                    i?.emission_intensity,
                                    1
                                  )}
                                </p>
                              </td>
                              <td>
                                {formatNumber(false, i?.total_shipment, 0)}
                              </td>
                              <td>
                                <p>
                                  {formatNumber(true, i?.total_emission, 2)}
                                </p>
                              </td>
                            </tr>
                          )
                          )}
                        </tbody>
                      </TableBodyLoad>
                    </Table>
                  </div>
                  <IntensityMarker isLoading={benchmarkLCompanyarrierEmissionsLoading} />
                </div>
              </Col>
              <Col lg={6} md={12}>
                <div className="intencity-outer top5-outer">
                  <h4 className="fw-semibold font-xxl-20 font-16">
                    Top 5 Industry Carriers
                  </h4>
                  <div className="stardrd-main">
                    <div className="stardrd-inner">
                      <h5>
                        Industry Standard:{" "}
                        {formatNumber(
                          true,
                          benchmarkCompanyDetail?.data?.mileBands
                            ?.industry_intensity,
                          1
                        )}{" "}
                        <span>gCO2e / Ton-Mile of freight</span>
                      </h5>
                    </div>
                    <div className="lowh-toggle emission-right">
                      <ButtonComponent
                        text="Recommend Carrier"
                        btnClass="outlineBtn-deepgreen invisible p-0  opacity-25 mb-2 border-0 fw-medium text-decoration-underline font-12 font-xxl-14 py-1"
                      />
                    </div>
                  </div>
                  <div className="custom-table table-bg">
                    <Table data-testid="low-emission-tab-table" responsive hover>
                      <TableHeader />
                      <TableBodyLoad loaderTestId="CompanyBenchmark-loading-industryStandard" colSpan={5} isLoading={benchmarkLCompanyarrierEmissionsLoading} isData={benchmarkCompanyCarrierEmissionsList?.data?.industry_carrier.length > 0} noDataTestId={"no-data-found-company-benchmark"}>
                        <tbody>
                          {benchmarkCompanyCarrierEmissionsList?.data?.industry_carrier?.map((i: any) => (
                            <tr key={i?.name}>
                              <td>
                                <div className="logo-list">
                                  <div className="carrierLogoTooltip">
                                    <CarrierRankingTooltip item={i} />
                                    <Logo
                                      path={i?.carrier_logo}
                                      name={i?.name}
                                    />
                                  </div>
                                  <span className="custom-title">
                                    {capitalizeText(i?.name)}({i?.carrier})
                                  </span>
                                </div>
                              </td>

                              <td>
                                <p
                                  className={typeCheck(
                                    Number.parseFloat(
                                      benchmarkCompanyDetail?.data
                                        ?.mileBands?.industry_intensity
                                    ) >
                                    Number.parseFloat(
                                      checkNumberUndefined(
                                        i?.emission_intensity
                                      )
                                    ),
                                    "custom-green",
                                    ""
                                  )}
                                >
                                  <span className="table-box"></span>
                                  {formatNumber(true, i?.emission_intensity, 1)}
                                </p>
                              </td>
                              <td>
                                {formatNumber(false, i?.total_shipment, 0)}
                              </td>
                              <td>
                                <p>
                                  {formatNumber(true, i?.total_emission, 2)}
                                </p>
                              </td>
                            </tr>
                          )
                          )
                          }
                        </tbody>
                      </TableBodyLoad>
                    </Table>
                  </div>
                  <IntensityMarker isLoading={benchmarkLCompanyarrierEmissionsLoading} />
                </div>
              </Col>
            </Row>
          </div>}
        </div>
      </section>
    </>
  );
};

export default CompanyBenchmarkView;
