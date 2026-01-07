import TitleComponent from "../../component/tittle";
import BusinessUnit from './businessUnitController';
import { Row, Col } from "reactstrap";
import { formatNumber, checkedNullValue, getGraphTitle, getEmmisonName } from "../../utils";
import Heading from '../../component/heading';
import { lineColumnChart } from "../../utils/highchart/lineColumnChart";
import DataSource from "../../component/aboutLink/index";
import ChartColumn from "../../component/charts/chartColumn";
import ButtonComponent from "component/forms/button";
import PerformanceHeading from "component/PerfomanceHeading"
import RegionFilter from "component/forms/regionFilter";
import DateFilter from "component/forms/dateFilter";
import EmissionsIntensityTable from "component/EmissionsIntensity"
import { setDivisionId, setRegionalId } from "store/auth/authDataSlice";

/**
 *
 * @returns Regional view page
 */

const BusinessUnitView = () => {
  // Importing all states and functions from Region Controller
  const {
    configConstants,
    companyName,
    handleDownloadCsv,
    quarterDetails,
    yearlyData,
    order,
    colName,
    reloadData,
    isLoading,
    checked,
    businessUnitTableDetails,
    businessUnitGraphDetails,
    businessUnitGraphDetailsLoading,
    businessUnitList,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    regionOption,
    region,
    setRegion,
    pId,
    setPId,
    divisionLevel,
    setDivisionLevel,
    divisionOptions,
    loginDetails,
    divisions,
    timePeriodList,
    regions,
    weekId, 
    setWeekId,
    dispatch,
    t
  } = BusinessUnit();
  const defaultUnit = configConstants?.data?.default_distance_unit;
  return (
    <>
      {/* Carrier View starts */}
      <section className="region-screen pb-4" data-testid="business-unit">
        <TitleComponent title={"Business Unit"} pageHeading={t('businessUnitPageHeading')} />

        <div className="region-screen-wraper">

          <div className="region-section py-3 pt-0 px-2">
            <div className="d-sm-flex flex-wrap justify-content-between border-bottom mb-3">
              <div className="select-box d-sm-flex flex-wrap mb-3 gap-1">
                <RegionFilter
                  isDisabled={businessUnitGraphDetailsLoading}
                  regionAriaLabel="regions-data-dropdown-business-unit"
                  regionOption={regionOption}
                  divisionOptions={divisionOptions}
                  regionalLevel={region}
                  divisionLevel={divisionLevel}
                  handleChangeDivision={(e: any) => {
                    setDivisionLevel(e.value)
                    setReloadData(false);
                    dispatch(setDivisionId(e.value))
                    setRegion("");
                    dispatch(setRegionalId(""))
                  }}
                  handleChangeRegion={(e: any) => {
                    setRegion(e.value);
                    setReloadData(false);
                    dispatch(setRegionalId(e.value))
                  }}
                />

                <DateFilter
                  yearDropDownId="year-dropdown-business-unit"
                  quarterDropDownId="quarter-dropdown-business-unit"
                  isLoading={businessUnitGraphDetailsLoading}
                  yearlyId={yearlyData}
                  quarterId={quarterDetails}
                  pId={pId}
                  setPId={setPId}
                  weekId={weekId}
                  setWeekId={setWeekId}
                  updateYear={(e: any) => {
                    setReloadData(false);
                    setYearlyData(e.value);
                    setQuarterDetails(0)
                    setPId(0)
                    setWeekId(0)
                  }}
                  updateQuarter={(e: any) => {
                    setReloadData(false);
                    setQuarterDetails(e.value)
                    setPId(0)
                    setWeekId(0)
                  }}
                />
              </div>
              <ButtonComponent data-testid="export-btn-business-unit" disabled={!businessUnitTableDetails?.data.length} onClick={handleDownloadCsv} imagePath="/images/export.svg" text={t('export')} btnClass="btn-deepgreen border-0 font-14 font-xxl-16 mb-3 exportSvg-icon" />
            </div>
            <Row className="g-3">
              {/* Regional Emission Graph */}
              <Col lg="6" md="12">
                <ChartColumn
                  name={"Business"}
                  regionEmissionId="emission-intensity-toggle-region"
                  totalEmissionId="total-emission-toggle-region"
                  testId="graph-data-business-unit"
                  checked={checked}
                  setChecked={setChecked}
                  isLoading={businessUnitGraphDetailsLoading}
                  dataArr={businessUnitList}
                  graphSubHeading={`${getEmmisonName(checked)} for ${t('businessUnitTitle')} of ${getGraphTitle({
                    year: yearlyData,
                    regionId: region,
                    division: divisionLevel,
                    pId: pId,
                    weekId: weekId,
                    quarter: quarterDetails,
                    regionList: regions,
                    divisionList: divisions,
                    timeList: timePeriodList,
                    loginDetails
                  })}`}
                  options={lineColumnChart({
                    chart: "region",
                    regionPageArr: businessUnitList,
                    reloadData: reloadData,
                    unitDto: businessUnitGraphDetails?.data?.unit,
                    companyName: companyName,
                    heading: `${t('avgOfAll')} ${t('businessUnitTitle')}s (${formatNumber(true, businessUnitGraphDetails?.data?.average, 1)} <span>${businessUnitGraphDetails?.data?.unit}</span>)`
                  }

                  )} />
              </Col>
              {/* Regional Emission Table */}
              <Col lg="6" md="12">
                <div className="mainGrayCards h-100">

                  <div className="regionWiseTxt">
                    <div className="p-3">
                      <Heading level="6" className="mb-3 laneBreakdownHeading font-14 font-xxl-20 fw-semibold">{getEmmisonName(checked)} for Business Unit of {getGraphTitle({
                        year: yearlyData,
                        regionId: region,
                        division: divisionLevel,
                        pId: pId,
                        weekId: weekId,
                        quarter: quarterDetails,
                        regionList: regions,
                        divisionList: divisions,
                        timeList: timePeriodList,
                        loginDetails
                      })}</Heading>
                      <PerformanceHeading />
                    </div>
                    <EmissionsIntensityTable
                      order={order}
                      colName={colName}
                      handleChangeOrder={handleChangeOrder}
                      loadingTableData={isLoading}
                      emissionList={businessUnitTableDetails?.data}
                      colLabel={t('businessUnitTitle')}
                      isBusiness={true}
                      navigateLink={(row: any) => {
                        navigate(`/scope3/business-unit-overview/${row?.bu_id}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}`)
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
      {/* Carrier View ends */}
    </>
  );
};

export default BusinessUnitView;
