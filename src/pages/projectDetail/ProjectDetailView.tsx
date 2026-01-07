import ProjectDetailController from "./projectDetailController";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import BackLink from "../../component/forms/backLink/index";
import TitleComponent from "component/tittle";
import Heading from "component/heading";
import ButtonComponent from "component/forms/button";
import ProjectDetailCard from "./ProjectDetailCard";
import ImageComponent from "component/images";
import LanePathMap from "component/map/LanePathMap";
import moment from "moment";
import { getTitleDecarb, getFuleType, isCompanyEnable, formatNumber, distanceConverterInterModal } from "utils";
import IntermodalLaneMap from "component/map/IntermodalLaneMap";
import LaneDataCard from "pages/lanePlanning/LaneDataCard";
import RecommondationCard from "pages/lanePlanning/RecommondationCard";
import { companySlug, evProductCode } from "constant";
import MapComponent from "component/map/MapComponent";
import GoogleMapView from "component/map";
import Accordion from 'react-bootstrap/Accordion';
import Loader from "component/loader/Loader";
import FuelTypeCard from "pages/lanePlanning/FuelTypeCard";

const ProjectDetailView = () => {
  // Importing all states and functions from Facility Controller
  const {
    projectDetails,
    isLoadingProjectDetails,
    recommondedLanes,
    isLaneScenarioDetailLoading,
    laneScenarioDetail,
    navigate,
    laneName,
    showFuelStops,
    setShowFuelStops,
    id,
    loginDetails,
    showFuelStopsEV,
    setShowFuelStopsEV,
    showFullScreen,
    setShowFullScreen,
    configConstants,
    showFuelStopsRD,
    isRBCompany,
    // setShowFuelStopsRD
    checkLaneFuelData,
    isCheckLaneFuelLoading,
  } = ProjectDetailController();

  const routeType = recommondedLanes?.lane?.key === "modal_shift" ? "modal_shift" : "alternative_fuel"
  const laneLoaction = laneName?.split("_")
  const selectedFuelStopList = projectDetails?.data?.fuel_stops?.filter((item: any) => projectDetails?.data?.projectDetail?.fuel_type?.split(",")?.includes(item.code))?.map((i: any) => ({ ...i, product_code: i.code, product_type_id: String(i.id), product_name: i.name }))
  const defultFuelType = projectDetails?.data?.projectDetail?.fuel_type !== "" ? selectedFuelStopList : projectDetails?.data?.fuel_stops?.filter((item: any) => projectDetails?.data?.laneRecommendation?.baseLine?.fuel_stop?.product_code?.includes(item.code))?.map((i: any) => ({ ...i, product_code: i.code }))
  const fuelStopTypes = getFuleType(projectDetails?.data?.projectDetail?.fuel_type_name, projectDetails?.data?.laneRecommendation?.baseLine?.fuel_stop?.product_name, projectDetails?.data?.projectDetail, projectDetails?.data?.laneRecommendation?.recommendedLane?.recommendedKLaneFuelStop?.filter((res: any) => res.product_code !== evProductCode)?.length)
  return (
    <>
      <TitleComponent title={"Project Detail"} pageHeading={`Project Detail`} />
      <section
        className="projectDetail-screen bg-white p-2 p-xl-3 rounded"
        data-testid="project-detail"
      >
        <Loader isLoading={[isLoadingProjectDetails, isLaneScenarioDetailLoading]} />
        {(!isLoadingProjectDetails && !isLaneScenarioDetailLoading && projectDetails?.data?.projectDetail) && (
          <>
            <div className="projectDetail-heading mb-3">
              <div className=" py-3 pt-1 d-inline-block">
                <BackLink btnText="Back to Projects" link="scope3/projects" />
              </div>
              <div className="d-flex flex-wrap gap-3 pacific-overview align-items-center">
                <h2 className="mb-0 font-20 font-xxl-28 fw-semibold">{getTitleDecarb(projectDetails?.data?.projectDetail?.type)} - {projectDetails?.data?.projectDetail?.project_name}</h2>
                <ButtonComponent
                  text={`On track`}
                  btnClass="trackBtn font-12 px-4"
                />
              </div>
              <h6 className="font-14 m-0 fw-normal">
                ID: {projectDetails?.data?.projectDetail?.project_unique_id}
              </h6>
            </div>
            <div className="projectDetail-section">
              <div className="topBarOverview p-4 pb-4 pb-xxl-5">
                <div className="d-flex align-items-center gap-3">
                  <div className="startDate font-14">
                    Start Date: <span className="fw-medium">{moment
                      .utc(projectDetails?.data?.projectDetail?.start_date)
                      .format("DD MMM YYYY")}</span>
                  </div>
                  <div className="startDate font-14">
                    Estimation End Date: <span className="fw-medium">{moment
                      .utc(projectDetails?.data?.projectDetail?.end_date)
                      .format("DD MMM YYYY")}</span>
                  </div>
                </div>
                <ProjectDetailCard projectDetail={projectDetails?.data}
                  configConstants={configConstants}
                />
              </div>
              {/* Project Carrier Table */}
              <div className="mt-4">
                <Heading
                  level="5"
                  content="Project Description"
                  className="font-20 fw-medium"
                />
                <Heading
                  level="5"
                  content={projectDetails?.data?.projectDetail?.desc}
                  className="font-16 text-justify mb-3 fw-normal"
                />
              </div>

              <div className="mt-3 alternativeFuel p-3 rounded">

                <Row className="g-3">
                  <Col lg="12">
                    <div className="recommendationMain-card bg-white mb-0">
                      <div className="recommendationTxt d-flex align-items-center flex-wrap justify-content-between  pb-0">
                        {recommondedLanes?.lane?.key === "alternative_fuel" &&
                          <>
                            <div className="d-flex align-items-center gap-2 ">
                              <Heading
                                level="4"
                                className="font-20 mb-0 fw-semibold"
                              >
                                Alternative Fuels
                              </Heading>

                            </div>
                            <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center w-100">
                              <div className="d-flex flex-wrap align-items-center gap-2">

                                {(projectDetails?.data?.laneRecommendation?.recommendedLane?.recommendedKLaneFuelStop?.filter((res: any) => res.product_code !== evProductCode)?.length > 0 && projectDetails?.data?.projectDetail?.is_alternative) && <>

                                  <FormGroup check className="mb-0">
                                    <Input type="checkbox" checked={showFuelStops} onChange={() => {
                                      setShowFuelStops(!showFuelStops)
                                    }} />
                                    <Label check className="font-12 font-xxl-14">
                                      Alternative Fuel
                                    </Label>
                                  </FormGroup>
                                  {(isCompanyEnable(loginDetails?.data, [companySlug?.pep]) && projectDetails?.data?.projectDetail?.is_ev) && <span className="line">|</span>}
                                </>}
                                {(isCompanyEnable(loginDetails?.data, [companySlug?.pep]) && projectDetails?.data?.projectDetail?.is_ev) &&
                                  <>

                                    <FormGroup check className="mb-0">
                                      <Input type="checkbox" checked={showFuelStopsEV} onChange={() => {
                                        setShowFuelStopsEV(!showFuelStopsEV)
                                      }} />
                                      <Label check className="font-12 font-xxl-14">
                                        EV Charging
                                      </Label>
                                    </FormGroup>
                                    <ImageComponent path="/images/evChargeIcon.svg" className="pe-0 recommendation-img" />
                                  </>
                                }
                              </div>
                              <div className="fuelStop font-14 fw-semibold d-flex"><span className="me-1">
                                <ImageComponent path="/images/fuelLocation.svg" className="pe-0" /></span>Fuel Type: <span className="stopNum fw-semibold font-14">{fuelStopTypes}</span>
                              </div>
                            </div>
                          </>
                        }
                        {recommondedLanes?.lane?.key === "carrier_shift" && <Heading
                          level="4"
                          className="font-20 mb-0 fw-semibold"
                        >
                          Carrier Shift
                        </Heading>}
                        {(recommondedLanes?.lane?.key === "modal_shift") && <Heading
                          level="4"
                          className="font-20 mb-0 fw-semibold"
                        >
                          Modal Shift
                        </Heading>}
                      </div>

                      <LaneDataCard
                        lane={recommondedLanes?.lane}
                        deltaMetrix={recommondedLanes?.deltaMetrix}
                        scenarioDetails={laneScenarioDetail}
                        showFuelStops={projectDetails?.data?.projectDetail?.is_alternative}
                        showFuelStopsEV={projectDetails?.data?.projectDetail?.is_ev}
                        showFuelStopsRD={projectDetails?.data?.projectDetail?.is_rd}
                        laneFuelStopDto={projectDetails?.data}
                        selectedFuelStop={selectedFuelStopList}
                        configConstants={configConstants}
                      />
                    </div>
                  </Col>
                  <Col lg="4" xxl="4" className="pe-1">
                    <div className="calculation-wrapper">
                      <div className="calculationsData">
                        <Accordion defaultActiveKey="0" className="mb-3">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Lane Filter</Accordion.Header>
                            <Accordion.Body>
                              <div className="border-bottom">
                                <Heading level="3" content="Lane Name" className="font-16 fw-semibold text-dark mb-2" />
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                  <div className="d-flex gap-2 mb-0">
                                    <ImageComponent path="/images/lane-icon-small.svg" className="pe-0" />
                                    <Heading level="4" className="font-14 fw-semibold destinationName mb-0 text-decoration-underline">{projectDetails?.data?.laneData?.name?.split("_")?.join(" to ")}</Heading>
                                  </div>
                                </div>
                              </div>
                              {(recommondedLanes?.lane?.key === "alternative_fuel") && <div>
                                <Heading level="3" content="Fuel Stops Radius" className="font-16 fw-semibold text-dark mt-2 mb-2" />
                                {selectedFuelStopList.length > 0 && <>
                                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2 mt-3">
                                    <ImageComponent path="/images/fuelNew.svg" className="pe-0" />
                                    <Heading level="4" className="font-14 fw-semibold destinationName mb-0">Alternative Fuels</Heading>
                                  </div>
                                  <ul>
                                    {[
                                      { label: 'Upto B20', key: 'bio_1_20_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug.lw, companySlug?.rb] },
                                      { label: 'B100', key: 'bio_100_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug?.rb] },
                                      { label: 'B21 to B99', key: 'bio_21_99_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug?.rb] },
                                      { label: 'B99', key: 'b99_radius', companies: [companySlug?.demo] },
                                      { label: 'RD', key: 'rd_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug?.rb, companySlug?.bmb] },
                                      { label: 'Optimus', key: 'optimus_radius', companies: [companySlug?.pep] },
                                      { label: 'RNG', key: 'rng_radius', companies: [companySlug?.pep, companySlug?.demo, companySlug?.rb, companySlug?.bmb] },
                                      { label: 'HVO', key: 'hvo_radius', companies: [companySlug?.pep] },
                                      { label: 'HYDROGEN', key: 'hydrogen_radius', companies: [companySlug?.pep, companySlug?.demo] }
                                    ].filter((el) => isCompanyEnable(loginDetails?.data, el.companies)).map(({ label, key }) => <li key={key}>
                                      <Heading level="6" className="font-16 mb-1 fw-normal">
                                        {label}: {" "}
                                        {companySlug?.bmb
                                          ? Number(
                                            Math.floor(
                                              distanceConverterInterModal(
                                                configConstants?.data?.[key],
                                                configConstants?.data?.default_distance_unit
                                              ) * 10
                                            ) / 10
                                          ).toFixed(1)
                                          : configConstants?.data?.[key]}{" "}
                                        {configConstants?.data?.default_distance_unit === "miles" ? "Miles" : "Kms"}
                                      </Heading>
                                    </li>)}
                                  </ul>
                                </>}
                                {isCompanyEnable(loginDetails?.data, [companySlug?.pep]) && projectDetails?.data?.projectDetail?.is_ev && <>
                                  <div className="d-flex flex-wrap align-items-center gap-2 my-2">
                                    <ImageComponent path="/images/evChargeIcon.svg" className="pe-0" />
                                    <Heading level="4" className="font-14 fw-semibold destinationName mb-0">EV Charging Stations </Heading>
                                  </div>
                                  <ul>
                                    <li>
                                      <Heading level="6" className="font-16 mb-1 fw-normal">EV Stations: {" "}
                                        {companySlug?.bmb
                                          ? formatNumber(
                                            true,
                                            distanceConverterInterModal(
                                              projectDetails?.data?.projectDetail?.ev_radius,
                                              configConstants?.data?.default_distance_unit
                                            ),
                                            0
                                          )
                                          : projectDetails?.data?.projectDetail?.ev_radius}{" "}
                                        {configConstants?.data?.default_distance_unit === "miles" ? "Miles" : "Kms"}
                                      </Heading>
                                    </li>
                                  </ul>
                                </>
                                }
                              </div>}
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                        {recommondedLanes?.lane?.key === "alternative_fuel" &&
                          <FuelTypeCard
                            thresholdV={projectDetails?.data?.projectDetail?.threshold_distance}
                            isCheckLaneFuelLoading={isCheckLaneFuelLoading}
                            checkLaneFuelData={checkLaneFuelData}
                            selectedFuelStop={selectedFuelStopList}
                          />
                        }
                      </div>

                      <div className="cardRecommendation bg-white mt-2">

                        <RecommondationCard
                          laneName={laneName}
                          lane={recommondedLanes?.lane}
                          deltaMetrix={recommondedLanes?.deltaMetrix}
                          scenarioDetails={laneScenarioDetail}
                          routeType={routeType}
                          showFuelStops={projectDetails?.data?.projectDetail?.is_alternative}
                          showFuelStopsEV={projectDetails?.data?.projectDetail?.is_ev}
                          showFuelStopsRD={projectDetails?.data?.projectDetail?.is_rd}
                          ev_fuel_stop={projectDetails?.data?.ev_fuel_stop}
                          selectedFuelStop={selectedFuelStopList}
                          laneDto={projectDetails}
                          configConstants={configConstants}
                          isCheckLaneFuelLoading={isCheckLaneFuelLoading}
                          projectId={id} />

                      </div>
                    </div>
                  </Col>
                  <Col lg="8" xxl="8">

                    <div className="mb-3 d-flex justify-content-between align-items-center gap-2 flex-wrap">
                      <div className=" d-flex align-items-center gap-2">
                        <div className="recommendedlineImage d-flex gap-2 align-items-center">
                          <span></span>
                          <Heading
                            level="4"
                            className="font-12 mb-0 fw-medium"
                          >
                            Recommended Lane
                          </Heading>
                        </div>
                        <div className="railImage d-flex gap-2 align-items-center">
                          <span></span>
                          <Heading
                            level="4"
                            className="font-12 mb-0 fw-medium"
                          >
                            Rail Line
                          </Heading>
                        </div>
                      </div>

                      <Heading level="4" className="font-10 mb-0 fw-normal">
                        {`*gCO2e / Ton-${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"} of freight`}

                      </Heading>
                    </div>
                    <div className="projectdetailMap position-relative">
                      <MapComponent showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>

                        {projectDetails?.data?.projectDetail?.type === "modal_shift" &&
                          <IntermodalLaneMap
                            mapOrigin={laneLoaction[0]}
                            mapDestination={laneLoaction[1]}
                            baseLineDto={recommondedLanes?.baseLine}
                            laneIntermodalCordinateData={recommondedLanes?.lane}
                            navigate={navigate}
                            laneName={laneName}
                            loginDetails={loginDetails}
                            configConstants={configConstants}
                            projectId={id}
                            isRBCompany={isRBCompany}
                            routeType={projectDetails?.data?.projectDetail?.type}
                          />
                        }
                        {recommondedLanes?.lane?.key === "carrier_shift" &&
                          <GoogleMapView origin={projectDetails?.data?.laneData?.name?.split("_")?.[0]} destination={projectDetails?.data?.laneData?.name?.split("_")?.[1]} />
                        }


                        {(recommondedLanes?.lane?.key === "alternative_fuel") &&
                          <LanePathMap
                            key={recommondedLanes?.lane?.key}
                            zoom={5}
                            lane={recommondedLanes?.lane?.key === "alternative_fuel" && recommondedLanes?.lane}
                            baseLineDto={recommondedLanes?.baseLine}
                            showFuelStops={recommondedLanes?.lane?.key === "carrier_shift" ? false : showFuelStops}
                            isBaseLine={recommondedLanes?.lane?.isBaseLine}
                            isCarrierShift={recommondedLanes?.lane?.key === "carrier_shift"}
                            showFuelStopsEV={showFuelStopsEV}
                            showFuelStopsRD={showFuelStopsRD}
                            selectedFuelStop={showFuelStops ? defultFuelType : []}
                          />

                        }
                      </MapComponent>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}
        {(!isLoadingProjectDetails && !isLaneScenarioDetailLoading && !projectDetails?.data?.projectDetail) && <div className="co-txt d-flex gap-2 align-items-center justify-content-center ">
          <h4 className={`mb-0 titleMain`}>
            No Data Found
          </h4>
        </div>
        }
      </section>
    </>
  );
};

export default ProjectDetailView;