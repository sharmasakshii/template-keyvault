import TitleComponent from "../../component/tittle";
import RegionalController from './regionalController';
import SelectDropdown from "component/forms/dropdown";
import { Row, Col } from "reactstrap";
import { formatNumber, checkedNullValue, isCompanyEnable, getGraphTitle, getEmmisonName, checkRolePermission } from "../../utils";
import Heading from '../../component/heading';
import { lineColumnChart } from "../../utils/highchart/lineColumnChart";
import DataSource from "../../component/aboutLink/index";
import ChartColumn from "../../component/charts/chartColumn";
import DateFilter from "component/forms/dateFilter";
import ButtonComponent from "component/forms/button";
import PerformanceHeading from "component/PerfomanceHeading";
import { companySlug } from "constant";
import { useTranslation } from 'react-i18next';
import EmissionsIntensityTable from "component/EmissionsIntensity"
import { setDivisionId } from "store/auth/authDataSlice";

/**
 *
 * @returns Regional view page
 */

const RegionalView = () => {
  // Importing all states and functions from Region Controller
  const {
    companyName,
    handleDownloadCsv,
    quarterDetails,
    yearlyData,
    order,
    colName,
    reloadData,
    isLoading,
    checked,
    regionTableDetails,
    regionGraphDetails,
    regionGraphDetailsLoading,
    regionPageArr,
    navigate,
    setChecked,
    setYearlyData,
    setQuarterDetails,
    setReloadData,
    handleChangeOrder,
    pId,
    setPId,
    loginDetails,
    divisionOptions,
    divisionLevel,
    setDivisionLevel,
    timePeriodList,
    divisions,
    weekId, 
    setWeekId,
    dispatch,
    configConstants
  } = RegionalController();
  const { t } = useTranslation()
  const defaultUnit = configConstants?.data?.default_distance_unit;
  return (
    <>
      {/* Carrier View starts */}
      <TitleComponent title={"Regional"} pageHeading={t('regionPageHeading')} />
      <section className="region-screen pb-4" data-testid="regional">
        <div className="region-screen-wraper">
          <div className="region-section py-3 px-2">
            <div className="d-flex flex-wrap justify-content-between border-bottom mb-3">
              <div className="select-box d-flex mb-3 gap-1">
                {!checkRolePermission(loginDetails?.data, "divisionManager") && isCompanyEnable(loginDetails?.data, [companySlug?.pep, companySlug?.demo]) &&
                  <SelectDropdown
                    aria-label="divison-dropdown"
                    disabled={regionGraphDetailsLoading}
                    options={divisionOptions}
                    placeholder="Division"
                    selectedValue={divisionOptions?.filter(
                      (el: any) => el.value?.toString() === divisionLevel?.toString()
                    )}
                    onChange={(e: any) => {
                      setDivisionLevel(e.value);
                      dispatch(setDivisionId(e.value))
                    }}
                  />}
                <DateFilter
                  yearDropDownId="year-dropdown"
                  quarterDropDownId="quarter-dropdown"
                  isLoading={regionGraphDetailsLoading}
                  yearlyId={yearlyData}
                  quarterId={quarterDetails}
                  pId={pId}
                  setPId={setPId}
                  weekId={weekId}
                  setWeekId={setWeekId}
                  updateYear={(e: any) => {
                    setReloadData(false);
                    setYearlyData(e.value)
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
              <ButtonComponent data-testid="export-btn" disabled={!regionTableDetails?.data.length} onClick={handleDownloadCsv} imagePath="/images/export.svg" text={t("export")} btnClass="btn-deepgreen border-0 font-14 font-xxl-16 mb-3 exportSvg-icon" />
            </div>
            <Row className="g-3">
              {/* Regional Emission Graph */}
              <Col lg="6" md="12">
                <ChartColumn name={"Region"} checked={checked} setChecked={setChecked}
                  regionEmissionId="emission-intensity-toggle-region"
                  totalEmissionId="total-emission-toggle-region"
                  testId="graph-data"
                  heading=""
                  isLoading={regionGraphDetailsLoading} dataArr={regionPageArr}
                  graphSubHeading={`${t('regional')} ${getEmmisonName(checked)} for ${getGraphTitle({
                    year: yearlyData,
                    regionId: null,
                    division: divisionLevel,
                    pId: pId,
                    weekId: weekId,
                    quarter: quarterDetails,
                    regionList: [],
                    divisionList: divisions,
                    timeList: timePeriodList,
                    loginDetails
                  })}`
                  }
                  options={lineColumnChart({
                    chart: "region",
                    regionPageArr: regionPageArr,
                    reloadData: reloadData,
                    unitDto: regionGraphDetails?.data?.unit,
                    companyName: companyName,
                    heading: `${t('avgOfAll')} ${t('regionTitle')} (${formatNumber(true, regionGraphDetails?.data?.average, 1)} <span>${regionGraphDetails?.data?.unit}</span>)`
                  }
                  )} />
              </Col>
              {/* Regional Emission Table */}
              <Col lg="6" md="12">
                <div className="mainGrayCards h-100">
                  <div className="regionWiseTxt">
                    <div className="p-3">
                      <Heading level="6" className="mb-3 laneBreakdownHeading font-14 font-xxl-20 fw-semibold">{t('regional')} {getEmmisonName(checked)} for {
                        getGraphTitle({
                          year: yearlyData,
                          regionId: null,
                          division: divisionLevel,
                          pId: pId,
                          weekId: weekId,
                          quarter: quarterDetails,
                          regionList: [],
                          divisionList: divisions,
                          timeList: timePeriodList,
                          loginDetails
                        })
                      }</Heading>
                      <PerformanceHeading />

                    </div>
                    <EmissionsIntensityTable
                      order={order}
                      colName={colName}
                      handleChangeOrder={handleChangeOrder}
                      loadingTableData={isLoading}
                      emissionList={regionTableDetails?.data}
                      colLabel="Regions"
                      navigateLink={(row: any) => {
                        navigate(`/scope3/region-overview/${row?.["region.name"]}/${yearlyData}/${checkedNullValue(quarterDetails)}/${checkedNullValue(pId)}/${checkedNullValue(weekId)}`)
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

export default RegionalView;
