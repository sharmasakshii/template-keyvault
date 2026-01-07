import Heading from 'component/heading'
import ImageComponent from "component/images";
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import ButtonComponent from 'component/forms/button';
import TableBodyLoad from 'component/tableBodyHandle';
import DateShow from 'component/DateShow';
import EvDashboardController from './evDashboardController';
import DatePicker from 'component/forms/datePicker';
import ChartHighChart from 'component/highChart/ChartHighChart';
import multiBarChart from 'utils/highchart/multiBarChart';
import { dateFormatValue, distanceConverterInterModal, formatUnit, executeScroll, formatNumber, formatPerUnit, getPercentage, sortIcon } from 'utils';
import Pagination from 'component/pagination';
import EvDashMapView from 'component/map/EvDashboardMap';
import MapComponent from 'component/map/MapComponent';
import TitleComponent from 'component/tittle';
import BackBtn from "../../../component/forms/backLink/index";
import Spinner from 'component/spinner';
import SustainViewCard from 'component/cards/sustainabilityTracker';
import styles from '../../../scss/config/_variable.module.scss'

const EvDashboardView = () => {

  const {
    evFilterData,
    startDate, setStartDate,
    endDate, setEndDate,
    carrierCode, setCarrierCode,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    isLoadingShipmentLane,
    shipmentLaneData,
    isLoadingShipmentByDate,
    shipmentByDateData,
    isLoadingEvMatrics,
    evMatricsData,
    isLoadingEvFilterDate,
    isLoadingEvShipmentLaneList,
    evShipmentLaneListData,
    order,
    colName,
    selectedLane,
    setSelectedLane,
    mapRef,
    handleChangeOrder,
    showFullScreen, setShowFullScreen,
    listOfCarriers, isLoadingListOfCarriers,
    visibleCarriers,
    hiddenCount, showAll, setShowAll, configConstants
  } = EvDashboardController()

  const getCarrierImage = () => {
    return <>{listOfCarriers?.data?.find((el: any) => el.scac === carrierCode)?.image && <ImageComponent className="carrier-ev-img" path={listOfCarriers?.data?.find((el: any) => el.scac === carrierCode)?.image || ""} />}</>
  }
  const dateValue = dateFormatValue(startDate, endDate)

  return (
    <section className='evDashboard-main-screen-wrap mb-3'>
      <TitleComponent title={"Ev Dashboard"} pageHeading={"EV Dashboard"} />
      <div className='p-3 border-bottom mb-3 pt-0' data-testid="EvDashboardView">
        <div className=' d-flex gap-2 align-items-center justify-content-between'>
          <BackBtn link="scope3/master-dashboard" btnText="Back" />
          {isLoadingEvFilterDate ? <Spinner /> : <p className='font-14 mb-0'><DateShow dateInfo={evFilterData?.data} isActive={true} dateFormate={"DD MMM YYYY"} /></p>}
        </div>
      </div>
      <div className='p-3 pt-0 d-flex justify-content-between align-items-center'>
        <FormGroup className="select-box form-group d-md-flex align-items-center gap-2">
          <Label htmlFor="exampleDate1" className="font-12 mb-0 fw-medium">
            Start Date
          </Label>
          <DatePicker
            aria-label="start-date-dropdown"
            selectDate={startDate}
            minDate={evFilterData?.data?.start_date}
            maxDate={endDate}
            setSelectDate={setStartDate}
            onChange={() => setCurrentPage(1)}
            dataTestId="start-date"

          />
          <Label htmlFor="exampleDate" className="font-12 mb-0 fw-medium">
            End Date
          </Label>
          <DatePicker
            selectDate={endDate}
            minDate={startDate}
            maxDate={evFilterData?.data?.end_date}
            setSelectDate={setEndDate}
            onChange={() => setCurrentPage(1)}
          />
        </FormGroup>
      </div>
      <div className='filter-wrapper'>
        <div className='p-3'>
          <Heading level="3" content="Selected Carriers" className="font-xxl-18 font-16 fw-medium mb-3" />
          <div className='d-flex flex-wrap gap-2 align-items-center'>
            {isLoadingListOfCarriers ? (
              <Spinner spinnerClass='justify-content-center w-100' />
            ) : (
              <div className='d-flex flex-wrap gap-2 align-items-center'>
                {visibleCarriers?.map((carrier: any, index: number) => (
                  <Button
                    data-testid={`set-carrier-dropdown-${index}`}
                    key={carrier?.scac}
                    className={`company-wrapper d-flex align-items-center gap-2 ${carrierCode === carrier?.scac ? "selected-wrapper" : ""}`}
                    onClick={() => setCarrierCode(carrier?.scac)}
                  >
                    <ImageComponent path={carrier?.image} className='pe-0' />
                    <div className="form-check">
                      <Input className="form-check-input" type="checkbox" readOnly checked={carrierCode === carrier?.scac} value={carrier?.scac} id="flexCheckChecked" />
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {!showAll && hiddenCount > 0 && (
              <ButtonComponent btnClass="moreContent font-16 fw-medium mt-0" onClick={() => setShowAll(true)}>
                +{hiddenCount}
              </ButtonComponent>
            )}

            {showAll && hiddenCount > 0 && (
              <div className='w-100 text-end mt-2'>
                <ButtonComponent btnClass="btn-transparent p-0 font-xxl-16 font-14 fw-medium" onClick={() => setShowAll(false)}>
                  View Less
                </ButtonComponent>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='evDashboard-main-screen'>
        <div className='p-3 pb-0'>
          <div className='emission-region p-3'>
            <div className='d-flex justify-content-between align-items-center gap-2 mb-3'>
              <div>
                <p className='font-12 fw-medium mb-2'>{dateValue}</p>
                <Heading level="3" className="font-16 font-xxl-20 mb-0" content="EV Network" />
              </div>
              {getCarrierImage()}
            </div>
            <div className='grid-container'>
              <div className='grid-item'>

                <SustainViewCard
                  isLoading={isLoadingEvMatrics}
                  cardValue={formatNumber(true, evMatricsData?.data?.lane, 0)}
                  cardDate="EV Lanes"
                  cardSubHeading=""
                  imagePath="/images/company/lanes.svg"
                />
              </div>
              <div className='grid-item'>
                <SustainViewCard
                  isLoading={isLoadingEvMatrics}
                  cardValue={formatNumber(true, evMatricsData?.data?.shipment, 0)}
                  cardDate="EV Shipments"
                  cardSubHeading=""
                  imagePath="/images/company/shipment.svg"
                />
              </div>
              <div className='grid-item'>
                <SustainViewCard
                  isLoading={isLoadingEvMatrics}
                  cardValue={formatNumber(true, evMatricsData?.data?.ev_emission, 2)}
                  cardDate="EV Emissions"
                  cardSubHeading="tCO2e"
                  imagePath="/images/company/evEmissions.svg"
                />
              </div>
              <div className='grid-item'>
                <SustainViewCard
                  isLoading={isLoadingEvMatrics}
                  cardValue={formatNumber(true, evMatricsData?.data?.actual_emission, 2)}
                  cardDate="Expected Emissions with Diesel"
                  cardSubHeading="tCO2e"
                  imagePath="/images/company/evEmissions.svg"
                />
              </div>
              <div className='grid-item lastChild'>
                <SustainViewCard
                  isLoading={isLoadingEvMatrics}
                  cardValue={""}
                  cardDate="Emissions Reduction"
                  cardSubHeading="tCO2e"
                  imagePath="/images/company/standard-emission.svg"
                > <div className="arrow-wrap d-flex align-items-center gap-1">
                    <h2 className={`fw-bold mb-0 d-flex flex-wrap ${getPercentage(evMatricsData?.data?.ev_emission, evMatricsData?.data?.actual_emission) > 0 ? "text-orange" : "text-deepgreen"} font-20`}> {
                      evMatricsData?.data?.actual_emission
                        ? (formatNumber(true, Math.abs(evMatricsData?.data?.ev_emission - evMatricsData?.data?.actual_emission), 2)) : 0
                    }
                    </h2>
                    <ImageComponent path={`/images/${getPercentage(evMatricsData?.data?.ev_emission, evMatricsData?.data?.actual_emission) > 0 ? "redDownArrow.svg" : "greenArrowDowm.svg"}`} className={`pe-0 ${getPercentage(evMatricsData?.data?.ev_emission, evMatricsData?.data?.actual_emission) ? "" : "green"}`} />
                  </div></SustainViewCard>

              </div>
            </div>

          </div>
        </div>
        <div className='p-3 pb-0'>
          <div className='shipment-wrap p-3'>
            <div className='d-flex justify-content-between align-items-center gap-2 mb-3'>
              <div>
                <p className='font-12 fw-medium mb-2'>{dateValue}</p>
                <Heading level="3" className="font-16 font-xxl-20 mb-0" content="EV Shipments" />
              </div>
              <Heading level="3" className="font-14 font-xxl-16 mb-0" content={`Total Shipments: ${formatNumber(true, evMatricsData?.data?.shipment, 0)}`} />
            </div>
            <Row className='g-3'>
              <Col lg="4">
                <div className="shipmentWrapper d-flex align-items-center justify-content-center gap-2 px-3 py-4 h-100">
                  <div>
                    <ImageComponent path="/images/company/NoOfTonMils.svg" alt="logo" className='pe-0' />
                  </div>
                  <div>
                    <h4 className="pt-0 font-xxl-20 font-16 text-white mb-2">
                      Loaded {""} {formatUnit(configConstants?.data?.default_distance_unit)}
                    </h4>
                    <div className="overview-num">
                      <h4 className="fw-bold font-24 d-flex align-items-center mb-0">
                        {formatNumber(
                          true,
                          distanceConverterInterModal(evMatricsData?.data?.loaded_ton_miles, configConstants?.data?.default_distance_unit),
                          1)}
                      </h4>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg="4">
                <div className="shipmentWrapper d-flex align-items-center justify-content-center gap-2 px-3 py-4 h-100">
                  <div>
                    <ImageComponent path="/images/company/NoOfTons.svg" alt="logo" className='pe-0' />
                  </div>
                  <div>
                    <h4 className="pt-0 font-xxl-20 font-16 text-white mb-2">
                      Total Ton {""} {formatUnit(configConstants?.data?.default_distance_unit)}
                    </h4>
                    <div className="overview-num">
                      <h4 className="fw-bold d-flex font-24 align-items-center mb-0">
                        {formatNumber(
                          true,
                          distanceConverterInterModal(evMatricsData?.data?.total_ton_miles, configConstants?.data?.default_distance_unit),
                          1)}
                      </h4>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg="4">
                <div className="shipmentWrapper d-flex align-items-center justify-content-center gap-2 px-3 py-4 h-100">
                  <div>
                    <ImageComponent path="/images/company/kwh.svg" alt="logo" className='pe-0' />
                  </div>
                  <div>
                    <h4 className="pt-0 text-white font-xxl-20 font-16 mb-2">
                      Total KWH
                    </h4>
                    <div className="overview-num">
                      <h4 className="fw-bold font-24 d-flex align-items-center mb-1">
                        {formatNumber(
                          true,
                          distanceConverterInterModal(evMatricsData?.data?.kwh, configConstants?.data?.default_distance_unit),
                          1)}
                      </h4>
                      <p className="mb-0 font-12 mb-0">Assuming 2 KWH consumption per-{formatPerUnit(configConstants?.data?.default_distance_unit)}</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

        </div>
        <div className='p-3 pb-0'>
          <div className='emission-region'>
            <div className='d-flex justify-content-between align-items-center gap-2 mb-3 p-3'>
              <div>
                <p className='font-12 fw-medium mb-2'>{dateValue}</p>
                <Heading level="3" className="font-16 font-xxl-20 mb-0" content="EV Shipment Lanes" />
              </div>
              {getCarrierImage()}
            </div>
            <div className={`static-table pb-3 ${(carrierCode !== "HJBT") ? "" : "jbHunt"} `}>
              <div className="tWrap">
                <div className="tWrap__body">
                  <table data-testid="table-graph-data">
                    <thead>
                      <tr>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th data-testid="shipment" className="pointer" onClick={() => handleChangeOrder("shipment")}>
                          Total Shipments<span><ImageComponent imageName={`${sortIcon("shipment", colName, order)}`} /></span>
                        </th>
                        <th className="pointer" >
                          Total Emissions
                          <h6 className="font-10 mb-0">tCO2e(Well to Wheel)</h6>
                        </th>
                        {(carrierCode !== "HJBT") && (
                          <th className="pointer">
                            Action
                          </th>)}
                      </tr>
                    </thead>
                    <TableBodyLoad isLoading={isLoadingEvShipmentLaneList} isData={evShipmentLaneListData?.data?.responseData?.length > 0} noDataMsg="No Data Found" colSpan={5}>
                      <tbody className=" text-start ">
                        {evShipmentLaneListData?.data?.responseData?.map((lane: any, index: number) => {
                          return <tr className={`${carrierCode !== "HJBT" && selectedLane?.name === lane?.name ? 'activeRow' : ''}`} key={lane?.name}>
                            <td>{lane?.origin}</td>
                            <td>{lane?.destination}</td>
                            <td>{formatNumber(true, lane?.shipment, 0)}</td>
                            <td>{formatNumber(true, lane?.ev_emission, 2)}</td>

                            {(carrierCode !== "HJBT") && (
                              <td className="map-btn">
                                <div className='d-flex align-items-center gap-2 cursor'>
                                  <ButtonComponent
                                    data-testid={`view-map-btn-${index}`}
                                    imagePath="/images/mapView.svg"
                                    text="View"
                                    onClick={() => {
                                      setSelectedLane(lane);
                                      executeScroll(mapRef)
                                    }
                                    }
                                    btnClass='d-flex align-items-center border-0 viewmap-btn gap-2'
                                  />
                                </div>
                              </td>
                            )}
                          </tr>
                        })}
                      </tbody>
                    </TableBodyLoad>
                  </table>
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={evShipmentLaneListData?.data?.pagination?.total_count}
                    handlePageSizeChange={(e: any) => {
                      setPageSize(e);
                      setCurrentPage(1)
                    }}
                    handlePageChange={setCurrentPage}
                  />
                  <div ref={mapRef} className='my-3'>
                    {carrierCode !== "HJBT" && selectedLane &&
                      <MapComponent showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>
                        <EvDashMapView origin={selectedLane?.origin} destination={selectedLane?.destination} lane={selectedLane} />
                      </MapComponent>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='p-3'>
          <Row className='g-3'>
            <Col lg="6">
              <div className='emission-region h-100'>
                <div className='d-flex justify-content-between align-items-center gap-2 mb-3 p-3 border-bottom'>
                  <div className='d-flex gap-2 align-items-center'>
                    <ImageComponent path='/images/company/truck.svg' />
                    <Heading level="3" className="font-16 font-xxl-20 mb-0" content="EV Shipments by Date" />
                  </div>
                  {getCarrierImage()}
                </div>
                <div className='p-3'>
                  <ChartHighChart
                    loadingTestId="emission-intensity-by-region-loader"
                    testId="high-chart-emission-intensity-by-region"
                    options={
                      multiBarChart(
                        {
                          yTitle: 'Total Shipments',
                          xTitle: 'Date of Shipments',
                          options: shipmentByDateData?.data || [],
                          yKey: "shipments",
                          xKey: "date",
                          decimalPlace: 0,
                          barColor: (styles.primary)
                        }
                      )
                    }
                    constructorType=""
                    isLoading={isLoadingShipmentByDate}
                    database={shipmentByDateData?.data?.length > 0}
                  />
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className='emission-region h-100'>
                <div className='d-flex justify-content-between align-items-center gap-2 mb-3 p-3 border-bottom'>
                  <div className='d-flex gap-2 align-items-center'>
                    <ImageComponent path='/images/company/topLane.svg' />
                    <Heading level="3" className="font-16 font-xxl-20 mb-0" content="Top Shipments by Lane" />
                  </div>
                  {getCarrierImage()}
                </div>
                <div className='p-3'>
                  <ChartHighChart
                    loadingTestId="emission-intensity-by-region-loader"
                    testId="high-chart-emission-intensity-by-region"
                    options={
                      multiBarChart(
                        {
                          yTitle: 'Total Shipments',
                          xTitle: 'Lane Name',
                          options: shipmentLaneData?.data || [],
                          yKey: "shipment",
                          decimalPlace: 0,
                          barColor: (styles.primary)
                        }
                      )
                    }
                    constructorType=""
                    isLoading={isLoadingShipmentLane}
                    database={shipmentLaneData?.data?.length > 0}
                  />
                </div>
              </div>
            </Col>
          </Row>

        </div>
      </div>

    </section>
  )
}

export default EvDashboardView 