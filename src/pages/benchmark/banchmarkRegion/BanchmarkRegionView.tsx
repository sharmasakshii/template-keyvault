import TitleComponent from "../../../component/tittle";
import SelectDropdown from "component/forms/dropdown";
import BackBtn from "component/forms/backLink";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import Heading from "component/heading";
import {
  getRegionName,
  formatNumber,
  typeCheck,
  checkRolePermission,
  isCompanyEnable
} from "../../../utils";
import ImageComponent from "component/images";
import Form from "react-bootstrap/Form";
import ChartHighChart from "../../../component/highChart/ChartHighChart";
import { lineColumnChart } from "../../../utils/highchart/lineColumnChart";
import BanchmarkRegionController from "./banchmarkRegionController";
import ButtonComponent from "component/forms/button";
import { benchmarkType } from "utils";
import { companySlug } from "constant";
import Spinner from "component/spinner";
import EmissionsTableBody from "./EmissionsTableBody";

const BenchmarkRegion = () => {
  const {
    dataCheck,
    companyName,
    isPageLoading,
    yearOption,
    params,
    yearlyData,
    setYearlyData,
    quarterDetails,
    setQuarterDetails,
    lowCarrierEmission,
    setLowCarrierEmission,
    boundType,
    setBoundType,
    benchmarkDetailSwitch,
    setBenchmarkDetailSwitch,
    regionId,
    setRegionId,
    emissionByRegionDto,
    benchmarkRegionList,
    emissionByRegionLoading,
    benchmarkCompanyCarrierEmissionsList,
    benchmarkEmissionsTrendGraphLoading,
    benchmarkEmissionsTrendGraphDto,
    intermodelTrendGraphLoading,
    intermodelTrendGraphDto,
    benchmarkLCompanyarrierEmissionsLoading,
    quarterOption,
    loginDetails
  } = BanchmarkRegionController();
  let quarterRouteCond = quarterDetails || "all";

  return (
    <section className="pb-4 pt-2 px-2" data-testid="region-benchmark">
      <TitleComponent title={"Benchmarks"} pageHeading={`${companyName} Benchmarks`} />

      <div className="main-lowerbench pb-3">
        <div className="d-xl-flex  emission-outer justify-content-between align-items-center border-bottom pb-3">
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <BackBtn backBtnTestId="back-btn-region-benchmark" link="scope3/benchmarks" />
            <div className="emission-left us-region">
              <ImageComponent path="/images/co2.svg" />
              <h3>
                Benchmarks for {benchmarkType(params)} -{" "}
                <span className="text-color">
                  {params.type === "region"
                    ? benchmarkRegionList &&
                    getRegionName(
                      benchmarkRegionList,
                      String(regionId),
                      false,
                      true
                    )
                    : params.id?.replace("_", " to ")}
                </span>
              </h3>
            </div>
          </div>
          <div className="emission-right">
            {params.type === "region" && (
              <div className="toggle-switch">
                <Form className="custom-form toggle-line">
                  <span>Inbound</span>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    data-testid="toggle"
                    checked={boundType}
                    onChange={() => setBoundType(!boundType)}
                    className=""
                    disabled={isPageLoading}
                  />
                  <span>Outbound</span>
                </Form>
              </div>
            )}
            <div className="toggle-switch">
              <Form className="custom-form">
                <span>WTW</span>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  data-testid="toggle-region-ttw"
                  checked={benchmarkDetailSwitch}
                  onChange={() =>
                    setBenchmarkDetailSwitch(!benchmarkDetailSwitch)
                  }
                  className=""
                  disabled={isPageLoading}
                />
                <span>TTW</span>
              </Form>
            </div>
            {params.type === "region" &&
              !checkRolePermission(
                dataCheck?.userdata,
                "regionalManager"
              ) && (
                <div className="select-box abc">
                  <SelectDropdown
                    id="exampleSelect"
                    name="select"
                    type="select"
                    aria-label="regions-data-dropdown-Bechmark-regions"
                    disabled={isPageLoading}
                    selectedValue={benchmarkRegionList?.data
                      ?.filter((el: any) => el.id === regionId)
                      ?.map((i: any) => ({
                        value: i?.id,
                        label: i?.region_name,
                      }))}
                    onChange={(e: any) => {
                      setRegionId(e.value);
                    }}
                    options={benchmarkRegionList?.data?.map((i: any) => ({
                      value: i?.id,
                      label: i?.region_name,
                    }))}
                  />
                </div>
              )}

          </div>
        </div>

        <div className="ql-outer select-box gap-3">
          <SelectDropdown
            id="exampleSelect"
            name="select"
            customClass="yearDropdown"
            aria-label="year-drop-down-regionBenchmarkView"
            type="select"
            options={yearOption}
            disabled={isPageLoading}
            selectedValue={yearOption?.filter(
              (el: any) => el.value === yearlyData
            )}
            onChange={(e: any) => {
              setYearlyData(e.value);
            }}
          />
          <SelectDropdown
            id="exampleSelect"
            name="select"
            customClass=" quarterDropdown"
            aria-label="quarter-drop-down-regionBenchmarkView"
            type="select"
            selectedValue={quarterOption?.filter(
              (el: any) => Number(el.value) === Number(quarterDetails)
            )}
            disabled={isPageLoading}
            options={quarterOption}
            onChange={(e: any) => {
              setQuarterDetails(e.value);
            }}
          />
        </div>
        <Row className="mb-4 g-3">
          <Col lg={6} md={12}>
            <div className="grey-bg custom-greybox">
              {emissionByRegionLoading ? <Spinner data-testid="region-Benchmark-loading-benchmark" spinnerClass='mt-5
                justify-content-center'/> : (
                <>
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

                  <div className="emission-sipment pt-0">
                    <div className="icon-text">
                      <ImageComponent path="/images/emissions-Intensity.svg" />
                      <div className="text-inner">
                        <Heading level="5" content="Emissions Intensity" />
                        <p>gCO2e / Ton-Mile of freight</p>
                      </div>
                    </div>
                    <div className="average-outer emasion-average">
                      <h4>
                        <span className="custom-h4">
                          {formatNumber(
                            true,
                            emissionByRegionDto?.data?.benchmarksData?.company_intensity,
                            1
                          )}
                        </span>
                      </h4>{" "}
                      <span className="line"></span>
                      <h5>
                        <span className="custom-h5">
                          {formatNumber(
                            true,
                            emissionByRegionDto?.data?.benchmarksData?.industry_intensity,
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
                        <Heading level="5" content="Shipments" />
                      </div>
                    </div>
                    <div className="average-outer emasion-average">
                      <h4>
                        <span className="custom-h4">
                          {formatNumber(
                            true,
                            emissionByRegionDto?.data?.benchmarksData?.company_shipment,
                            0
                          )}
                        </span>
                      </h4>{" "}
                      <span className="line"></span>
                      <h5>
                        <span className="custom-h5">
                          {formatNumber(
                            true,
                            emissionByRegionDto?.data?.benchmarksData?.industry_shipments,
                            0
                          )}
                        </span>
                      </h5>
                    </div>
                  </div>
                  {params.type === "region" && (
                    <div className="emission-sipment border-bottom-0 pb-0">
                      <div className="icon-text">
                        <ImageComponent path="/images/lanes.svg" />

                        <div className="text-inner">
                          <Heading level="5" content="Lanes" />
                        </div>
                      </div>
                      <div className="average-outer emasion-average">
                        <h4>
                          <span className="custom-h4">
                            {formatNumber(
                              true,
                              emissionByRegionDto?.data?.benchmarksData?.company_lane_count,
                              0
                            )}{" "}
                          </span>
                        </h4>{" "}
                        <span className="line"></span>
                        <h5>
                          <span className="custom-h5">
                            {formatNumber(
                              true,
                              emissionByRegionDto?.data?.benchmarksData?.industry_lane_count,
                              0
                            )}
                          </span>
                        </h5>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={6}>
                <div className="emission-sipment innermodal-outer">
                  <div className="icon-text">
                    <ImageComponent path="/images/Intermodal.svg" />

                    <div className="text-inner">
                      <Heading level="5" content="Intermodal Index" />
                    </div>
                  </div>
                  <hr></hr>
                  <div className="average-outer">
                    <h4>
                      {formatNumber(
                        true,
                        emissionByRegionDto?.data?.interModelIndex
                          ?.company_intermodal_index,
                        1
                      )}{" "}
                      <span>{companyName} </span>
                    </h4>{" "}
                    <span className="line"></span>
                    <h5>
                      {formatNumber(
                        true,
                        emissionByRegionDto?.data?.interModelIndex
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
                <div className="emission-sipment innermodal-outer">
                  <div className="icon-text">
                    <ImageComponent path="/images/alternative.svg" />

                    <div className="text-inner">
                      <Heading level="5" content="Alternative Fuel Index" />
                    </div>
                  </div>
                  <hr></hr>
                  <div className="average-outer fuel-outer">
                    <h4>
                      {formatNumber(
                        true,
                        emissionByRegionDto?.data?.alternateFuelIndex
                          ?.company_index,
                        1
                      )}{" "}
                      <span>{companyName} </span>
                    </h4>{" "}
                    <span className="line"></span>
                    <h5>
                      {formatNumber(
                        true,
                        emissionByRegionDto?.data?.alternateFuelIndex
                          ?.industry_index,
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
        <Row className="g-3">
          <Col lg={6} md={12}>
            <div className="intencity-outer h-100">
              <h4 className="fw-semibold font-xxl-20 font-16">
                Emissions Index Trends : {companyName} Compared to Benchmark
              </h4>
              <div className="inner-data-region slider-icons position-relative highchart-benchmark">
                <ChartHighChart
                  testId="high-chart-emission-intensity"
                  options={lineColumnChart({
                    chart: "emissionIntensityTrends",
                    xkey: "emission_index",
                    ykey: "intermodal_index",
                    yLabel: "Emission Index",
                    companyName: companyName,
                    options: benchmarkEmissionsTrendGraphDto?.data,
                    reloadData: true,
                    maxRegionsValue:
                      Math.max(
                        ...(benchmarkEmissionsTrendGraphDto?.data
                          ?.region_level || [1])
                      ) * 1.1,
                  })}
                  constructorType=""
                  isLoading={benchmarkEmissionsTrendGraphLoading}
                  database={benchmarkEmissionsTrendGraphDto?.data?.length > 0}
                />
              </div>
            </div>
          </Col>
          <Col lg={6} md={12}>
            <div className="intencity-outer h-100">
              <h4 className="fw-semibold font-xxl-20 font-16">
                Intermodal Index Trends : {companyName} Compared to Benchmark
              </h4>

              <div className="inner-data-region slider-icons position-relative highchart-benchmark">
                <ChartHighChart
                  testId="high-chart-intermodal"
                  options={lineColumnChart({
                    chart: "emissionIntensityTrends",
                    xkey: "company_intermodal_index",
                    ykey: "intermodal_index",
                    yLabel: "Intermodal Index",
                    options: intermodelTrendGraphDto?.data,
                    reloadData: true,
                    companyName: companyName,
                    maxRegionsValue:
                      Math.max(
                        ...(intermodelTrendGraphDto?.data
                          ?.company_intensity || [1])
                      ) * 1.1,
                  })}
                  constructorType=""
                  isLoading={intermodelTrendGraphLoading}
                  database={intermodelTrendGraphDto?.data?.length > 0}
                />
              </div>
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
                    data-testid="toggle-region-emission"
                    className=""
                    checked={lowCarrierEmission}
                    onChange={(e: any) =>
                      setLowCarrierEmission(!lowCarrierEmission)
                    }
                    disabled={benchmarkLCompanyarrierEmissionsLoading}
                  />
                  <span>High Emissions Intensity</span>
                </Form>
              </div>

              <div className="view-more">
                <Link
                  to={`/scope3/benchmarks/view-more/detail/${typeCheck(
                    lowCarrierEmission,
                    0,
                    1
                  )}/${params.type
                    }/${quarterRouteCond}/${yearlyData}/${typeCheck(
                      benchmarkDetailSwitch,
                      1,
                      0
                    )}/${params.type === "region" && typeCheck(boundType, 1, 0)
                    }/${params.type === "region" ? regionId : params.id}`}
                  className="d-flex align-items-center color-primary text-decoration-none"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>
          <Row className="g-3">
            <Col lg={6} md={12}>
              <div className="intencity-outer top5-outer">
                <h4 className="fw-semibold font-xxl-20 font-16">
                  Top 5 {companyName} Carriers
                </h4>
                <div className="stardrd-main">
                  <div className="stardrd-inner">
                    <h5>
                      {companyName} Standard :{" "}
                      {formatNumber(
                        true,
                        emissionByRegionDto?.data?.benchmarksData?.company_intensity,
                        1
                      )}
                      <span> gCO2e / Ton-Mile of freight</span>
                    </h5>
                  </div>
                  <div className="lowh-toggle emission-right">
                    <ButtonComponent
                      text="Recommend Carrier"
                      btnClass="outlineBtn-deepgreen opacity-25 border-0 fw-medium text-decoration-underline font-12 font-xxl-14 py-1"
                    />
                  </div>
                </div>
                  <EmissionsTableBody
                    testId="lowes-standard-table-data"
                    data={benchmarkCompanyCarrierEmissionsList?.data?.company_carrier}
                    isLoading={benchmarkLCompanyarrierEmissionsLoading}
                    emissionType="company_intensity"
                    emissionByRegionDto={emissionByRegionDto}
                  />
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
                      Industry Standard :{" "}
                      {formatNumber(
                        true,
                        emissionByRegionDto?.data?.benchmarksData?.industry_intensity,
                        1
                      )}{" "}
                      <span>gCO2e / Ton-Mile of freight</span>
                    </h5>
                  </div>
                  <div className="lowh-toggle emission-right">
                    <ButtonComponent
                      text="Recommend Carrier"
                      btnClass="outlineBtn-deepgreen invisible p-0 opacity-25 border-0 fw-medium text-decoration-underline font-12 font-xxl-14 py-1"
                    />
                  </div>
                </div>
                <EmissionsTableBody
                    testId= "indus-standard-tab-table"
                    isLoading={benchmarkLCompanyarrierEmissionsLoading}
                    data={benchmarkCompanyCarrierEmissionsList?.data?.industry_carrier}
                    emissionType="industry_intensity"
                    emissionByRegionDto={emissionByRegionDto}
                />
              </div>
            </Col>
          </Row>
        </div>}

      </div>
    </section>
  );
};
export default BenchmarkRegion;
