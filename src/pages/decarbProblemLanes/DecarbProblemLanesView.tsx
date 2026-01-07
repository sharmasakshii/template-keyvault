import ImageComponent from "../../component/images";
import DecarbProblemLaneController from "./decarbProblemLanesController";
import BackBtn from "../../component/forms/backLink/index";
import Heading from "component/heading";
import { Form } from "react-bootstrap";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Progress,
  Input,
  Button,
} from "reactstrap";
import {
  formatNumber,
  getPriority,
  getPriorityColor,
  isPermissionChecked,
  sortIcon,
  isCompanyEnable,
  formatUnit,
} from "utils";
import TitleComponent from "component/tittle";
import PerformanceHeading from "component/PerfomanceHeading";
import ButtonComponent from "../../component/forms/button";
import { companySlug, routeKey } from "constant";
import SearchODPair from "component/forms/searchODpair/SearchODPair";
import Spinner from "component/spinner";
import Pagination from "component/pagination";
import SelectDropdown from "component/forms/dropdown";
const priorityList = [
  { label: "All", value: null },
  { label: "Less than equal to 150", value: "1" },
  { label: "Greater than 150", value: "0" },
]
const AlternativeFuelSelection = (props: any) => {
  const {
    fuelTypeChecks,
    handleCheckboxChange,
    loginDetails,
    permissionsDto,
    isPEPCompany,
  } = props;

  return (
    <div className="grid">
      {[
        {
          heading: "Alternative Fuels",
          class: "full-width",
          buttonData: [
            {
              key: "is_bio_1_20",
              value: "Upto B20",
              product_type_id: "b1_20",
              image: "/images/b1Fuel.svg",
              companyEnable: true,
              selectionType: "AlternativeFuel",
            },
            {
              key: "is_bio_21_99",
              value: "B21 to B99",
              product_code: "b21_99",
              image: "/images/b20-b99.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.pep,
                companySlug?.demo,
                companySlug?.rb,
                companySlug?.bmb,
              ]),
              selectionType: "AlternativeFuel",
            },
            {
              key: "is_bio_100",
              value: "B100",
              product_code: "b100",
              image: "/images/b100Fuel.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.pep,
                companySlug?.demo,
                companySlug?.rb,
                companySlug?.bmb,
              ]),
              selectionType: "AlternativeFuel",
            },
            {
              key: "is_rd",
              value: "RD",
              product_code: "RD",
              image: "/images/rd-icon.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.pep,
                companySlug?.demo,
                companySlug?.rb,
                companySlug?.bmb,
              ]),
              selectionType: "AlternativeFuel",
            },
            {
              key: "is_rng",
              value: " RNG",
              product_code: "RNG",
              image: "/images/rng-icon-new.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.pep,
                companySlug?.demo,
                companySlug?.rb,
                companySlug?.bmb,
              ]),
              selectionType: "AlternativeFuel",
            },
            {
              key: "is_optimus",
              value: "Optimus",
              image: "/images/rng-icon.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.pep,
              ]),
              selectionType: "AlternativeFuel",
            },
            {
              key: "is_hvo",
              value: "HVO",
              product_code: "HVO",
              image: "/images/hvoFuel-icon.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.pep,
              ]),
              selectionType: "AlternativeFuel",
            },
            {
              key: "is_hydrogen",
              value: "Hydrogen",
              product_code: "HYDROGEN",
              image: "/images/hydrogen-icon.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.pep,
                companySlug?.demo,
              ]),
              selectionType: "AlternativeFuel",
            },
            {
              key: "is_b99",
              value: "B99",
              image: "/images/b99.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.demo,
              ]),
              selectionType: "AlternativeFuel",
            },
          ],
        },
        {
          heading: "Transportation Modes",
          class: "span",
          buttonData: [
            {
              key: "carrier",
              value: "Carrier Shift",
              image: "/images/carrier-icon.svg",
              companyEnable: true,
              selectionType: "CarrierShift",
            },
            {
              key: "intermodal",
              value: "Modal Shift",
              image: "/images/rail-icon.svg",
              companyEnable: true,
              selectionType: "ModalShift",
            },
          ],
        },
        {
          heading: "Electric",
          class: "span",
          buttonData: [
            {
              key: "is_ev",
              value: "EV",
              image: "/images/grid-icon.svg",
              companyEnable: isCompanyEnable(loginDetails?.data, [
                companySlug?.pep,
              ]),
              selectionType: "AlternativeFuel",
            },
          ],
        },
      ].map((filterType: any) => {
        const data = filterType.buttonData.filter(
          (el: any) =>
            isPermissionChecked(permissionsDto, routeKey?.[el?.selectionType])
              ?.isChecked && el.companyEnable
        );
        if (data.length > 0) {
          return (
            <div key={filterType.heading} className={filterType.class}>
              <div
                className={`h-100 ${filterType.heading} ${isPEPCompany ? "fuel-outer" : ""
                  }`}
              >
                <Heading
                  level="3"
                  className="font-16 fw-semibold mb-3"
                  content={filterType.heading}
                />
                <div className="d-flex flex-wrap gap-2 fuel-innner-div">
                  {data.map((option: any) => (
                    <div key={option.key}>
                      <Button
                        onClick={() => handleCheckboxChange(option.key)}
                        disabled={option.disabled}
                        className={`${fuelTypeChecks?.[option.key] === 1 ? "checked" : ""
                          } fuel-inner cursor gap-1`}
                      >
                        <Input
                          type="checkbox"
                          checked={fuelTypeChecks?.[option.key] === 1}
                          readOnly
                        />
                        {option.value}
                        <ImageComponent
                          tooltipTitle={option.value}
                          path={option.image}
                          className="pe-0 fuelIcon"
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

const GetFuelIcons = ({ lane }: any) => {
  return (
    <>
      {lane?.is_bio_1_20 === 1 && (
        <ImageComponent
          tooltipTitle="Upto B20"
          path="/images/b1Fuel.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_bio_21_99 === 1 && (
        <ImageComponent
          tooltipTitle="B21 to B99"
          path="/images/b20-b99.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_bio_100 === 1 && (
        <ImageComponent
          tooltipTitle="B100"
          path="/images/b100Fuel.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_ev === 1 && (
        <ImageComponent
          tooltipTitle="EV"
          path="/images/grid-icon.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_rd === 1 && (
        <ImageComponent
          tooltipTitle="RD"
          path="/images/rd-icon.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_rng === 1 && (
        <ImageComponent
          tooltipTitle="RNG"
          path="/images/rng-icon-new.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_hvo === 1 && (
        <ImageComponent
          tooltipTitle="HVO"
          path="/images/hvoFuel-icon.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_optimus === 1 && (
        <ImageComponent
          tooltipTitle="Optimus"
          path="/images/rng-icon.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_hydrogen === 1 && (
        <ImageComponent
          tooltipTitle="Hydrogen"
          path="/images/hydrogen-icon.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.is_b99 === 1 && (
        <ImageComponent
          tooltipTitle="B99"
          path="/images/b99.svg"
          className="pe-0 fuelIcon"
        />
      )}
      {lane?.carrier_shift && (
        <ImageComponent
          tooltipTitle="Carrier Shift"
          path="/images/carrier-icon.svg"
          className="pe-0 carrierIcon"
        />
      )}
      {lane?.modal_shift && (
        <ImageComponent
          tooltipTitle="Modal Shift"
          path="/images/rail-icon.svg"
          className="pe-0 railIcon"
        />
      )}
    </>
  );
};

const DecarbProblemLanesView = () => {
  // Importing all states and functions from Decarb Recommednded controller
  const {
    id,
    isPEPCompany,
    decarbProblemLanesData,
    decarbProblemLanesLoading,
    handleChangeOrder,
    col_name,
    order,
    handleLanePlanning,
    pageSize,
    gridType,
    setPageSize,
    currentPage,
    setCurrentPage,
    setGridType,
    fuelTypeModalOpen,
    modalChecks,
    handleCheckboxChangeModal,
    handleCheckboxChange,
    toggleFuelTypeModal,
    handleSubmitFuelModal,
    fuelTypeChecks,
    permissionsDto,
    childRef,
    handleChangeLocation,
    handleResetODpair,
    loginDetails,
    configConstants,
    checkNullValue,
    configConstantsIsLoading,
    getFuelCheck,
    showNoDataMessage,
    t,
    handleChangeBoundType,
    handleChangeisLessThan,
    companySlugBMB,
    companyLocationMapping,
    priority,
    isLessThan,
    boundType
  } = DecarbProblemLaneController();

  const defaultUnit = configConstants?.data?.default_distance_unit;
  const companyDetail = loginDetails?.data?.Company?.slug;
  const getBadgeClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "low priority":
        return "bg-success";
      case "medium priority":
        return "bg-secondary";
      case "highest priority":
        return "highestpriority";
      default:
        return "bg-secondary";
    }
  };
  return (
    <>
      <TitleComponent
        title={"Decarb Opportunity Lanes"}
        pageHeading={`${companyLocationMapping[companyDetail || "default"]
          } Opportunity Lanes`}
      />

      <section
        className="decarbRecomend-screen pb-4 pt-2 px-2"
        data-testid="decarb-problem-lanes"
      >
        <div className="decarb-heading mb-3">
          <div className="d-flex flex-wrap g-2 justify-content-between align-items-center mb-3">
            <div className="d-flex flex-wrap gap-3">
              <BackBtn
                link="scope3/decarb"
                btnText="Back All Recommendations"
              />
              <SearchODPair
                page="problemLanes"
                ref={childRef}
                handleChangeLocation={handleChangeLocation}
                handleGetSearchData={() => { }}
                handleResetODpair={handleResetODpair}
                odParams={{
                  ...(isCompanyEnable(loginDetails?.data, [
                    companySlug?.pep,
                    companySlug?.demo,
                  ])
                    ? { division_id: id }
                    : isCompanyEnable(loginDetails?.data, [
                      companySlug?.bmb,
                    ]) ? { state_abbr: id } : { region_id: id }),
                  carrier_shift: checkNullValue(fuelTypeChecks?.carrier),
                  modal_shift: checkNullValue(fuelTypeChecks?.intermodal),
                  is_rd: getFuelCheck(
                    [companySlug?.pep, companySlug?.demo],
                    fuelTypeChecks?.is_rd
                  ),
                  is_ev: getFuelCheck(
                    [companySlug?.pep, companySlug?.demo],
                    fuelTypeChecks?.is_ev
                  ),
                  is_bio_1_20: checkNullValue(fuelTypeChecks?.is_bio_1_20),
                  is_bio_21_99: checkNullValue(fuelTypeChecks?.is_bio_21_99),
                  is_bio_100: getFuelCheck(
                    [companySlug?.pep, companySlug?.demo],
                    fuelTypeChecks?.is_bio_100
                  ),
                  rd_radius: configConstants?.data?.rd_radius,
                  bio_1_20_radius: configConstants?.data?.bio_1_20_radius,
                  bio_21_99_radius: configConstants?.data?.bio_21_99_radius,
                  bio_100_radius: configConstants?.data?.bio_100_radius,
                  ev_radius: configConstants?.data?.ev_radius,
                  optimus: getFuelCheck(
                    [companySlug?.pep],
                    fuelTypeChecks?.is_optimus
                  ),
                  rng: getFuelCheck(
                    [companySlug?.pep, companySlug?.demo],
                    fuelTypeChecks?.is_rng
                  ),
                  is_hvo: getFuelCheck(
                    [companySlug?.pep],
                    fuelTypeChecks?.is_hvo
                  ),
                  hydrogen: getFuelCheck(
                    [companySlug?.pep, companySlug?.demo],
                    fuelTypeChecks?.is_hydrogen
                  ),
                  optimus_radius: configConstants?.data?.optimus_radius,
                  rng_radius: configConstants?.data?.rng_radius,
                  hvo_radius: configConstants?.data?.hvo_radius,
                  hydrogen_radius: configConstants?.data?.hydrogen_radius,
                  ...(isCompanyEnable(loginDetails?.data, [companySlug?.demo])
                    ? {
                      b99_radius: configConstants?.data?.b99_radius,
                      is_b99: checkNullValue(fuelTypeChecks?.is_b99),
                    }
                    : {}),
                  in_out_bound: boundType,
                  is_less_than_150:isLessThan
                }}
              />
            </div>

            <div className="d-md-flex d-none justify-content-end gap-2 align-items-center mt-sm-0 mt-3">
              <div
                className={`text-center ${gridType === "card" && "activeView"}`}
              >
                <ButtonComponent
                  data-testid="card-view"
                  imagePath="/images/cardview.svg"
                  text=""
                  btnClass="p-0 border-0 gridViewBtn"
                  onClick={() => {
                    setGridType("card");
                  }}
                />
              </div>
              <div
                className={`text-center ${gridType === "table" && "activeView"
                  }`}
              >
                <ButtonComponent
                  data-testid="table-view"
                  imagePath="/images/tabularview.svg"
                  text=""
                  btnClass="p-0 border-0 gridViewBtn"
                  onClick={() => {
                    setGridType("table");
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mb-0 border-bottom">
            <div>
              <Heading
                level="5"
                content="Key levers are recommended based on the potential
                    decarb impact, CO2e abatement cost, and ease of
                    implementation."
                className="mb-1 font-14"
              />
              <Heading
                level="5"
                content="You can customize any lever by lane and add to an
                    existing project or create a new project."
                className="mb-3 font-14"
              />
            </div>
            {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) &&
              <div className=" d-flex justify-content-end">
                <Heading level="5" className=" font-14">
                  <span className="fw-normal"> State Name:</span>{" "}
                  {`${companyLocationMapping[companyDetail || "default"]}`}
                </Heading>
                <span className="mx-2">|</span>
                <Heading level="5" className=" font-14">
                  {" "}
                  <span className="fw-normal">State Priority:</span>{" "}
                  <span
                    className={`badge text-white text-uppercase ${getBadgeClass(
                      priority
                    )}`}
                  >
                    {priority}
                  </span>
                </Heading>
              </div>}
          </div>
        </div>
        <div className="decarb-heading">
          <div className="decarb-filtercheckbox mainGrayCards gap-2 align-items-center mb-2 p-3">
            {configConstantsIsLoading ? (
              <Spinner
                data-testid="decarb-loading-div"
                spinnerClass="py-5 my-4 justify-content-center"
              />
            ) : (
              <div className="mb-0">
                <div className="decarb-view-state">
                  <AlternativeFuelSelection
                    fuelTypeChecks={fuelTypeChecks}
                    loginDetails={loginDetails}
                    handleCheckboxChange={handleCheckboxChange}
                    permissionsDto={permissionsDto}
                    isPEPCompany={isPEPCompany}
                  />
                  {companySlugBMB === companySlug?.bmb && (
                    <div className="">
                      <div className="">
                        <div className="select-box  align-items-center mb-3">
                          <Heading
                            level="6"
                            content="Lane Distance (Miles):"
                            className="mb-1 text-capitalize font-14"
                          />
                          <SelectDropdown
                            selectedValue={
                              priorityList?.find(
                                (item: any) => item.value === isLessThan
                              )
                            }
                            onChange={(e: any) => handleChangeisLessThan(e)}
                            options={priorityList}
                            customClass="w-100 miles-selected "
                            disabled={decarbProblemLanesLoading}
                          />

                        </div>

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
                              onChange={(e) => handleChangeBoundType(e)}
                              checked={boundType !== "0"}
                              disabled={decarbProblemLanesLoading}
                            />
                          </Form>

                          <Heading
                            level="6"
                            content="Outbound"
                            className="mb-0 ps-1 fw-semibold text-capitalize font-xxl-14 font-12"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Modal
                  isOpen={fuelTypeModalOpen}
                  toggle={toggleFuelTypeModal}
                  className="actionModal"
                >
                  <ModalHeader
                    className="border-0 pb-2 pt-4"
                    toggle={toggleFuelTypeModal}
                  ></ModalHeader>
                  <ModalBody className="pt-0 px-4 pb-4">
                    <Heading
                      level="5"
                      content="You must choose at least one recommendation type before proceeding."
                      className="mb-3 font-18"
                    />
                    <div className=" mb-3 pb-2">
                      <div className="d-flex flex-wrap gap-2 align-items-center formsection pb-2">
                        <AlternativeFuelSelection
                          fuelTypeChecks={modalChecks}
                          loginDetails={loginDetails}
                          handleCheckboxChange={handleCheckboxChangeModal}
                          permissionsDto={permissionsDto}
                          columnSize={12}
                          isPEPCompany={isPEPCompany}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center gap-3">
                      <ButtonComponent
                        text="Cancel"
                        btnClass="gray-btn py-2 px-3 "
                        onClick={toggleFuelTypeModal}
                      />
                      <ButtonComponent
                        text="Submit"
                        disabled={!Object.values(modalChecks).includes(1)}
                        onClick={handleSubmitFuelModal}
                        btnClass="btn-deepgreen font-14 py-2 px-3 "
                      />
                    </div>
                  </ModalBody>
                </Modal>
              </div>
            )}
          </div>
        </div>

        <div className="decarbRecomend-section py-3 px-3 pt-4 border-0 text-start w-100">
          <div className="d-md-none d-flex justify-content-end gap-2 align-items-center mt-sm-0 mt-0 mb-3">
            <div
              className={`text-center ${gridType === "card" && "activeView"}`}
            >
              <ButtonComponent
                data-testid="card-view1"
                imagePath="/images/cardview.svg"
                text=""
                btnClass="p-0 border-0 gridViewBtn btn-transparent"
                onClick={() => {
                  setGridType("card");
                }}
              />
            </div>
            <div
              className={`text-center ${gridType === "table" && "activeView"}`}
            >
              <ButtonComponent
                data-testid="table-view1"
                imagePath="/images/tabularview.svg"
                text=""
                btnClass="p-0 border-0 gridViewBtn btn-transparent"
                onClick={() => {
                  setGridType("table");
                }}
              />
            </div>
          </div>
          {decarbProblemLanesLoading && (
            <Spinner
              data-testid="decarb-loading-div"
              spinnerClass="py-5 my-4 justify-content-center"
            />
          )}
          {!decarbProblemLanesLoading &&
            decarbProblemLanesData?.data?.getDecarbSummary?.length === 0 && (
              <div data-testid="no-data-found" className="py-4 text-center">
                <Heading
                  level="4"
                  content={`There were no opportunity lanes found.`}
                  className="font-14 fw-normal"
                />
              </div>
            )}

          {showNoDataMessage && !decarbProblemLanesLoading && (
            <Heading
              level="4"
              content={`There were no opportunity lanes found.`}
              className="font-16 fw-normal text-center mt-4"
            />
          )}
          {/* problem lanes table */}
          {!decarbProblemLanesLoading &&
            decarbProblemLanesData?.data?.getDecarbSummary?.length > 0 &&
            (gridType === "card" ? (
              <div>
                <Row className="gx-3">
                  {decarbProblemLanesData?.data?.getDecarbSummary?.map(
                    (lane: any, index: number) => (
                      <Col lg="4" md="6" className="mb-4" key={lane?.name}>
                        <div className="inner-data-region h-100">
                          <div className="priority-btn-wrap">
                            <div className="priority-btn">
                              <label
                                className={`px-4 py-1 priority ${getPriorityColor(
                                  getPriority(lane?.priority)
                                )}`}
                              >
                                {getPriority(lane?.priority)}
                              </label>
                            </div>

                            <div className="id-data p-3">
                              <div className="pb-3 pt-3">
                                <Heading
                                  level="5"
                                  content={lane?.name.split("_").join(" to ")}
                                  className="mb-0 font-16 fw-semibold mb-2 laneName"
                                />

                                <div className="d-flex flex-wrap gap-1 mb-2">
                                  <Heading
                                    level="5"
                                    content="Emissions Intensity"
                                    className="mb-0 font-14 mb-0"
                                  />
                                  <Heading
                                    level="4"
                                    content={`${formatNumber(
                                      true,
                                      lane?.intensity,
                                      1
                                    )}`}
                                    spanText={`gCO2e/Ton-${defaultUnit === "miles" ? "Mile" : "Kms"
                                      } of freight`}
                                    className="fw-bold font-14 mb-0"
                                  />
                                </div>

                                <Progress
                                  className={`${getPriorityColor(
                                    getPriority(lane?.priority)
                                  )}`}
                                  value={
                                    Number.parseInt(
                                      lane?.intensity.toString()
                                    ) || 0
                                  }
                                />
                              </div>
                            </div>
                            <div className="quartely-wrapper p-3 pb-1">
                              <div className="d-flex justify-content-between flex-wrap gap-2 align-items-center mb-3">
                                <div className="quartely">
                                  <Heading
                                    level="4"
                                    className="font-14 font-xxl-16 fw-normal"
                                  >
                                    Total Emissions
                                    <br />
                                    <span className="font-10 font-xxl-12 fw-normal">
                                      tCO2e
                                    </span>
                                  </Heading>
                                  <div>
                                    <Heading
                                      level="4"
                                      content={formatNumber(
                                        true,
                                        lane?.emission,
                                        2
                                      )}
                                      className="font-18 font-xxl-20 fw-semibold"
                                    />
                                  </div>
                                </div>

                                <div className="quartely-icon d-flex align-items-end gap-1">
                                  <GetFuelIcons lane={lane} />
                                </div>
                                <ButtonComponent
                                  data-testid={`click-lane-${index}`}
                                  onClick={() => handleLanePlanning(lane?.name)}
                                  text="View Recommendations"
                                  btnClass="btn-deepgreen py-1 px-3 d-flex align-items-center font-14 text-decoration-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )
                  )}
                </Row>
                <div className="mt-0 lane-pagination d-flex justify-content-end">
                  <nav
                    aria-label="Page navigation example"
                    className=" d-flex justify-content-end select-box mt-3"
                  >
                    <Pagination
                      currentPage={currentPage}
                      pageSize={pageSize}
                      cardType={true}
                      total={
                        decarbProblemLanesData?.data?.pagination?.total_count
                      }
                      handlePageSizeChange={(e: any) => {
                        setPageSize(e);
                        setCurrentPage(1);
                      }}
                      handlePageChange={(page: number) => {
                        setCurrentPage(page);
                      }}
                    />
                  </nav>
                </div>
              </div>
            ) : (
              <div>
                <div className="static-table mb-4">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th
                          className="pointer"
                          data-testid="name-sort"
                          onClick={() => handleChangeOrder("name")}
                        >
                          <div className="d-flex text-capitalize pointer">
                            Name{" "}
                            <span>
                              <ImageComponent
                                imageName={`${sortIcon(
                                  "name",
                                  col_name,
                                  order
                                )}`}
                                className="pe-0"
                              />
                            </span>
                          </div>
                        </th>
                        <th
                          className="pointer"
                          data-testid="intensity-sort"
                          onClick={() => handleChangeOrder("intensity")}
                        >
                          <div className=" pointer">
                            Emissions intensity{" "}
                            <span>
                              <ImageComponent
                                imageName={`${sortIcon(
                                  "intensity",
                                  col_name,
                                  order
                                )}`}
                                className="pe-0"
                              />
                            </span>
                            <h6 className="font-10">
                              {`(${t("gco2eUnit", {
                                unit: formatUnit(defaultUnit),
                              })})`}
                              <br /> of freight
                            </h6>
                          </div>
                        </th>
                        <th
                          className="pointer"
                          data-testid="emission-sort"
                          onClick={() => handleChangeOrder("emission")}
                        >
                          <div className=" pointer">
                            Total Emissions{" "}
                            <span>
                              <ImageComponent
                                imageName={`${sortIcon(
                                  "emission",
                                  col_name,
                                  order
                                )}`}
                                className="pe-0"
                              />
                            </span>
                            <h6 className="font-10">tCO2e</h6>
                          </div>
                        </th>
                        <th></th>
                        <th className="pointer w-auto"></th>
                      </tr>
                    </thead>
                    <tbody className=" text-start ">
                      {!decarbProblemLanesLoading &&
                        decarbProblemLanesData?.data?.getDecarbSummary?.length >
                        0 &&
                        decarbProblemLanesData?.data?.getDecarbSummary?.map(
                          (lane: any, index: number) => (
                            <tr key={lane?.name}>
                              <td>
                                <div className="d-flex gap-2 align-items-center">
                                  <Heading
                                    level="5"
                                    content={getPriority(lane?.priority)}
                                    className={`mb-0 fw-semibold font-8 font-xxl-10 priority ${getPriorityColor(
                                      getPriority(lane?.priority)
                                    )}`}
                                  />

                                  <Heading
                                    level="5"
                                    content={lane?.name.split("_").join(" to ")}
                                    className="mb-0 fw-semibold font-14 text-decoration-underline"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Heading
                                    level="4"
                                    content={formatNumber(
                                      true,
                                      lane?.intensity,
                                      1
                                    )}
                                    className="font-14 font-xxl-16 text-center fw-normal mb-0"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Heading
                                    level="4"
                                    content={formatNumber(
                                      true,
                                      lane?.emission,
                                      2
                                    )}
                                    className="font-14 font-xxl-16 text-center fw-normal mb-0"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-2 align-items-end recomended-Icons">
                                  <GetFuelIcons lane={lane} />
                                </div>
                              </td>
                              <td
                                data-testid={`click-lane-${index}`}
                                className="w-auto"
                                onClick={() => handleLanePlanning(lane?.name)}
                              >
                                <div className="text-end">
                                  <Heading
                                    level="4"
                                    content="View Recommendations"
                                    className="font-10 font-xxl-14 text-center fw-normal mb-0"
                                  />
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                  <div className="mt-0 lane-pagination d-flex justify-content-end">
                    <nav
                      aria-label="Page navigation example"
                      className=" d-flex justify-content-end select-box mt-3"
                    >
                      <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        total={
                          decarbProblemLanesData?.data?.pagination?.total_count
                        }
                        handlePageSizeChange={(e: any) => {
                          setPageSize(e);
                          setCurrentPage(1);
                        }}
                        handlePageChange={(page: number) => {
                          setCurrentPage(page);
                        }}
                      />
                    </nav>
                  </div>
                </div>
              </div>
            ))}

          <PerformanceHeading className="mt-3" />
        </div>
      </section>
    </>
  );
};
export default DecarbProblemLanesView;
