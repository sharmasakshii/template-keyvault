import Heading from "../../component/heading";
import ImageComponent from "../../component/images";
import ButtonComponent from "../../component/forms/button";
import SelectDropdown from "../../component/forms/dropdown";
import { Row, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { LanePlanningController } from "./lanePlanningController";
import TitleComponent from "component/tittle";
import GoogleMapView from "component/map";
import PriorityFilter from "./PriorityFilter";
import RecommondationCard from "./RecommondationCard";
import LanePlanningCard from "./LanePlanningCard";
import CreateProjectModal from "./CreateProjectModal";
import MapComponent from "component/map/MapComponent";
import LaneFilterComponent from "./LaneFilterComponent";
import LaneMapCard from "./LaneMapCard";
import Spinner from "component/spinner";
import { formatPerUnit } from "utils";
import FuelTypeCard from "./FuelTypeCard";

/**
 * Renders a LaneSuggestionCard component.
 *
 * @return {JSX.Element} the rendered LaneSuggestionCard component
 */
const LaneSuggestionView = () => {
  const {
    originInput,
    setOriginInput,
    destinationInput,
    setDestinationInput,
    originCity,
    setOriginCity,
    originOptions,
    destinationCity,
    setDestinationCity,
    destinationOptions,
    handleSearchOrigin,
    handleSearchDestination,
    selectHighWay,
    setSelectHighWay,
    selectRail,
    setSelectRail,
    reverseLocation,
    handleViewLaneCalculation,
    handleResetLane,
    priority,
    setPriority,
    menuIsOpen1,
    setMenuIsOpen1,
    isLaneOriginLoading,
    menuIsOpen2,
    setMenuIsOpen2,
    isLaneDestinationLoading,
    handleSectionClick,
    handleOriginMenuChange,
    handleDestinationMenuChange,
    searchDestination,
    laneSortestPathLoading,
    isLaneScenarioDetailLoading,
    showNoLane,
    showLaneCalculation,
    selectedRecommondation,
    recommondedLanes,
    laneSortestPathData,
    laneScenarioDetail,
    showFuelStops,
    setShowFuelStops,
    handleSelectRecommondation,
    navigate,
    handleOpenCreateProject,
    createProjectModalShow,
    formik,
    selectedLane,
    handleClose,
    feedBackModalShow,
    isLoadingSaveProject,
    feedBackRating,
    ratingChanged,
    feedbackMessage,
    setFeedbackMessage,
    handleSubmitFeedback,
    handleSearchUser,
    searchedUsers,
    handleSelectUser,
    handleSelectInviteUser,
    handleDeleteInvite,
    feedBackRatingError,
    params,
    showFuelStopsEV,
    selectedFuelStop,
    setSelectedFuelStop,
    setShowFuelStopsEV,
    setProjectValues,
    showFullScreen,
    setShowFullScreen,
    configConstants,
    showFuelStopsRD,
    setShowFuelStopsRD,
    isLoadingEmailSearch,
    filterList,
    t,
    handleSearch,
    thresholdV,
    threshold,
    handleThresholdChange,
    checkLaneFuelData,
    isCheckLaneFuelLoading,
    handleClearSelectSelection,
    handleChange,
    isCreateProject,
    radiusOptions,
    radius,
    handleRadiusChange,
    handleAlternativeFuelCheckbox,
    handleEvCheckbox,
    handleBlur
  } = LanePlanningController();
  const defaultUnit = configConstants?.data?.default_distance_unit;

  let backText = "Back to Inputs";
  if (params?.regionId) {
    backText = "Back to Recommendations";
  } else if (params?.pageUrl === "reports") {
    backText = "Back to Decarb Discovery";
  } else if (params?.pageUrl === "lanes") {
    backText = "Back to By Lane";
  }
  return (
    <>
      <TitleComponent
        title={"Lane Planning"}
        pageHeading={`Act: ${!showLaneCalculation ? "Lane Planning" : "Lane Recommendations"
          }`}
      />
      <section data-testid="lane-planning">
        <div className="laneScenario-screen pt-1">
          <div className="laneScenario-section p-2">
            {!showLaneCalculation ? (
              <Row onClick={handleSectionClick} className="g-3">
                <Col lg="4" xxl="4">
                  <div className="planning-wrap p-3 h-100">
                    <Heading
                      content="Lane Planning"
                      level="4"
                      className="font-20 fw-semibold mb-3"
                    />
                    <div
                      className="lanePlanning-leftwrap"
                      data-testid="lane-calc-id"
                    >
                      {/* origin destination dropdown section with the filters */}
                      {!showNoLane && (
                        <div>
                          <Form onSubmit={handleViewLaneCalculation}>
                            <div
                              className="select-box mb-3"
                              data-testid="spinner-load"
                            >
                              <button
                                type="button"
                                className="search-icon-img p-0 border-0 cursor w-100"
                                onClick={(event) =>
                                  handleOriginMenuChange(event)
                                }
                              >
                                {isLaneOriginLoading ? (
                                  <div className="dropdownSpinner">
                                    <div className="spinner-border ">
                                      <span className="sr-only"></span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="height-0 d-block">
                                    <ImageComponent
                                      path="/images/search.svg"
                                      className="pe-0 search-img"
                                    />
                                  </span>
                                )}
                                <SelectDropdown
                                  aria-label="origin-dropdown"
                                  placeholder="Enter Origin"
                                  isSearchable={true}
                                  selectedValue={originCity}
                                  menuIsOpen={menuIsOpen1}
                                  onChange={(e: any) => {
                                    setOriginCity(e);
                                    searchDestination(e);
                                    setMenuIsOpen1(false);
                                    setOriginInput("");
                                  }}
                                  onInputChange={(
                                    value: string,
                                    { action }: any
                                  ) => {
                                    if (
                                      action !== "input-blur" &&
                                      action !== "menu-close"
                                    ) {
                                      setOriginInput(value);
                                      handleSearchOrigin(value);
                                    }
                                  }}
                                  inputValue={originInput}
                                  options={originOptions}
                                  customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize w-auto text-start"
                                />
                              </button>

                              <div className=" text-center arrow-icons my-2">
                                <ButtonComponent
                                  imagePath="/images/upDown.svg"
                                  data-testid="upDown-arrows"
                                  disabled={!(originCity || destinationCity)}
                                  text=""
                                  onClick={reverseLocation}
                                />
                              </div>

                              <button
                                type="button"
                                className="search-icon-img lane p-0 border-0 cursor w-100"
                                onClick={(event) =>
                                  handleDestinationMenuChange(event)
                                }
                              >
                                {isLaneDestinationLoading ? (
                                  <div className="dropdownSpinner">
                                    <div className="spinner-border ">
                                      <span className="sr-only"></span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="height-0 d-block">
                                    <ImageComponent
                                      path="/images/search.svg"
                                      className="pe-0 search-img"
                                    />
                                  </span>
                                )}
                                <SelectDropdown
                                  aria-label="destination-dropdown"
                                  placeholder="Enter Destination"
                                  isSearchable={true}
                                  selectedValue={destinationCity}
                                  menuIsOpen={menuIsOpen2}
                                  inputValue={destinationInput}
                                  onChange={(e: any) => {
                                    setDestinationCity(e);
                                    setMenuIsOpen2(false);
                                    setDestinationInput("");
                                  }}
                                  onInputChange={(
                                    value: string,
                                    { action }: any
                                  ) => {
                                    if (
                                      action !== "input-blur" &&
                                      action !== "menu-close"
                                    ) {
                                      setDestinationInput(value);
                                      if (value.length >= 3) {
                                        handleSearchDestination(value);
                                      }
                                    }
                                  }}
                                  options={destinationOptions}
                                  customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize w-auto text-start"
                                />
                              </button>
                            </div>
                            <Heading
                              content="Prioritize Results By"
                              level="4"
                              className="font-20 fw-semibold"
                            />
                            <div
                              className="mb-3"
                              data-testid="priority-filter-id"
                            >
                              <PriorityFilter
                                priority={priority}
                                setPriority={setPriority}
                              />
                            </div>
                            <Heading
                              content="Filters"
                              level="4"
                              className="font-20 fw-semibold"
                            />
                            <div className="mb-3">
                              <FormGroup check>
                                <Input
                                  data-testid="highway-id"
                                  type="checkbox"
                                  checked={selectHighWay}
                                  onChange={() => {
                                    setSelectHighWay(!selectHighWay);
                                  }}
                                />
                                <Label check>Highway</Label>
                              </FormGroup>
                              <FormGroup check>
                                <Input
                                  data-testid="rail-id"
                                  type="checkbox"
                                  checked={selectRail}
                                  onChange={() => {
                                    setSelectRail(!selectRail);
                                  }}
                                />
                                <Label check>Rail</Label>
                              </FormGroup>
                              <p
                                data-testid="filter-errors"
                                className="dangerTxt"
                              >
                                {!(selectHighWay || selectRail) &&
                                  "Please select atleast one filter."}
                              </p>
                            </div>
                            <div>
                              <ButtonComponent
                                text="View Lane Calculations"
                                type="submit"
                                data-testid="view-lane-calculation-button"
                                btnClass="btn-deepgreen fw-medium font-14 py-2 px-4 mb-0"
                                loaderClass={"viewLanes"}
                                isLoading={
                                  isLaneScenarioDetailLoading ||
                                  laneSortestPathLoading
                                }
                                disabled={
                                  !(selectHighWay || selectRail) ||
                                  !(
                                    originCity?.value && destinationCity?.value
                                  ) ||
                                  !Object.values(priority).some(
                                    (value) => value
                                  )
                                }
                              />
                            </div>
                          </Form>
                        </div>
                      )}
                      {/* when no data avialable section */}
                      {showNoLane && (
                        <div>
                          <div className="noLanes-data">
                            <div className="d-flex align-items-center gap-3">
                              <div className="d-flex gap-3">
                                <ImageComponent
                                  path="/images/failedIcon.svg"
                                  className="pe-0 failedIcon"
                                  enableBtn={false}
                                />
                                <ImageComponent
                                  path="/images/errorLine.svg"
                                  className="pe-0"
                                  enableBtn={false}
                                />
                              </div>
                              <Heading
                                content="We do not have any lane recommendations for your search criteria."
                                level="4"
                                className="font-16 font-xxl-20 fw-normal mb-0"
                              />
                            </div>
                          </div>
                          <div className="text-center mt-3">
                            <ButtonComponent
                              data-testid="newSearch-id"
                              text="Start new search"
                              btnClass="btn-deepgreen text-capitalize fw-medium font-14 py-2 px-4 mb-0"
                              onClick={handleResetLane}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col lg="8" xxl="8">
                  <div className="lanePlanning-rightwrap ">
                    <MapComponent
                      showFullScreen={showFullScreen}
                      setShowFullScreen={setShowFullScreen}
                      isFullScreen={true}
                    >
                      <GoogleMapView
                        origin={originCity?.value}
                        destination={destinationCity?.value}
                      />
                    </MapComponent>
                  </div>
                </Col>
              </Row>
            ) : (
              <div>
                <ButtonComponent
                  data-testid="back-to-input"
                  imagePath="/images/back.svg"
                  text={
                    backText
                  }
                  onClick={handleResetLane}
                  btnClass="btn-deepgreen fw-medium font-14 py-1 px-3 mb-3"
                />
                <Row className="g-3">
                  <Col lg="12">

                    <LanePlanningCard
                      lane={selectedLane}
                      isCheckLaneFuelLoading={isCheckLaneFuelLoading}
                      deltaMetrix={laneSortestPathData?.data?.delta_metrix}
                      scenarioDetails={laneScenarioDetail}
                      laneDto={laneSortestPathData}
                      showFuelStops={showFuelStops}
                      showFuelStopsEV={showFuelStopsEV}
                      setShowFuelStops={setShowFuelStops}
                      setShowFuelStopsEV={setShowFuelStopsEV}
                      selectedFuelStop={selectedFuelStop}
                      setSelectedFuelStop={setSelectedFuelStop}
                      showFuelStopsRD={showFuelStopsRD}
                      setShowFuelStopsRD={setShowFuelStopsRD}
                      isLaneScenarioDetailLoading={isLaneScenarioDetailLoading}
                      params={params}
                      filterList={filterList}
                      configConstants={configConstants}
                      handleSearch={handleSearch}
                      threshold={threshold}
                      handleThresholdChange={handleThresholdChange}
                      handleClearSelectSelection={handleClearSelectSelection}
                      handleChange={handleChange}
                      radiusOptions={radiusOptions}
                      radius={radius}
                      handleRadiusChange={handleRadiusChange}
                      handleAlternativeFuelCheckbox={handleAlternativeFuelCheckbox}
                      handleEvCheckbox={handleEvCheckbox}
                      handleBlur={handleBlur}
                    />

                  </Col>
                  <Col lg="4" xxl="4">
                    <div className="calculation-wrapper ">
                      {isLaneScenarioDetailLoading ? (
                        <Spinner spinnerClass="py-5 my-4 justify-content-center" />
                      ) : (
                        <>
                          <div className="mb-3">
                            <div className="calculationsData">
                              <LaneFilterComponent
                                laneSortestPathData={laneSortestPathData}
                                selectHighWay={selectHighWay}
                                selectRail={selectRail}
                                city={`${originCity?.value} to ${destinationCity?.value}`}
                                defaultUnit={defaultUnit}
                                radius={radius}
                              />
                              {selectedLane?.key === "alternative_fuel" &&
                                <FuelTypeCard
                                  thresholdV={thresholdV}
                                  isCheckLaneFuelLoading={isCheckLaneFuelLoading}
                                  checkLaneFuelData={checkLaneFuelData}
                                  selectedFuelStop={selectedFuelStop}
                                />
                              }
                            </div>
                          </div>

                          {laneSortestPathData?.data?.dat_by_lane
                            ?.dollar_per_mile && (
                              <div className="dat-info d-flex align-items-center gap-2">
                                <ImageComponent
                                  path="/images/dat-logo.svg"
                                  className="pe-0"
                                />
                                <Heading
                                  level="4"
                                  className="font-16 fw-semibold mb-0"
                                >
                                  $
                                  {
                                    laneSortestPathData?.data?.dat_by_lane
                                      ?.dollar_per_mile
                                  }{" "}
                                  <span className="fw-normal">
                                    per{" "}{formatPerUnit(defaultUnit)}
                                  </span>
                                </Heading>
                              </div>
                            )}

                          <div className="lane-leftwrap pt-3">
                            {!laneSortestPathLoading &&
                              recommondedLanes?.length > 0 &&
                              recommondedLanes?.map(
                                (lane: any, index: number) => (
                                  <RecommondationCard
                                    key={lane?.recommondationId}
                                    index={lane?.recommondationId}
                                    lane={lane}
                                    btnIndex={index}
                                    selectedRecommondation={
                                      selectedRecommondation
                                    }
                                    deltaMetrix={
                                      laneSortestPathData?.data?.delta_metrix
                                    }
                                    scenarioDetails={laneScenarioDetail}
                                    handleSelectRecommondation={
                                      handleSelectRecommondation
                                    }
                                    isCheckLaneFuelLoading={isCheckLaneFuelLoading}
                                    routeType={
                                      lane?.key === "modal_shift"
                                        ? "modal_shift"
                                        : "alternative_fuel"
                                    }
                                    handleOpenCreateProject={
                                      handleOpenCreateProject
                                    }
                                    navigate={navigate}
                                    laneName={`${originCity?.value}_${destinationCity?.value}`}
                                    showFuelStops={showFuelStops}
                                    showFuelStopsEV={showFuelStopsEV}
                                    laneDto={laneSortestPathData}
                                    isLanePlanning={true}
                                    selectedFuelStop={selectedFuelStop}
                                    setProjectValues={setProjectValues}
                                    configConstants={configConstants}
                                    showFuelStopsRD={showFuelStopsRD}
                                    isCreateProject={isCreateProject}
                                    checkLaneFuelData={checkLaneFuelData}
                                  />
                                )
                              )}
                          </div>
                        </>
                      )}
                    </div>
                  </Col>
                  <Col lg="8" xxl="8">

                    <LaneMapCard
                      lane={recommondedLanes.find(
                        (obj) =>
                          obj["recommondationId"] === selectedRecommondation
                      )}
                      laneDto={laneSortestPathData}
                      baseLineDto={laneSortestPathData?.data?.baseLine}
                      showFuelStops={showFuelStops}
                      showFuelStopsEV={showFuelStopsEV}
                      selectedFuelStop={selectedFuelStop}
                      originCity={originCity}
                      destinationCity={destinationCity}
                      navigate={navigate}
                      laneName={`${originCity?.value}_${destinationCity?.value}`}
                      laneSortestPathData={laneSortestPathData}
                      showFullScreen={showFullScreen}
                      setShowFullScreen={setShowFullScreen}
                      configConstants={configConstants}
                      laneSortestPathLoading={laneSortestPathLoading}
                      showFuelStopsRD={showFuelStopsRD}
                      defaultUnit={defaultUnit}
                      t={t}

                    />
                  </Col>
                </Row>
              </div>
            )}
          </div >
        </div >
        <CreateProjectModal
          modal={createProjectModalShow}
          createModalId="create-modal-project"
          savaAndCreateId="save-and-create-btn"
          deleteBtnId="delete-email-id"
          formik={formik}
          handleClose={handleClose}
          feedBackModalShow={feedBackModalShow}
          isLoadingSaveProject={isLoadingSaveProject}
          feedBackRating={feedBackRating}
          ratingChanged={ratingChanged}
          feedbackMessage={feedbackMessage}
          setFeedbackMessage={setFeedbackMessage}
          handleSubmitFeedback={handleSubmitFeedback}
          handleSearchUser={handleSearchUser}
          searchedUsers={searchedUsers}
          handleSelectUser={handleSelectUser}
          handleSelectInviteUser={handleSelectInviteUser}
          feedBackRatingError={feedBackRatingError}
          handleDeleteInvite={handleDeleteInvite}
          isLoadingEmailSearch={isLoadingEmailSearch}
        />
      </section >
    </>
  );
};

export default LaneSuggestionView;
