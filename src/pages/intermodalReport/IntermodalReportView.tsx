import TitleComponent from 'component/tittle'
import DatePicker from 'component/forms/datePicker';
import SelectDropdown from "../../component/forms/dropdown";
import ImageComponent from "../../component/images";
import { Col, Row, Label } from 'reactstrap';
import SustainViewCard from 'component/cards/sustainabilityTracker';
import Heading from 'component/heading';
import ChartHighChart from 'component/highChart/ChartHighChart';
import multiBarChart from 'utils/highchart/multiBarChart';
import styles from '../../scss/config/_variable.module.scss'
import Pagination from 'component/pagination';
import TableBodyLoad from 'component/tableBodyHandle';
import { distanceConverterInterModal, executeScroll, formatNumber, normalizedList, isCompanyEnable, checKEmptyValue, formatUnit, dateFormatValue } from 'utils'
import IntermodalReportController from './intermodalReportController';
import { useTranslation } from 'react-i18next';
import TableHead from 'component/tableHeadHandle';
import { companySlug } from "constant";
import SearchODPair from 'component/forms/searchODpair/SearchODPair';
import moment from "moment";

const IntermodalReportView = () => {
    const {
        configConstants,
        order,
        colName,
        currentPage, setCurrentPage,
        pageSize,
        handlePageChange,
        myRef,
        setLaneName,
        isLoadingIntermodalReportMatrixData,
        isLoadingTopLanesByShipmentData,
        intermodalReportMatrixData,
        intermodalFilterData,
        isLoadingIntermodalFilterData,
        setYear,
        setCarrier,
        carrier,
        tableCarrier,
        year,
        topLanesByShipmentData,
        handleClickColumn,
        setSelectedRowKey,
        getLaneByShipmentMilesGraph,
        isLoadingLaneByShipmentMilesGraph,
        tableYear,
        setTableYear,
        setTableCarrier,
        loginDetails,
        startDate, setStartDate,
        endDate, setEndDate,
        childRef,
        handleChangeLocation,
        resetLane,
        intermodalMaxDateGraph
    } = IntermodalReportController()
    const { t } = useTranslation()
    const dateValue = dateFormatValue(startDate, endDate, 'DD MMM YYYY');
    const defaultUnit = configConstants?.data?.default_distance_unit;
    return (<>
        <TitleComponent
            title={"Intermodal Report"}
            pageHeading="Intermodal Report"
        />
        <section className="intermodal pb-3 pt-2 px-2" data-testid="intermodal-report-view">
            <div className='mb-3 d-sm-flex flex-wrap gap-2 select-box border-bottom pb-3'>

                {isCompanyEnable(loginDetails?.data, [companySlug?.pep]) && <SelectDropdown
                    aria-label="year-dropdown"
                    disabled={isLoadingIntermodalFilterData}
                    options={
                        (intermodalFilterData?.data?.years || []).map(
                            (carrier: string): { label: string; value: string } => ({
                                label: carrier,
                                value: carrier
                            })
                        )
                    }
                    selectedValue={
                        { label: year, value: year }

                    }
                    placeholder={t('year')}
                    customClass=" yearDropdown"
                    onChange={(e: any) => {
                        setYear(e.value);
                        setTableYear(e.value);
                        setCurrentPage(1)
                    }}
                />}
                <button type="button" className="search-icon-img p-0 border-0 cursor">
                    <span className="height-0 d-block">
                        <ImageComponent
                            path="/images/search.svg"
                            className="pe-0 search-img"
                        />
                    </span>
                    <div>
                        <SelectDropdown
                            aria-label="carrier-dropdown"
                            placeholder="Search Carriers"
                            disabled={isLoadingIntermodalFilterData}
                            isSearchable={true}
                            selectedValue={{ label: carrier || "All Carriers", value: carrier }}
                            options={[
                                { label: "All Carriers", value: "" },
                                ...(intermodalFilterData?.data?.carriers || []).map(
                                    (carrier: string): { label: string; value: string } => ({
                                        label: carrier,
                                        value: carrier
                                    })
                                )
                            ]}
                            onChange={(e: any) => {
                                setCarrier(e.value);
                                setTableCarrier(e.value);
                                setCurrentPage(1)
                            }}
                            customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize text-start"
                        />
                    </div>
                </button>
                {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) && <>
                    <div className='d-sm-flex gap-1 align-items-center my-3 my-md-0'>
                        <Label htmlFor="exampleDate1" className="font-12 mb-0 fw-medium">
                            Start Date
                        </Label>
                        <DatePicker
                            selectDate={startDate}
                            // minDate={evFilterData?.data?.start_date}
                            minDate={intermodalMaxDateGraph?.data[0]?.min_date && moment.utc(intermodalMaxDateGraph?.data[0]?.min_date).format("YYYY-MM-DD")}
                            maxDate={endDate}
                            setSelectDate={setStartDate}
                        />
                    </div>
                    <div className='d-sm-flex gap-1 align-items-center'>

                        <Label htmlFor="exampleDate" className="font-12 mb-0 fw-medium">
                            End Date
                        </Label>
                        <DatePicker
                            selectDate={endDate}
                            minDate={startDate}
                            maxDate={moment.utc(intermodalMaxDateGraph?.data[0]?.date).format("YYYY-MM-DD")}
                            setSelectDate={setEndDate}
                        />
                    </div>

                </>}

            </div>
            <div className="reagionCards mb-3">
                <Row className='g-3'>
                    <Col md="4">
                        <SustainViewCard
                            isLoading={isLoadingIntermodalReportMatrixData}
                            cardValue={formatNumber(
                                true,
                                intermodalReportMatrixData?.data?.totalLanes || 0,
                                0
                            )}
                            cardDate="Total Lanes"
                            imagePath="/images/total-lanes.svg"
                        />
                    </Col>
                    <Col md="4">
                        <SustainViewCard
                            isLoading={isLoadingIntermodalReportMatrixData}
                            cardValue={formatNumber(
                                true,
                                intermodalReportMatrixData?.data?.totalShipments || 0,
                                0
                            )}
                            cardDate="Total Shipments"
                            imagePath="/images/intermodalEmission.svg"
                        />
                    </Col>
                    <Col md="4">
                        <SustainViewCard
                            isLoading={isLoadingIntermodalReportMatrixData}
                            cardValue={
                                formatNumber(
                                    true,
                                    distanceConverterInterModal(intermodalReportMatrixData?.data?.totalMiles || 0,
                                        defaultUnit),
                                    0
                                )}
                            cardDate={`Total ${formatUnit(defaultUnit)}`}
                            imagePath="/images/intermodalEmission.svg"
                        />
                    </Col>
                </Row>
            </div>
            <div className='mainGrayCards pb-3 h-100 mb-3'>
                <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                    <div className='select-box '>
                        <Heading level="6" className="font-12 font-xxl-14 mb-1">Top 10 Lanes by Shipments for {!carrier ? "All Carriers" : carrier} {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) ? `from ${dateValue}` : `, ${year}`}</Heading>
                        <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0">Top 10 Lanes by Shipments</Heading>
                    </div>

                </div>
                <div className='p-3 pb-0'>
                    <ChartHighChart
                        database={getLaneByShipmentMilesGraph?.data?.miles?.length > 0}
                        options={multiBarChart({
                            yTitle: 'Total Shipment Count',
                            xTitle: 'Lane Name',
                            options: getLaneByShipmentMilesGraph?.data?.shipments,
                            yKey: "counts",
                            xKey: "name",
                            decimalPlace: 0,
                            barColor: styles.primary,
                            isTooltip: true,
                        })}
                        constructorType=""
                        isLoading={isLoadingLaneByShipmentMilesGraph}
                    />
                </div>
            </div>
            <div className='mainGrayCards pb-3 h-100 mb-3'>
                <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                    <div className='select-box '>
                        <Heading level="6" className="font-12 font-xxl-14 mb-1">Top 10 Lanes by {formatUnit(defaultUnit)} for {!carrier ? "All Carriers" : carrier} {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) ? `from ${dateValue}` : `, ${year}`}</Heading>
                        <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0">Top 10 Lanes by {formatUnit(defaultUnit)}</Heading>
                    </div>

                </div>
                <div className='p-3 pb-0'>
                    <ChartHighChart
                        database={getLaneByShipmentMilesGraph?.data?.miles?.length > 0}
                        options=
                        {multiBarChart(
                            {
                                yTitle: `Total ${formatUnit(defaultUnit)}`,
                                xTitle: 'Lane Name',
                                options: getLaneByShipmentMilesGraph?.data?.miles,
                                yKey: "counts",
                                xKey: "name",
                                decimalPlace: 0,
                                barColor: styles.orange,
                                isTooltip: true,
                            }
                        )}
                        constructorType=""
                        isLoading={isLoadingLaneByShipmentMilesGraph}
                    />
                </div>
            </div>
            <div className='mainGrayCards pb-3 mb-3'>
                <div className='headingLine  p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                    <div>
                        <Heading level="6" className="font-12 font-xxl-14 mb-1">List of All Lanes by Shipments and {formatUnit(defaultUnit)} {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) ? `from ${dateValue}` : `, ${year}`}</Heading>
                        <Heading level="5" content={`List of All Lanes by Shipments and ${formatUnit(defaultUnit)}`} className="font-18 font-xxl-20 fw-semibold mb-0" />
                    </div>
                    <div className='select-box d-flex align-items-center '>
                        {isCompanyEnable(loginDetails?.data, [companySlug?.pep]) && <SelectDropdown
                            aria-label="year-dropdown2"
                            disabled={isLoadingIntermodalFilterData}
                            options={
                                (intermodalFilterData?.data?.years || []).map(
                                    (carrier: string): { label: string; value: string } => ({
                                        label: carrier,
                                        value: carrier
                                    })
                                )
                            }
                            selectedValue={
                                tableYear
                                    ? { label: tableYear, value: tableYear }
                                    : { label: year, value: year }
                            }
                            placeholder={t('year')}
                            customClass=" yearDropdown"
                            onChange={(e: any) => {
                                setTableYear(e.value)
                                setCurrentPage(1)
                            }}
                        />}
                        <button type="button" className="search-icon-img p-0 border-0 cursor">
                            <span className="height-0 d-block">
                                <ImageComponent
                                    path="/images/search.svg"
                                    className="pe-0 search-img"
                                />
                            </span>
                            <div>
                                <SelectDropdown
                                    aria-label="carrier-dropdown2"
                                    placeholder="Search Carriers"
                                    disabled={isLoadingIntermodalFilterData}
                                    isSearchable={true}
                                    selectedValue={{ label: tableCarrier || "All Carriers", value: tableCarrier }}
                                    options={[
                                        { label: "All Carriers", value: "" },
                                        ...(intermodalFilterData?.data?.tranTableCarrier || []).map(
                                            (carrier: string): { label: string; value: string } => ({
                                                label: carrier,
                                                value: carrier
                                            })
                                        )
                                    ]}
                                    onChange={(e: any) => {
                                        setTableCarrier(e.value)
                                        setCurrentPage(1)
                                    }}
                                    customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize text-start"
                                />
                            </div>

                        </button>
                        {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) &&
                            <SearchODPair
                                ref={childRef}
                                data-testid="search-lane-filter"
                                handleChangeLocation={handleChangeLocation}
                                handleGetSearchData={() => { }}
                                handleResetODpair={resetLane}
                                page="intermodalReport"
                                odParams={{
                                    carrier_name: carrier,
                                    start_date: startDate,
                                    end_date: endDate
                                }}
                                interModalPadding={true} />

                        }

                    </div>

                </div>
                <div className="static-table listLane">
                    <table>
                        <TableHead
                            handleClickColumn={handleClickColumn}
                            col_name={colName} order={order}
                            columns={isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) ? [
                                { key: "origin", label: "Origin", isSorting: false },
                                { key: "destination", label: "Destination", isSorting: false },

                                { key: "o_global", label: "O Global", isSorting: false },
                                { key: "o_plantType", label: "O Plant Type", isSorting: false },
                                { key: "d_global", label: "D Global", isSorting: false },
                                { key: "d_plantType", label: "D Plant Type", isSorting: false },


                                { key: "carrier_name", label: "Carrier Name", isSorting: false },
                                { key: "total_shipments", label: "Total Shipments", isSorting: true },
                                {
                                    key: "total_distance",
                                    label: "Distance",
                                    unit: `(${formatUnit(defaultUnit)})`,
                                    isSorting: true
                                },
                                { key: "quantity", label: "Quantity (Cubes)", isSorting: true },

                            ] : [
                                { key: "origin", label: "Origin", isSorting: false },
                                { key: "destination", label: "Destination", isSorting: false },
                                { key: "carrier_name", label: "Carrier Name", isSorting: false },
                                { key: "total_shipments", label: "Total Shipments", isSorting: true },
                                {
                                    key: "total_distance",
                                    label: "Distance",
                                    unit: `(${formatUnit(defaultUnit)})`,
                                    isSorting: true
                                }
                            ]} />


                        <TableBodyLoad colSpan={isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) ? 10 : 5} noDataMsg={`${t('noRecord')}`} isLoading={isLoadingTopLanesByShipmentData} isData={normalizedList(topLanesByShipmentData?.data?.list).length > 0}>
                            <tbody>
                                {normalizedList(topLanesByShipmentData?.data?.list)?.map((data: any, index: number) => {
                                    const rowKey = `row-${index}`;
                                    return (
                                        <tr
                                            key={rowKey}
                                            data-testid={`view-lane-${index}`}
                                            // className={selectedRowKey === rowKey ? 'activeRow' : ''}
                                            onClick={() => {
                                                setLaneName(data);
                                                executeScroll(myRef);
                                                setSelectedRowKey(rowKey);
                                            }}
                                        >
                                            <td>{data?.origin + (data?.origin_zip ? ", " + data?.origin_zip : "")}</td>
                                            <td>{data?.destination + (data?.dest_zip ? ", " + data?.dest_zip : "")}</td>
                                            {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) && (
                                                <>
                                                    <td>{checKEmptyValue(data?.o_global)}</td>
                                                    <td>{checKEmptyValue(data?.o_plantType)}</td>
                                                    <td>{checKEmptyValue(data?.d_global)}</td>
                                                    <td>{checKEmptyValue(data?.d_plantType)}</td>
                                                </>
                                            )}

                                            <td>{data?.carrier_name}</td>
                                            <td> {formatNumber(
                                                true,
                                                data?.total_shipments || 0,
                                                0
                                            )}</td>
                                            <td>
                                                {formatNumber(
                                                    true,
                                                    distanceConverterInterModal(data?.total_distance || 0,
                                                        defaultUnit),
                                                    2
                                                )}
                                            </td>
                                            {isCompanyEnable(loginDetails?.data, [companySlug?.bmb]) && (<td> {formatNumber(
                                                true,
                                                data?.quantity || 0,
                                                0
                                            )}
                                            </td>)}

                                        </tr>
                                    );
                                })}

                            </tbody>
                        </TableBodyLoad>
                    </table>

                </div>
                <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={topLanesByShipmentData?.data?.pagination?.total_count}
                    handlePageSizeChange={(e: any) => {
                        handlePageChange(e);
                    }}
                    handlePageChange={(page: number) => {
                        setCurrentPage(page);
                    }}
                />
            </div>
        </section>
    </>
    )
}

export default IntermodalReportView