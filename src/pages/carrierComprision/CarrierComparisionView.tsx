import CarrierComparisionController from "./carrierComparisionController";
import SelectDropdown from "component/forms/dropdown";
import ImageComponent from "component/images";
import TitleComponent from "component/tittle";
import { Row, Col } from "reactstrap";
import { getGraphTitle } from "utils";
import ButtonComponent from "component/forms/button";
import RegionFilter from "component/forms/regionFilter";
import DateFilter from "component/forms/dateFilter";
import CarrierGraph from "./CarrierGraph";
import { useTranslation } from "react-i18next";
import { setDivisionId } from "store/auth/authDataSlice";
import CustomModal from "component/DailogBox/CustomModal";

const CarrierComparisionView = () => {
  const {
    setInitLoading,
    handleSearch,
    handleSectionClick,
    handleRegionLevel,
    handleYearChange,
    handleChangeQuarter,
    handleMenuChange,
    handleOnMenuKeyDown,
    focusPoint,
    menuIsOpen1,
    lane1,
    laneCarrierListName,
    setLane1,
    lane2,
    setLane2,
    handleMenu2Click,
    handleMenu2KeyDown,
    focusPoint2,
    menuIsOpen2,
    regionOption,
    regionalLevel,
    regions,
    yearlyData,
    quarterDetails,
    isDisable,
    handleReset,
    getLaneCarrierCompaireDtoLoading,
    getLaneCarrierCompaireDto,
    getActiveClass,
    isDisableReset,
    setIsDisableReset,
    divisionLevel,
    setDivisionLevel,
    divisionOptions,
    pId,
    setPId,
    weekId,
    setWeekId,
    timePeriodList,
    loginDetails,
    divisions,
    dispatch,
    resetCarrier,
    showPopup,
    setShowPopup,
    configConstants
  } = CarrierComparisionController();

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
    loginDetails,
  });
  const { t } = useTranslation();
  return (
    <>
      {/* Title component */}
      <TitleComponent
        title={"Carrier Comparision"}
        pageHeading={t("carrierComparisonTitle")}
      />
      <section
        className="carrier-screen pb-4"
        data-testid="carrier-comparision"
      >
        <button
          className="carrier-screen-wraper carrier-comparision border-0 p-0 bg-transparent w-100 cursorAuto"
          onClick={handleSectionClick}
        >
          <div className="carrier-section py-3 px-2">
            <div className="select-box filters mb-3 d-flex gap-2 flex-column p-3">
              <div className="d-flex flex-wrap gap-2 filter-inner">
                <RegionFilter
                  isDisabled={getLaneCarrierCompaireDtoLoading}
                  regionAriaLabel="carrier-region-dropdown"
                  regionOption={regionOption}
                  divisionOptions={divisionOptions}
                  regionalLevel={regionalLevel}
                  divisionLevel={divisionLevel}
                  handleChangeDivision={(e: any) => {
                    setDivisionLevel(e.value);
                    dispatch(setDivisionId(e.value));
                    handleRegionLevel("");
                    dispatch(resetCarrier());
                    setInitLoading(true);
                  }}
                  handleChangeRegion={(e: any) => handleRegionLevel(e.value)}
                />
                {/* Dropdown for selecting yearly data */}
                <DateFilter
                  yearDropDownId="carrier-yearly-dropdown"
                  quarterDropDownId="quarter-dropdown"
                  isLoading={getLaneCarrierCompaireDtoLoading}
                  yearlyId={yearlyData}
                  quarterId={quarterDetails}
                  pId={pId}
                  setPId={setPId}
                  weekId={weekId}
                  setWeekId={setWeekId}
                  updateYear={(e: any) => {
                    setPId(0);
                    setWeekId(0);
                    handleYearChange(e);
                    handleChangeQuarter(0);
                    dispatch(resetCarrier());
                    setInitLoading(true);
                  }}
                  updateQuarter={(e: any) => {
                    setPId(0);
                    setWeekId(0);
                    handleChangeQuarter(e.value);
                    dispatch(resetCarrier());
                    setInitLoading(true);
                  }}
                />
              </div>
              <div className="d-flex flex-wrap gap-2 filter-inner">
                <button
                  type="button"
                  data-testid="carrier1-dropdown-button"
                  onClick={(event) => handleMenuChange(event)}
                  onKeyDown={(event) => handleOnMenuKeyDown(event)}
                  className="search-icon-img p-0 border-0 cursor"
                >
                  <span className="height-0 d-block">
                    <ImageComponent
                      path="/images/search.svg"
                      className="search-img"
                    />
                  </span>
                  <SelectDropdown
                    aria-label="carrier1-dropdown"
                    focusPoint={focusPoint}
                    menuIsOpen={
                      !getLaneCarrierCompaireDtoLoading ? menuIsOpen1 : false
                    }
                    isSearchable={true}
                    disabled={getLaneCarrierCompaireDtoLoading}
                    customClass="mt-2 mt-md-0 text-capitalize carrire-search-dropdown text-start"
                    options={laneCarrierListName?.data?.carrierList
                      ?.filter((i: any) => i?.carrier_code !== lane2?.value)
                      ?.map((x: any) => ({
                        value: x?.carrier_code,
                        label: x?.carrier_name,
                      }))}
                    placeholder="Carrier 1"
                    selectedValue={lane1}
                    onChange={(e: any) => {
                      setLane1(e);
                      setIsDisableReset(false);
                    }}
                  />
                </button>

                <button
                  type="button"
                  data-testid="carrier2-dropdown-button"

                  onClick={(event: any) => handleMenu2Click(event)}
                  onKeyDown={(event: any) => handleMenu2KeyDown(event)}
                  className="search-icon-img p-0 border-0 cursor"
                >
                  <span className="height-0 d-block">
                    <ImageComponent
                      path="/images/search.svg"
                      className="search-img"
                    />
                  </span>

                  <SelectDropdown
                    aria-label="carrier2-dropdown"
                    focusPoint={focusPoint2}
                    menuIsOpen={
                      !getLaneCarrierCompaireDtoLoading ? menuIsOpen2 : false
                    }
                    isSearchable={true}
                    disabled={getLaneCarrierCompaireDtoLoading}
                    customClass="mt-2 mt-md-0 text-capitalize carrire-search-dropdown text-start"
                    options={laneCarrierListName?.data?.carrierList
                      ?.filter((i: any) => i?.carrier_code !== lane1?.value)
                      ?.map((x: any) => ({
                        value: x?.carrier_code,
                        label: x?.carrier_name,
                      }))}
                    placeholder="Carrier 2"
                    selectedValue={lane2}
                    onChange={(e: any) => {
                      setLane2(e);
                      setIsDisableReset(false);
                    }}
                  />
                </button>
                <div className="d-flex gap-2 compare-btns">
                  <ButtonComponent
                    data-testid="compare-button"
                    text="Compare"
                    disabled={isDisable()}
                    btnClass="btn-deepgreen font-14 py-1"
                    onClick={() => handleSearch()}
                  />
                  <ButtonComponent
                    data-testid="reset-button"
                    disabled={isDisableReset}
                    text="Reset"
                    onClick={() => handleReset()}
                    btnClass="btn-deepgreen font-14 py-1"
                  />
                </div>
              </div>
            </div>
            <Row className="g-3">
              {[
                {
                  dataytpe: "intensity",
                  headingC: "Emissions Intensity",
                  subtitle: `(gCO2e/Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"})`,
                },
                {
                  dataytpe: "shipments",
                  headingC: "Total Shipments",
                  subtitle: "",
                },
                {
                  dataytpe: "emission",
                  headingC: "Total Emissions",
                  subtitle: "(tCO2e)",
                },
              ].map(({ dataytpe, headingC, subtitle }) => (
                <Col lg="6" key={dataytpe}>
                  <CarrierGraph
                    isLoadingFilter={getLaneCarrierCompaireDtoLoading}
                    laneCarrierCompaireDto={getLaneCarrierCompaireDto}
                    graphHeading={graphHeading}
                    getActiveClass={getActiveClass}
                    isDisable={isDisable}
                    dataytpe={dataytpe}
                    headingC={headingC}
                    subtitle={subtitle}
                  />
                </Col>
              ))}
            </Row>
          </div>
          <CustomModal
            show={showPopup}
            primaryButtonTestId="cancel-delete"
            handleClose={() => setShowPopup(false)}
            modalHeader=""
            modalClass="dataManagement"
          >
            {" "}
            <p className="font-20 fw-semibold text-center">
              There is only one active carrier available for this selection.
            </p>
          </CustomModal>
        </button>
      </section>
    </>
  );
};

export default CarrierComparisionView;
