import { Row, Col } from "reactstrap";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import TitleComponent from "component/tittle";
import { typeCheck } from "utils";
import SelectDropdown from "component/forms/dropdown";
import ChartHighChart from "../../component/highChart/ChartHighChart";
import { benchmarkColumnChart } from "../../utils/highchart/benchmarkColumnChart";
import { UsaRegionHighChart } from "../../utils/highchart/usRegionMapChart";
import MapLaneBenchMark from "component/map/BenchmarkMap";
import ImageComponent from "component/images";
import Heading from "component/heading";
import { BenchmarkController } from "./benchmarksController";
import DateFilter from "component/forms/dateFilter";

const BenchmarksView = () => {
  const {
    lane1Options,
    lane2Options,
    companyName,
    yearlyData,
    handleChangeYear,
    quarterDetails,
    handleChangeQuarter,
    benchmarkDistanceSwitch,
    handleBenchMarkChange,
    handlClickOrigin,
    handleOnKeyDown,
    menuIsOpen1,
    focusPoint,
    lane1,
    handleDestinationClick,
    handleOnkeyDownDestination,
    menuIsOpen2,
    focusPoint2,
    lane2,
    setLane1,
    setLane2,
    boundType,
    handleChangeBoundType,
    benchmarkDistanceDto,
    benchmarkDistanceDtoLoading,
    benchmarkWeightDto,
    benchmarkWeightDtoLoading,
    benchmarkRegionDto,
    benchmarkRegionDtoLoading,
    isLoadingOrigin,
    isLoadingDestination,
    freightLanesDtoLoading,
    freightLanesDto,
    reloadData,
    handleSelectOrigin,
    handleSelectDestination,
    navigate
  } = BenchmarkController();
  return (
    <div data-testid="benchmark-view" className="pb-4 pt-3 border-0 bg-transparent">
      <TitleComponent title={"Benchmarks"} pageHeading="Benchmarks" />

      <div className="benchmarks">
        <div className="benchmarkWrapper main-lowerbench px-2">
          <div className="emission-outer pb-3 border-bottom">
            <Heading
              level="4"
              className="mb-0 font-24 fw-semibold"
              content="Emissions Benchmarks"
            />
            <div className="emission-right">
              <div className="d-flex align-items-center justify-content-end">
                <Heading
                  level="6"
                  content="WTW"
                  className="mb-0 pe-1 fw-semibold text-capitalize font-xxl-14 font-12"
                />
                <Form >
                  <Form.Check
                    data-testid="toggle"
                    type="switch"
                    id="custom-switch"
                    className="ps-0 mb-0 fw-semibold"
                    checked={benchmarkDistanceSwitch}
                    onChange={(e) => {
                      handleBenchMarkChange(e);
                    }}
                    disabled={benchmarkDistanceDtoLoading}
                  />
                </Form>
                <Heading
                  level="6"
                  content="TTW"
                  className="mb-0 pe-1 fw-semibold text-capitalize font-xxl-14 font-12"
                />
              </div>
            </div>
          </div>
          <div className="select-box d-flex gap-1 my-3">
            <DateFilter
              dateType="benchmark_dates"
              isLoading={benchmarkDistanceDtoLoading}
              yearDropDownId="year-drop-down-benchmarkView"
              quarterDropDownId="quarter-drop-down-benchmarkView"
              yearlyId={yearlyData}
              quarterId={quarterDetails}
              updateYear={handleChangeYear}
              updateQuarter={handleChangeQuarter}
              isWeekDropdownShow={false}
            />
          </div>
          <Row className="g-3">
            <Col lg="6">
              <div className="mainGrayCards no-data-text company-level p-3 h-100 position-relative">
                <div className=" bandGraph">
                  <ChartHighChart
                    testId="high-chart-emission-intensity"
                    options={benchmarkColumnChart({
                      isLoading: benchmarkDistanceDtoLoading,
                      database: (benchmarkDistanceDto?.data?.length > 0),
                      companyName: companyName,
                      reloadData: reloadData,
                      options: benchmarkDistanceDto,
                      chart: "emissionIntensityBand",
                      heading: 'Emissions Intensity by Distance Bands',
                      xLabel: "Mile",
                      yLabel: "gCO2e / Ton-Mile of freight",

                      navigate: navigate,
                      isClickable: true,
                      benchmarkType: "mile",
                      yearId: yearlyData,
                      quarterId: typeCheck(
                        quarterDetails === 0, "all", quarterDetails
                      ),
                      wtwType: typeCheck(
                        benchmarkDistanceSwitch,
                        1,
                        0
                      ),
                    })}
                    constructorType=""
                    isLoading={benchmarkDistanceDtoLoading}
                    database={benchmarkDistanceDto?.data?.length > 0}
                  />
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="mainGrayCards no-data-text company-level p-3 h-100 position-relative">
                <div className="bandGraph">
                  <ChartHighChart
                    options={benchmarkColumnChart({
                      database: (benchmarkWeightDto?.data?.length > 0),
                      reloadData: reloadData,
                      options: benchmarkWeightDto,
                      companyName: companyName,
                      isClickable: true,

                      chart: "emissionIntensityBand",
                      heading: 'Emissions Intensity by Weight Band',
                      xLabel: "Pounds",
                      yLabel: "gCO2e / Ton-Mile of freight",
                      navigate: navigate,
                      benchmarkType: "weight",
                      yearId: yearlyData,
                      quarterId: typeCheck(
                        quarterDetails === "",
                        "all",
                        quarterDetails
                      ),
                      wtwType: typeCheck(
                        benchmarkDistanceSwitch,
                        1,
                        0
                      ),
                    })}
                    constructorType=""
                    isLoading={benchmarkWeightDtoLoading}
                    database={benchmarkWeightDto?.data?.length > 0}
                  />
                </div>
              </div>
            </Col>
            <Col lg="12">
              <div className="mainGrayCards company-level p-3 position-relative">
                <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
                  <Heading
                    level="4"
                    className="mb-0 fw-semibold font-20 "
                    content="Benchmarks for US Regions"
                  />

                  <div className="d-flex align-items-center">
                    <Heading
                      level="6"
                      content="Inbound"
                      className="mb-0 pe-1 fw-semibold text-capitalize font-xxl-14 font-12"
                    />
                    <Form>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        data-testid="toggle-benchmark-region"
                        className="fw-semibold ps-0 fs-14 mb-0"
                        checked={boundType}
                        onChange={() => handleChangeBoundType()}
                        disabled={benchmarkRegionDtoLoading}
                      />
                    </Form>
                    <Heading
                      level="6"
                      content="Outbound"
                      className="mb-0 pe-1 fw-semibold text-capitalize font-xxl-14 font-12"
                    />
                  </div>
                </div>
                <div className="highchartMap">
                  <ChartHighChart
                    options={UsaRegionHighChart({
                      dto: benchmarkRegionDto,
                      reloadData: true,
                      navigate: navigate,
                      benchmarkType: "region",
                      yearId: yearlyData,
                      quarterId:
                        quarterDetails === 0 ? "all" : quarterDetails,
                      wtwType: typeCheck(benchmarkDistanceSwitch, 1, 0),
                      boundType: typeCheck(
                        boundType,
                        "outbound",
                        "inbound"
                      ),
                    })}
                    constructorType={"mapChart"}
                    isLoading={benchmarkRegionDtoLoading}
                    database={benchmarkRegionDto}
                    reloadData
                  />
                </div>
              </div>
            </Col>
            <Col lg="12">
              <div className="mainGrayCards company-level p-3 position-relative laneMap">
                <Heading
                  level="4"
                  className="mb-0 fw-semibold font-20 text-start"
                  content="Benchmarks for Freight Lanes"
                />
                <div className="d-lg-flex gap-3 select-box ">
                  <div className="mt-4 d-flex flex-wrap gap-3 align-items-center ">
                    <div className="location-filter">
                      <h5 className="font-16 mb-2 text-start">Origin</h5>
                      <button data-testid="origin-handle"
                        onClick={(event) => {
                          handlClickOrigin(event);
                        }}
                        onKeyDown={(event) => {
                          handleOnKeyDown(event);
                        }}
                        className="search-icon-img lane border-0 btn-transparent p-0"
                      > {isLoadingOrigin ?
                        <div data-testid="dropdownSpinner-loading-benchmark" className="dropdownSpinner">
                          <div className="spinner-border ">
                            <span className="sr-only"></span>
                          </div>
                        </div>
                        :

                        <span className="d-block height-0">
                          <ImageComponent path="/images/search.svg" className="search-img" />
                        </span>
                        }
                        <SelectDropdown
                          placeholder="Enter Origin"
                          aria-label="origin-drop-down-benchmarkView"
                          isSearchable={true}
                          selectedValue={lane1}
                          menuIsOpen={menuIsOpen1 && !isLoadingOrigin}
                          focusPoint={focusPoint}
                          onChange={(e: any) => {
                            setLane1(e);
                          }}
                          customClass="ms-0 mt-2 mt-lg-0 benchmarkdropdown text-capitalize lane-search-dropdown "
                          onInputChange={(e: any) => {
                            if (e.length >= 3) {
                              handleSelectOrigin(e);
                            }
                          }}
                          options={lane1Options}
                        />
                      </button>
                    </div>
                    <div className="location-filter">
                      <h5 className="mb-2 font-16 text-start">Destination</h5>
                      <button data-testid="destination-click"
                        onClick={(event: any) => {
                          handleDestinationClick(event);
                        }}
                        onKeyDown={(event) => {
                          handleOnkeyDownDestination(event);
                        }}
                        className="search-icon-img lane btn-transparent border-0 p-0"
                      > {isLoadingDestination ?
                        <div data-testid="dropdownSpinner-loading-benchmark" className="dropdownSpinner">
                          <div className="spinner-border ">
                            <span className="sr-only"></span>
                          </div>
                        </div> :
                        <span className="d-block height-0">
                          <ImageComponent path="/images/search.svg" className="search-img" />
                        </span>
                        }
                        <SelectDropdown
                          aria-label="destination-drop-down-benchmarkView"
                          isDisabled={lane1?.value === ""}
                          focusPoint={focusPoint2}
                          menuIsOpen={menuIsOpen2 && !isLoadingDestination}
                          selectedValue={lane2}
                          customClass="mt-2 mt-lg-0 text-capitalize benchmarkdropdown lane-search-dropdown"
                          value={lane2}
                          onChange={(e: any) => {
                            setLane2(e);
                          }}
                          onInputChange={(e: any) => {
                            if (e.length >= 3) {
                              handleSelectDestination(e);
                            }
                          }}
                          placeholder="Enter Destination"
                          isSearchable={true}
                          options={lane2Options}
                        />
                      </button>
                    </div>
                  </div>

                  {freightLanesDto?.data?.dat_by_lane?.dollar_per_mile && <div className="dat-info d-flex align-items-center gap-2 mt-lg-5 mt-2">
                    <ImageComponent path="/images/dat-logo.svg" className="pe-0" />
                    <Heading level="4" className="font-16 fw-semibold mb-0">${freightLanesDto?.data?.dat_by_lane?.dollar_per_mile} <span className="fw-normal">per mile</span></Heading>
                  </div>}
                </div>

                {lane1 && lane2 && (
                  <div className="highchartMap benchmarkMapui benchmarkMapui-hide mt-3">
                    {freightLanesDtoLoading && (
                      <div data-testid="benchmarkMap-loading-benchmark" className="graph-loaderPie d-flex justify-content-center align-items-center">
                        <div className="spinner-border  spinner-ui">
                          <span className="visually-hidden"></span>
                        </div>
                      </div>
                    )}
                    {!freightLanesDtoLoading &&
                      (freightLanesDto?.data?.laneBenchmarks ? (
                        <Link
                          to={`/scope3/benchmarks/lane/detail/${lane1?.value}_${lane2?.value
                            }/${yearlyData}/${typeCheck(
                              quarterDetails === 0,
                              "all",
                              quarterDetails
                            )}/${typeCheck(benchmarkDistanceSwitch, 1, 0)}`}
                        >
                          <MapLaneBenchMark
                            reloadData={true}
                            origin={lane1?.value}
                            destination={lane2?.value}
                            dto={freightLanesDto?.data?.data}
                          />
                        </Link>
                      ) : (
                        <div className="no-data ">
                          <p>No Data Found</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default BenchmarksView;