import VendorViewController from "./vendorViewController";
import TitleComponent from "component/tittle";
import DataSource from "component/aboutLink/index";
import ButtonComponent from "component/forms/button";
import Loader from "component/loader/Loader";
import VendorTableFilter from "./VendorTableFilter";
import Heading from "component/heading";
import VendorTable from "./VendorTable";
import { getGraphTitle } from "utils";
import { useTranslation } from "react-i18next";

/**
 *
 * @returns Carrier view page
 */

const VendorView = () => {
  // Importing all states and functions from Vendor Controller
  const {
    regions,
    regionalLevel,
    yearlyData,
    quarterDetails,
    emissionsValue,
    searchCarrier,
    handleDownloadCsv,
    isLoadingExportVendorTableDetails,
    rangeValues,
    vendorTableDetails,
    isLoadingVendorTableDetails,
    handleFinalRangeChange,
    handleChangeRange,
    handleSearchCarrier,
    handleRegionSelect,
    configConstants,
    pId,
    setPId,
    weekId,
    setWeekId,
    timeId,
    setQuarterDetails,
    setYearlyData,
    divisionOptions,
    divisionLevel,
    setDivisionLevel,
    regionOption,
    yearOption,
    timePeriodList,
    loginDetails,
    divisions,
    dispatch,
    showLatestYear
  } = VendorViewController();

  const tableHeading = getGraphTitle({
    year: yearlyData,
    regionId: regionalLevel,
    division: divisionLevel,
    pId: pId,
    weekId: weekId,
    quarter: quarterDetails,
    regionList: regions,
    divisionList: divisions,
    timeList: timePeriodList,
    loginDetails,
  })
  const { t } = useTranslation()
  return (
    <>
      <TitleComponent
        title={"Segmentation By Carrier"}
        pageHeading={t('byCarrierTitle')}
      />
      <Loader isLoading={[isLoadingExportVendorTableDetails]} />
      <section className="carrier-screen pb-4" data-testid="carrier-view">
        <div className="carrier-screen-wraper">
          <div className="pb-3 carrier-section">
            <div className="px-2 pb-4 pt-2">
              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                <Heading
                  level="6"
                  content={`Carriers for ${tableHeading}`}
                  className="font-xxl-24 font-20 fw-semibold mb-0"
                />
                <div className="carrier-heading pb-0">
                  <div className="text-end">
                    <ButtonComponent
                      data-testid="export-download-btn"
                      disabled={
                        !vendorTableDetails?.data?.responseData?.length
                      }
                      onClick={handleDownloadCsv}
                      imagePath="/images/export.svg"
                      text="Export"
                      btnClass="btn-deepgreen border-0 font-14 font-xxl-16 exportSvg-icon"
                    />
                  </div>
                </div>
              </div>
              <div>
                <VendorTableFilter
                  vendorTableFilterId="vendor-table-filter"
                  isLoadingVendorTableDetails={isLoadingVendorTableDetails}
                  regionalLevel={regionalLevel}
                  yearlyData={yearlyData}
                  quarterDetails={quarterDetails}
                  handleChangeRange={handleChangeRange}
                  handleRegionSelect={handleRegionSelect}
                  rangeValues={rangeValues}
                  searchCarrier={searchCarrier}
                  handleFinalRangeChange={handleFinalRangeChange}
                  handleSearchCarrier={handleSearchCarrier}
                  configConstants={configConstants}
                  pId={pId}
                  setPId={setPId}
                  weekId={weekId}
                  setWeekId={setWeekId}
                  setQuarterDetails={setQuarterDetails}
                  setYearlyData={setYearlyData}
                  divisionOptions={divisionOptions}
                  divisionLevel={divisionLevel}
                  setDivisionLevel={setDivisionLevel}
                  regionOption={regionOption}
                  yearOption={yearOption}
                  dispatch={dispatch}
                />
                <VendorTable
                  performanceTestId="performance-heading"
                  carrierTestId="table-heading-data"
                  tableTestId="vendor-table-data"
                  clickRowTestId="click-row-carrier"
                  emissionTestId="emission-intensity"
                  shipmentTestId="total-shipments"
                  totalEmissionTestId="total-emission"
                  regionalLevel={regionalLevel}
                  divisionLevel={divisionLevel}
                  yearlyData={yearlyData}
                  quarterDetails={quarterDetails}
                  emissionsValue={emissionsValue}
                  searchCarrier={searchCarrier}
                  pId={pId}
                  weekId={weekId}
                  timeId={timeId}
                  defaultUnit={configConstants?.data?.default_distance_unit}
                  showLatestYear={showLatestYear}
                />
              </div>
            </div>
            <div className=" px-3"><DataSource /></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VendorView;
