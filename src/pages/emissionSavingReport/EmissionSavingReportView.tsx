import TitleComponent from "component/tittle";
import SelectDropdown from "../../component/forms/dropdown";
import Heading from "component/heading";
import MultiSelect from "component/forms/multiSelect/MultiSelect";
import Logo from "component/logo";
import ImageComponent from "component/images";
import { Button, Col, Row } from "reactstrap";
import ButtonComponent from "component/forms/button";
import EmissionSavingReport from "./emissionSavingReportController";
import SustainViewCard from "component/cards/sustainabilityTracker";
import "../../scss/alternativeFuel/_index.scss";
import ChartHighChart from "component/highChart/ChartHighChart";
import { doubleColumnChart } from "utils/highchart/doubleColumnChart";
import TableHead from "component/tableHeadHandle";
import TableBodyLoad from "component/tableBodyHandle";
import Pagination from "component/pagination";
import MapComponent from "component/map/MapComponent";
import { useTranslation } from "react-i18next";
import {
  executeScroll,
  formatNumber,
  getCurrentMonths,
  getDropDownOptions,
  normalizedList,
} from "utils";
import GoogleMapLaneView from "component/map/GoogleMapLaneView";
import CountryFilter from "component/countryFilter";

const EmissionSavingReportView = () => {
  const {
    handleCarrierChange,
    handleSelectCarrier,
    setSelectedCarrier,
    showAll,
    setShowAll,
    visibleCarriers,
    hiddenCount,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    setShowFullScreen,
    showFullScreen,
    country,
    setCountry,
    year,
    setYear,
    month,
    setMonth,
    emissionSavedScacs,
    isLoadingScacList,
    emissionSavedMatricsData,
    isLoadingEmissionMatricsData,
    isLoadingEmissionSavedShipmentGraph,
    emissionSavedShipmentGraphData,
    carrierList,
    selectedCarrier,
    emissionSavedEmissionGraphData,
    isLoadingEmissionSavedEmissionGraph,
    emissionSavedTransactionTableData,
    isLoadingEmissionSavedTransactionTable,
    handleClickColumn,
    order,
    colName,
    selectedLane,
    setSelectedLane,
    mapRef,
    emissionSavedFuelType,
    isLoadingEmissionSavedFuelType,
    transactionFilter,
    setTransactionFilter,
    setIsFilterApplied,
    handleResetTable,
    selectedRowKey,
    setSelectedRowKey,
    carrierFilter,
    setCarrierFilter,
    configConstants,
  } = EmissionSavingReport();
  const { t } = useTranslation();

  const heading = `of ${country?.label ?? ""} country for ${
    month?.label ?? ""
  } ${year?.label ?? ""}`;
  const selectCarrierList = carrierList?.filter((item: any) =>
    selectedCarrier?.includes(item?.value)
  );
  let monthOption = getCurrentMonths(year);

  return (
    <>
      <TitleComponent
        title={"Emissions Saving Report"}
        pageHeading="Emissions Saving Report"
      />
      <section
        data-testid="emissionSavingReport-view"
        className="alternativeFuel-screen pb-3 pt-2  px-2"
      >
        <div className="mb-3 d-sm-flex flex-wrap gap-2 select-box pb-3 border-bottom">
          <CountryFilter
            country={country}
            year={{ value: year, label: year }}
            month={{
              value: month,
              label:
                monthOption?.find((el: any) => el.value === month)?.label ??
                "All Months",
            }}
            handleUpdateCountry={(e) => {
              setCountry(e);
              setYear(
                Number.parseInt(
                  configConstants?.data?.alternative_fuel_default_year
                )
              );
              setMonth(
                Number.parseInt(
                  configConstants?.data?.alternative_fuel_default_month
                )
              );

              setSelectedCarrier([]);
              handleResetTable([]);
            }}
            handleUpdateMonth={(e) => {
              setMonth(e?.value);
              handleResetTable(selectedCarrier);
            }}
            handleUpdateyear={(e) => {
              setYear(e?.value);
              setMonth(0);
              handleResetTable(selectedCarrier);
            }}
          />
        </div>
        <div className="mb-3 p-3 select-box select-carrier">
          <Heading
            level="3"
            content="Selected Carriers"
            className="font-xxl-18 font-16 fw-medium mb-3"
          />
          <div className="mb-3 d-flex">
            <MultiSelect
              key="example_id"
              placeHolder="Select carrier"
              isSearchable={true}
              className="selectFuel-dropdown"
              aria-label="multi-carrier-dropdown"
              menuPlacement={"bottom"}
              isClearable={false}
              disableClear={true}
              disabled={isLoadingScacList}
              clearMessage="Selected carrier"
              options={carrierList}
              onChange={handleSelectCarrier}
              selectedOptions={selectCarrierList}
            />
          </div>

          {emissionSavedScacs?.data?.length === 0 ? (
            <div className="text-center my-3">No carrier found</div>
          ) : (
            <div className="d-flex flex-wrap align-items-center gap-2 carrier-items">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {visibleCarriers?.map((carrier: any) => (
                  <div
                    key={carrier?.carrier_scac}
                    className="d-flex align-items-center gap-2"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={carrier?.scac_name}
                  >
                    <Button
                      data-testid={`carrier-${carrier?.carrier_scac}`}
                      className="btn-transparent ev-master"
                      onClick={() => handleCarrierChange(carrier?.carrier_scac)}
                    >
                      <Logo
                        path={carrier?.scac_image}
                        name={carrier?.carrier_scac}
                      />
                      <ImageComponent
                        path="/images/cross.svg"
                        className="pe-0"
                      />
                    </Button>
                  </div>
                ))}
              </div>

              {!showAll && hiddenCount > 0 && (
                <ButtonComponent
                  data-testid="show-more"
                  btnClass="moreContent font-16 fw-medium"
                  onClick={() => setShowAll(true)}
                >
                  +{hiddenCount}
                </ButtonComponent>
              )}

              {showAll && hiddenCount > 0 && (
                <div className="w-100 text-end mt-2">
                  <ButtonComponent
                    data-testid="view-less"
                    btnClass="btn-transparent p-0 font-xxl-16 font-14 fw-medium"
                    onClick={() => setShowAll(false)}
                  >
                    View Less
                  </ButtonComponent>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="reagion-card emissionCards px-2 matrix-card">
          <Row className="g-3">
            <Col md="6">
              <SustainViewCard
                isLoading={isLoadingEmissionMatricsData}
                imagePath={"/images/evEmission.svg"}
                cardDate="EV"
                cardSubHeading=""
                className={"cards"}
              >
                <div className="d-flex gap-2 pt-2 align-items-start flex-column co-txt justify-content-start border-top w-100">
                  <h6 className="mb-0 titleMain">
                    <span className="matrix-value">Total Emissions:&nbsp;</span>
                    {formatNumber(
                      true,
                      emissionSavedMatricsData?.data?.evEmission?.[0]?.emission,
                      2
                    )}
                    &nbsp;<span className="fw-normal font-12">(tCO2e)</span>
                  </h6>
                  <h6 className="mb-0 titleMain">
                    <span className="matrix-value">Total Shipments:&nbsp;</span>
                    {formatNumber(
                      true,
                      emissionSavedMatricsData?.data?.evEmission?.[0]
                        ?.shipments,
                      0
                    )}
                    &nbsp;<span className="fw-normal font-12">(Count)</span>
                  </h6>
                  <div className="low-reduction d-flex gap-1">
                    <ImageComponent
                      path="/images/down-reduction.svg"
                      className="pe-0"
                    />
                    <Heading
                      level="2"
                      className="text-deepgreen font-xxl-16 font-14 fw-medium mb-0"
                    >
                      {formatNumber(
                        true,
                        emissionSavedMatricsData?.data?.evEmission?.[0]
                          ?.reduction,
                        2
                      )}
                      % reduction{" "}
                      <span className="font-xxl-16 font-14 fw-normal">
                        {" "}
                        vs. diesel
                      </span>
                    </Heading>
                  </div>
                </div>
              </SustainViewCard>
            </Col>
            <Col md="6">
              <SustainViewCard
                isLoading={isLoadingEmissionMatricsData}
                imagePath={"/images/alternativeEmission.svg"}
                cardDate="Alternative"
                className="cards"
                cardSubHeading=""
              >
                <div className="d-flex gap-2 pt-2 align-items-start flex-column co-txt justify-content-start border-top w-100">
                  <h6 className="mb-0 titleMain">
                    <span className="matrix-value">Total Emissions:&nbsp;</span>
                    {formatNumber(
                      true,
                      emissionSavedMatricsData?.data?.alternateEmission?.[0]
                        ?.emission,
                      2
                    )}
                    &nbsp;<span className="fw-normal font-12">(tCO2e)</span>
                  </h6>
                  <h6 className="mb-0 titleMain">
                    <span className="matrix-value">Total Shipments:&nbsp;</span>
                    {formatNumber(
                      true,
                      emissionSavedMatricsData?.data?.alternateEmission?.[0]
                        ?.shipments,
                      0
                    )}
                    &nbsp;<span className="fw-normal font-12">(Count)</span>
                  </h6>
                  <div className="low-reduction d-flex gap-2">
                    <ImageComponent
                      path="/images/down-reduction.svg"
                      className="pe-0"
                    />
                    <Heading
                      level="2"
                      className="text-deepgreen font-xxl-16 font-14 fw-medium mb-0"
                    >
                      {formatNumber(
                        true,
                        emissionSavedMatricsData?.data?.alternateEmission?.[0]
                          ?.reduction,
                        2
                      )}
                      % reduction{" "}
                      <span className="font-xxl-16 font-14 fw-normal">
                        {" "}
                        vs. diesel
                      </span>
                    </Heading>
                  </div>
                </div>
              </SustainViewCard>
            </Col>
            <Col md="12">
              <div className="mainGrayCards pb-3 h-100">
                <div className="headingLine p-3 border-bottom">
                  <Heading level="5" className="font-14 fw-medium mb-2">
                    Total shipment counts by carriers, {heading}
                  </Heading>
                  <Heading
                    level="5"
                    className="font-18 font-xxl-20 fw-semibold mb-0"
                  >
                    Total Shipment Counts by Carriers
                  </Heading>
                </div>
                <div className="p-3 pb-0">
                  <ChartHighChart
                    database={
                      emissionSavedShipmentGraphData?.data?.option?.length > 0
                    }
                    classname=""
                    options={doubleColumnChart({
                      xTitle: "",
                      yTitle: `Total Shipment Counts`,
                      decimalPoint: 0,
                      options: normalizedList(
                        emissionSavedShipmentGraphData?.data?.option
                      ),
                      pointWidth: 14,
                      categories:
                        emissionSavedShipmentGraphData?.data?.categories,
                      enableDownload: false,
                      dataLabels: false,
                      radius: 5,
                    })}
                    constructorType=""
                    isLoading={isLoadingEmissionSavedShipmentGraph}
                  />
                </div>
              </div>
            </Col>
            <Col md="12">
              <div className="mainGrayCards pb-3 h-100">
                <div className="headingLine p-3 border-bottom">
                  <Heading level="5" className="font-14 fw-medium mb-2">
                    Total emissions saved comparison vs diesel by carriers,{" "}
                    {heading}
                  </Heading>
                  <Heading
                    level="5"
                    className="font-18 font-xxl-20 fw-semibold mb-0"
                  >
                    Emissions Saved Comparison vs. Diesel
                  </Heading>
                </div>
                <div className="p-3 pb-0">
                  <ChartHighChart
                    database={
                      emissionSavedEmissionGraphData?.data?.option?.length > 0
                    }
                    classname=""
                    options={doubleColumnChart({
                      xTitle: ``,
                      yTitle: `Emissions Saved (tCO2e)`,
                      decimalPoint: 2,
                      options: normalizedList(
                        emissionSavedEmissionGraphData?.data?.option
                      ),
                      pointWidth: 14,
                      categories:
                        emissionSavedEmissionGraphData?.data?.categories,
                      enableDownload: false,
                      dataLabels: true,
                      radius: 5,
                    })}
                    constructorType=""
                    isLoading={isLoadingEmissionSavedEmissionGraph}
                  />
                </div>
              </div>
            </Col>

            <Col md="12">
              <div className="mainGrayCards h-100">
                <div className="border-bottom p-3 mb-3 d-xxl-flex flex-wrap align-items-center justify-content-between gap-2">
                  <div>
                    <Heading
                      level="6"
                      className="fw-medium font-14 mb-1"
                      content={`Carriers Breakdown by Lane, ${heading}`}
                    />
                    <Heading
                      level="6"
                      className="fw-semibold font-xxl-20 font-16 mb-0"
                    >
                      Detailed Breakdown by Lane
                    </Heading>
                  </div>
                  <div>
                    <div className="d-flex flex-wrap gap-1  select-box justify-content-end">
                      <SelectDropdown
                        aria-label="carrier-dropdown"
                        placeholder="Search Carrier"
                        customClass="ms-0 mt-2 mt-lg-0 searchdropdown vehicleDropdown text-capitalize"
                        isSearchable
                        options={selectCarrierList}
                        selectedValue={carrierFilter}
                        onChange={(e: any) => {
                          setTransactionFilter((prev: any) => ({
                            ...prev,
                            carrier_scac: [e.value],
                            isSelected: true,
                          }));
                          setCarrierFilter(e);
                        }}
                      />
                      <SelectDropdown
                        aria-label="fuel-type-dropdown"
                        placeholder="Fuel Types"
                        isSearchable
                        options={getDropDownOptions(
                          emissionSavedFuelType?.data,
                          "fuel",
                          "fuel",
                          "",
                          "",
                          false
                        )}
                        selectedValue={getDropDownOptions(
                          emissionSavedFuelType?.data,
                          "fuel",
                          "fuel",
                          "",
                          "",
                          false
                        )?.filter(
                          (el: any) => el.value === transactionFilter?.fuel_type
                        )}
                        disabled={isLoadingEmissionSavedFuelType}
                        onChange={(e: any) =>
                          setTransactionFilter((prev: any) => ({
                            ...prev,
                            fuel_type: e.value,
                            isSelected: true,
                          }))
                        }
                      />
                      <div className="d-flex gap-1 btn-wrapper">
                        <ButtonComponent
                          text={t("apply")}
                          data-testid="apply-filter-btn"
                          btnClass="btn-deepgreen font-14 px-4 py-1"
                          disabled={isLoadingEmissionSavedTransactionTable}
                          onClick={() => {
                            setIsFilterApplied({ ...transactionFilter });
                            setPageNumber(1);
                          }}
                        />
                        <ButtonComponent
                          text={t("reset")}
                          data-testid="reset-filter-btn"
                          btnClass="btn-reset font-14 px-4 py-1"
                          disabled={
                            isLoadingEmissionSavedTransactionTable ||
                            !transactionFilter?.isSelected
                          }
                          onClick={() => handleResetTable(selectedCarrier)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="static-table">
                  <table>
                    <TableHead
                      handleClickColumn={handleClickColumn}
                      col_name={colName}
                      order={order}
                      columns={[
                        {
                          key: "carrier_name",
                          label: "Carrier Name",
                          isSorting: false,
                        },
                        { key: "origin", label: "Origin", isSorting: false },
                        {
                          key: "destination",
                          label: "Destination",
                          isSorting: false,
                        },
                        {
                          key: "fuel_type",
                          label: "Fuel Type",
                          isSorting: false,
                        },
                        {
                          key: "shipment_type",
                          label: "Shipment Type",
                          isSorting: false,
                        },
                        {
                          key: "fuel_consumption",
                          label: "Fuel Consumption",
                          unit: "(Gallons)",
                          isSorting: false,
                        },
                        {
                          key: "shipments",
                          label: "Total Shipments",
                          isSorting: true,
                        },
                        {
                          key: "emission_saved",
                          label: "Emissions Saved",
                          unit: "(tCO2e)",
                          isSorting: true,
                        },
                        { key: "viewMore", label: "", isSorting: false },
                      ]}
                    />
                    <TableBodyLoad
                      colSpan={9}
                      noDataMsg={`${t("noRecord")}`}
                      isLoading={isLoadingEmissionSavedTransactionTable}
                      isData={
                        normalizedList(
                          emissionSavedTransactionTableData?.data?.rows
                        ).length > 0
                      }
                    >
                      <tbody>
                        {normalizedList(
                          emissionSavedTransactionTableData?.data?.rows
                        )?.map((data: any, index: number) => {
                          const rowKey = `row-${index}`;
                          return (
                            <tr
                              key={rowKey}
                              className={
                                selectedRowKey === rowKey ? "activeRow" : ""
                              }
                              onClick={() => {
                                setSelectedLane(data);
                                executeScroll(mapRef);
                                setSelectedRowKey(rowKey);
                              }}
                            >
                              <td>{data?.carrier_name}</td>
                              <td>{data?.origin}</td>
                              <td>{data?.destination}</td>
                              <td>{data?.fuel_type}</td>
                              <td>{data?.shipment_type}</td>
                              <td className="w-auto">
                                {data.fuel_consumption
                                  ? formatNumber(true, data.fuel_consumption, 2)
                                  : "N/A"}
                              </td>
                              <td className="w-auto">
                                {formatNumber(true, data.shipments, 0)}
                              </td>
                              <td className="w-auto">
                                {formatNumber(true, data.emission_saved, 2)}
                              </td>
                              <td className="map-btn">
                                <div className="d-flex align-items-center gap-2 cursor">
                                  <ButtonComponent
                                    data-testid={`view-map-btn-${index}`}
                                    imagePath="/images/mapView.svg"
                                    text="View"
                                    onClick={() => {
                                      setSelectedLane(data);
                                      executeScroll(mapRef);
                                      setSelectedRowKey(rowKey);
                                    }}
                                    btnClass="d-flex align-items-center border-0 viewmap-btn btn-transparent gap-2"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </TableBodyLoad>
                  </table>
                </div>
                <div className="text-end w-100 pb-3">
                  <Pagination
                    currentPage={pageNumber}
                    pageSize={pageSize}
                    total={
                      emissionSavedTransactionTableData?.data.pagination
                        ?.total_count
                    }
                    handlePageSizeChange={(e: any) => {
                      setPageSize(e);
                      setPageNumber(1);
                    }}
                    handlePageChange={(page: number) => {
                      setPageNumber(page);
                    }}
                  />
                </div>
              </div>
            </Col>
            <Col md="12">
              {selectedLane &&
                emissionSavedTransactionTableData?.data?.rows?.length > 0 && (
                  <div
                    ref={mapRef}
                    className={`mb-3 alternativeMap ${
                      isLoadingEmissionSavedTransactionTable ? "loading" : ""
                    }`}
                  >
                    <MapComponent
                      isLoading={isLoadingEmissionSavedTransactionTable}
                      showFullScreen={showFullScreen}
                      setShowFullScreen={setShowFullScreen}
                      isFullScreen={true}
                      modalClass="bioFuel-map alternative-map"
                    >
                      <GoogleMapLaneView
                        reloadData={false}
                        origin={selectedLane?.origin}
                        destination={selectedLane?.destination}
                        laneInfo={selectedLane}
                        isLoading={isLoadingEmissionSavedTransactionTable}
                        isShowEmissionSaveReport={true}
                      />
                    </MapComponent>
                  </div>
                )}
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default EmissionSavingReportView;
