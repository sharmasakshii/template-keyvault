import TitleComponent from "../../component/tittle";
import { Row, Col } from "reactstrap";
import { formatNumber, getQuarterName, checkRolePermission, getEmmisonName } from "../../utils";
import Heading from '../../component/heading';
import { lineColumnChart } from "../../utils/highchart/lineColumnChart";
import DataSource from "../../component/aboutLink/index";
import ChartColumn from "../../component/charts/chartColumn";
import SelectDropdown from "../../component/forms/dropdown";
import ButtonComponent from "component/forms/button";
import PerformanceHeading from "component/PerfomanceHeading";

import FuelController from './fuelController';
import { defaultQuarter } from "constant";
import EmissionsIntensityTable from "component/EmissionsIntensity"
import DateFilter from "component/forms/dateFilter";
import { setRegionalId } from "store/auth/authDataSlice";

const FuelView = (props: any) => {

  const {
    companyName,
    handleDownloadCsv,
    quarterDetails,
    yearlyData,
    order,
    colName,
    reloadData,
    checked,
    fuelTableDto,
    fuelTableDtoLoading,
    fuelArrayList,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    regionOption,
    regionalLevel,
    setRegionalLevel,
    dataCheck,
    dispatch,
    loginDetails,
    configConstants
  } = FuelController(props);
  const defaultUnit = configConstants?.data?.default_distance_unit;
  const { pageTitle, tableLabel, graphDto, graphDtoLoading } = props

  return (
    <>
      {/* Title component */}
      <TitleComponent title={pageTitle} pageHeading={`Track: ${pageTitle} Emissions Comparison`} />
      {/* Main section */}
      <section className="region-screen pb-4" data-testid={`${props?.pageTitle}-view`}>
        <div className="region-screen-wraper">

          <div className="region-section py-2 px-2">
            <div className="d-flex flex-wrap justify-content-between border-bottom mb-3">
              <div className="select-box d-flex mb-3 gap-2">
                {!checkRolePermission(dataCheck?.userdata, "regionalManager") && (
                  <div className="">
                    <SelectDropdown
                      aria-label="region-dropdown"
                      disabled={graphDtoLoading}
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
                  </div>)}

                <DateFilter
                  isLoading={graphDtoLoading}
                  yearDropDownId="year-dropdown"
                  quarterDropDownId="quarter-dropdown"
                  yearlyId={yearlyData}
                  quarterId={quarterDetails}
                  updateYear={(e: any) => {
                    setYearlyData(Number(e.value));
                    setQuarterDetails(defaultQuarter)
                    setReloadData(false);
                  }}
                  updateQuarter={(e: any) => {
                    setQuarterDetails((e.value));
                    setReloadData(false);
                  }}
                  isWeekDropdownShow={false}
                />

              </div>
              <ButtonComponent data-testid="export-btn" disabled={!fuelTableDto?.data.length} onClick={handleDownloadCsv} imagePath="/images/export.svg" text="Export" btnClass="btn-deepgreen border-0 font-14 font-xxl-16 mb-3 exportSvg-icon" />
            </div>
            <Row className="g-3">
              {/* Fuel Emission Graph */}
              <Col lg="6" md="12">
                <ChartColumn name={"Fuel"} checked={checked} setChecked={setChecked}
                  regionEmissionId="emission-intensity-toggle-region"
                  totalEmissionId="total-emission-toggle-region"
                  testId="graph-data"
                  heading=""
                  isLoading={graphDtoLoading} dataArr={fuelArrayList}
                  graphSubHeading={`${pageTitle}-Wise ${getEmmisonName(checked)} for ${getQuarterName(loginDetails, quarterDetails, yearlyData)} ${yearlyData}`}
                  options={lineColumnChart({
                    chart: "region",
                    regionPageArr: fuelArrayList,
                    reloadData: reloadData,
                    unitDto: graphDto?.data?.unit,
                    companyName: companyName,
                    heading: `Average of all ${pageTitle} ${pageTitle === 'Fuel' ? 'Type' : 'Model'} (${formatNumber(true, graphDto?.data?.average, 1)} <span>${graphDto?.data?.unit}</span>)`
                  }
                  )} />
              </Col>
              {/* Fuel Emission Table */}
              <Col lg="6" md="12">
                <div className="mainGrayCards h-100">
                  <div className="regionWiseTxt">
                    <div className="p-3">
                      <Heading level="6" className="mb-3 laneBreakdownHeading font-14 font-xxl-20 fw-semibold">{pageTitle}-Wise {getEmmisonName(checked)} for {getQuarterName(loginDetails, quarterDetails, yearlyData)} {yearlyData}</Heading>
                      <PerformanceHeading />
                    </div>
                    <EmissionsIntensityTable
                      order={order}
                      colName={colName}
                      handleChangeOrder={handleChangeOrder}
                      loadingTableData={fuelTableDtoLoading}
                      emissionList={fuelTableDto?.data}
                      colLabel={tableLabel}
                      navigateLink={(row: any) => {
                        navigate(`/scope3/${pageTitle.toLowerCase()}-overview/${pageTitle === 'Fuel' ? row?.FuelType_id : row?.VehicleModel_id}/${yearlyData}/${quarterDetails || 0}`)
                      }}
                      configConstants={defaultUnit}
                    />
                  </div>
                </div>
              </Col>
            </Row>

          </div>
          <DataSource />
        </div>
      </section >
    </>
  );
};

export default FuelView;
