import TitleComponent from "../../component/tittle";
import DivisionController from './divisionController';
import { Row, Col } from "reactstrap";
import {
  formatNumber,
  checkedNullValue,
  getGraphTitle,
  getEmmisonName
} from "../../utils";
import Heading from '../../component/heading';
import { lineColumnChart } from "../../utils/highchart/lineColumnChart";
import DataSource from "../../component/aboutLink/index";
import ChartColumn from "../../component/charts/chartColumn";
import ButtonComponent from "component/forms/button";
import PerformanceHeading from "component/PerfomanceHeading"
import DateFilter from "component/forms/dateFilter";
import EmissionsIntensityTable from "component/EmissionsIntensity"

/**
 *
 * @returns Regional view page
 */

const DivisionView = () => {
  // Importing all states and functions from Region Controller
  const {
    companyName,
    handleDownloadCsv,
    quarterDetails,
    yearlyData,
    order,
    colName,
    reloadData,
    checked,
    businessUnitList,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    pId,
    setPId,
    divisionGraphDto,
    divisionTableDto,
    divisionGraphDtoLoading,
    divisionTableDtoLoading,
    timePeriodList,
    loginDetails,
    weekId, 
    setWeekId,
    configConstants,
    t
  } = DivisionController();
  const defaultUnit = configConstants?.data?.default_distance_unit;
  const graphTitle = getGraphTitle({
    year: yearlyData,
    regionId: null,
    division: null,
    pId: pId,
    weekId: weekId,
    quarter: quarterDetails,
    regionList: null,
    divisionList: null,
    timeList: timePeriodList,
    loginDetails
  })

  return (
    <>
      {/* Carrier View starts */}
      <section className="region-screen pb-" data-testid="division">
        <TitleComponent title={"By Division"} pageHeading={t('divisionTitle')} />
        <div className="region-screen-wraper">
          <div className="region-section py-3 pt-0 px-2">
            <div className="d-flex flex-wrap justify-content-between border-bottom  filters  mb-3">
              <div className="select-box d-flex mb-3 gap-1">
                <DateFilter
                  yearDropDownId="year-dropdown"
                  quarterDropDownId="quarter-dropdown"
                  isLoading={divisionGraphDtoLoading}
                  yearlyId={yearlyData}
                  quarterId={quarterDetails}
                  pId={pId}
                  weekId={weekId}
                  setWeekId={setWeekId}
                  setPId={setPId}
                  updateYear={(e: any) => {
                    setReloadData(false);
                    setYearlyData(e.value)
                    setQuarterDetails(0);
                    setPId(0);
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
              <ButtonComponent data-testid="export-btn" disabled={!divisionTableDto?.data.length} onClick={handleDownloadCsv} imagePath="/images/export.svg" text={t('export')} btnClass="btn-deepgreen border-0 font-14 font-xxl-16 mb-3 exportSvg-icon" />
            </div>
            <Row className="g-3">
              {/* Regional Emission Graph */}
              <Col lg="6" md="12">
                <ChartColumn
                  name={"Division"}
                  regionEmissionId="emission-intensity-toggle-region"
                  totalEmissionId="total-emission-toggle-region"
                  testId="graph-data"
                  checked={checked}
                  setChecked={setChecked}
                  isLoading={divisionGraphDtoLoading}
                  dataArr={businessUnitList}
                  graphSubHeading={`${getEmmisonName(checked)} of All ${t('division')}s for ${graphTitle}`}
                  options={lineColumnChart({
                    chart: "region",
                    regionPageArr: businessUnitList,
                    reloadData: reloadData,
                    unitDto: divisionGraphDto?.data?.unit,
                    companyName: companyName,
                    heading: ` ${t('avgOfAll')} ${t('division')}s (${formatNumber(true, divisionGraphDto?.data?.average, 1)} <span>${divisionGraphDto?.data?.unit}</span>)`
                  })
                  }
                />
              </Col>
              {/* Regional Emission Table */}
              <Col lg="6" md="12">
                <div className="mainGrayCards h-100">
                  <div className="regionWiseTxt">
                    <div className="p-3">
                      <Heading level="6" className="mb-3 laneBreakdownHeading font-14 font-xxl-20 fw-semibold">{getEmmisonName(checked)} of All {t('division')}s for {graphTitle}</Heading>
                      <PerformanceHeading />
                    </div>
                    <EmissionsIntensityTable
                      order={order}
                      colName={colName}
                      handleChangeOrder={handleChangeOrder}
                      loadingTableData={divisionTableDtoLoading}
                      emissionList={divisionTableDto?.data}
                      colLabel="Division"
                      navigateLink={(row: any) => {
                        navigate(`/scope3/division-overview/${row?.division_id}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}`)
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

export default DivisionView;
