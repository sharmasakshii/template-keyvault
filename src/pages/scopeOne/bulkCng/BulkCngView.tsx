import TitleComponent from 'component/tittle'
import SelectDropdown from "component/forms/dropdown";
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import Heading from 'component/heading';
import ImageComponent from 'component/images'
import ChartHighChart from 'component/highChart/ChartHighChart';
import React from 'react';
import styles from '../../../scss/config/_variable.module.scss'
import MapComponent from 'component/map/MapComponent';
import FuelStopMap from 'component/map/FuelStopMap';
import DatePicker from 'component/forms/datePicker';
import ButtonComponent from 'component/forms/button';
import TableHead from 'component/tableHeadHandle';
import TableBodyLoad from 'component/tableBodyHandle';
import SustainViewCard from 'component/cards/sustainabilityTracker';
import BulkCngController from "./bulkCngController";
import { exportChart, formatNumber, getDropDownOptions, getLabel, normalizedList } from 'utils';
import { FuelTrackerCard } from '../fuelReport/FuelReportView';
import multiBarChart from 'utils/highchart/multiBarChart';
import MultiSelect from 'component/forms/multiSelect/MultiSelect';
import Pagination from 'component/pagination';
import LineChart from 'component/charts/lineChart';

interface FilterOption {
    label: string;
    value: string;
}
interface SelectedFilters {
    Location?: FilterOption;
    FuelType?: FilterOption;
}

const BulkCngView = (props: any) => {

    const {
        fuelSlug,
        yearlyData, setYearlyData,
        pId, setPId,
        supplierId, setSupplierId,
        transportType, setTransportType,
        showFullScreen, setShowFullScreen,
        pageNumber, setPageNumber,
        pageSize, setPageSize,
        isLoadingFuelMatrics,
        fuelReportMatricsData,
        fuelConsumptionReportLocationData,
        isLoadingfuelConsumptionReportLocation,
        isLoadingFuelFilters,
        fuelReportFilterData,
        isLoadingPfnaTransactionDetail,
        pfnaTransactionDetailDto,
        handleClickColumn,
        colName,
        order,
        fuelType, setFuelType,
        fuelConsumptionReportEmissionLocationData, isLoadingfuelConsumptionReportEmissionLocation,
        isLoadingFuelConsumption, fuelConsumptionData, fuelEmissionData, isLoadingFuelEmission,
        handleSearchFilters,
        selectedFilters, setSelectedFilters,
        isFilterApplied, setIsFilterApplied,
        initialTransactionFilter,
        handleResetTable,
        filterOptions,
        transactionFilterData,
        isLoadingTransactionFilter,
        isLoadingTransactionLocation,
        transactionLocationData,
        isLoadingFuelConsumptionByPeriod, fuelConsumptionByPeriodData, isLoadingFuelEmissionByPeriod,
        fuelEmissionByPeriodData,
        searchLocationFilterData,
        selectedLocation, setSelectedLocation,
        handleLocationChange,
        handleClearLocation,
        isLoadingsearchLocationFilter
    } = BulkCngController(props);
    const mapStyles = {
        width: '100%',
        height: !showFullScreen ? "450px" : '100vh',
    };
    const { t } = useTranslation()
    const chartLocationFuelRef: any = React.useRef<Highcharts.Chart | null>(null);
    const chartTotalEmissionRef: any = React.useRef<Highcharts.Chart | null>(null);


    const supplierLabel = getLabel(supplierId, 'Supplier');
    const transportLabel = !["rd", "b100"].includes(fuelSlug) ? ` & ${getLabel(transportType, 'Type')}` : "";
    const periodLabel = getLabel(pId, "Period");
    const yearLabel = yearlyData?.label ?? "";

    const filterData = supplierLabel + transportLabel + " for " + periodLabel + " " + yearLabel;


    const reportTitles: Record<string, string> = {
        bulk: "Bulk Report",
        cng: "CNG Report",
        rd: "RD Report",
        b100: "B100 Report"
    };

    return (
        <section data-testid="bulk-cng-report-view" className='scopeOneDashboard py-2 pb-4'>
            <TitleComponent title={"Scope 1 | Fuels Report"} pageHeading={reportTitles[fuelSlug] || "Unknown Report"} />
            <div className='border-bottom px-2 select-box d-flex flex-wrap gap-2 pb-3 mb-3'>
                <SelectDropdown
                    aria-label="year-dropdown"
                    disabled={isLoadingFuelFilters}
                    options={getDropDownOptions(fuelReportFilterData?.data?.years, "year", "year", "", "", false)}
                    placeholder={t('year')}
                    customClass="yearDropdown"
                    selectedValue={yearlyData}
                    onChange={(e: any) => {
                        setYearlyData(e);
                        setPId({ label: "All Periods", value: "" })
                        setSupplierId({ label: "All Suppliers", value: "" })
                        setTransportType({ label: "All Types", value: "" })
                        setPageNumber(1);
                        handleResetTable(e.value)
                    }}
                />
                <SelectDropdown
                    aria-label="period-dropdown"
                    disabled={isLoadingFuelFilters}
                    options={getDropDownOptions(fuelReportFilterData?.data?.periods, "period_name", "id", "All Periods")}
                    placeholder={t('period')}
                    selectedValue={pId}
                    onChange={(e: any) => {
                        setPId(e);
                        setSupplierId({ label: "All Suppliers", value: "" })
                        setTransportType({ label: "All Types", value: "" })
                        setPageNumber(1);
                        handleResetTable(yearlyData?.value)
                    }}
                />

                <SelectDropdown
                    aria-label="supplier-dropdown"
                    placeholder={"Supplier"}
                    disabled={isLoadingFuelFilters}
                    options={getDropDownOptions(fuelReportFilterData?.data?.supplier, "name", "name", "All Supliers", "", false)}
                    customClass="vehicleDropdown"
                    selectedValue={supplierId}
                    onChange={(e: any) => {
                        setSupplierId(e);
                        setTransportType({ label: "All Types", value: "" })
                        setPageNumber(1);
                        handleResetTable(yearlyData?.value)
                    }}
                />
                {(fuelSlug !== "rd" && fuelSlug !== "b100") && <SelectDropdown
                    aria-label="transport-dropdown"
                    options={getDropDownOptions(fuelReportFilterData?.data?.transports, "transport_name", "id", "All Types", "", true)}
                    disabled={isLoadingFuelFilters}
                    placeholder="Transport Types"
                    customClass="vehicleDropdown"
                    selectedValue={transportType}
                    onChange={(e: any) => {
                        setTransportType(e);
                        setPageNumber(1);
                        handleResetTable(yearlyData?.value)
                    }}
                />}
            </div>
            <div className='reagion-card'>
                <Row className='g-3'>
                    <Col md="4">
                        <SustainViewCard
                            isLoading={isLoadingFuelMatrics}
                            cardValue={formatNumber(true, fuelReportMatricsData?.data?.total_ghg_emissions, 2)}
                            imagePath="/images/emission-icon-bold.svg"
                            cardDate={t('ghgEmissions')}
                            cardSubHeading={t('tco2eUnit')}
                        />
                    </Col>
                    <Col md="4">
                        <SustainViewCard
                            isLoading={isLoadingFuelMatrics}
                            imagePath={"/images/fuel-icon-bold.svg"}
                            cardDate={`Total ${t('fuelConsumption')} ${fuelSlug === "b100" ? "" : "by Type"}`}
                            cardSubHeading={t('gallons')}
                            className={"cards"}
                        >
                            <div className='d-flex gap-2 pt-2 align-items-start flex-column co-txt justify-content-start border-top w-100'>
                                {fuelSlug === "b100" ? <h6 className='mb-0 titleMain'>{formatNumber(true, fuelReportMatricsData?.data?.fuel_consumption, 2)}</h6> : fuelReportMatricsData?.data?.fuelConsumption?.map((el: any) => (
                                    <h6 key={el?.transport_name} className='mb-0 titleMain'><span className='matrix-value'>{el?.transport_name}</span>: {formatNumber(true, el?.fuel_consumption, 2)}</h6>
                                ))}
                            </div>
                        </SustainViewCard>
                    </Col>
                    <Col md="4">
                        <SustainViewCard
                            isLoading={isLoadingFuelMatrics}
                            imagePath={"/images/total-location.svg"}
                            cardDate="Number of Locations"
                            cardValue={formatNumber(true, fuelReportMatricsData?.data?.location, 0)}
                            cardSubHeading={"Count"}
                        />
                    </Col>
                    {fuelSlug !== "b100" && <>
                        <FuelTrackerCard
                            title={`Fuel Consumption by ${filterData}`}
                            subTitle={`${fuelSlug === "cng" ? "DGE vs GGE Fuel Consumption Comparison" : "Total Fuel Consumption by Fuel Type"}`}
                            isLoading={isLoadingFuelConsumption || isLoadingFuelFilters}
                            data={normalizedList(fuelConsumptionData?.data?.data)}
                            yTitle={`${t('fuelConsumption')} (${t('gallons')})`}
                            xTitle={`${fuelSlug === "cng" ? "Units" : "Fuel Types"}`}
                            unit={`(${t('gallons')})`}
                        />
                        <FuelTrackerCard
                            title={`Emissions by ${filterData}`}
                            subTitle={`${fuelSlug === "cng" ? "DGE vs GGE Emissions Comparison" : "Total Emissions by Fuel Type"}`}
                            isLoading={isLoadingFuelEmission || isLoadingFuelFilters}
                            data={normalizedList(fuelEmissionData?.data?.data)}
                            yTitle={`Emissions (${t('tco2eUnit')})`}
                            xTitle={`${fuelSlug === "cng" ? "Units" : "Fuel Types"}`}
                            unit={`(${t('tco2eUnit')})`}
                            barColor={styles.orange}
                        /></>}

                    <Col lg="6">
                        <LineChart
                            filterHeading={`Fuel Consumption by ${filterData}`}
                            chartHeading={`Total Fuel Consumption by ${fuelSlug === "b100" ? "Locations" : "Fuel Type"}`}
                            unit={`(${t('gallons')})`}
                            loading={isLoadingFuelConsumptionByPeriod}
                            data={fuelConsumptionByPeriodData?.data}
                            yTitle={`${t('fuelConsumption')} (${t('gallons')})`}
                            xKey="periods"
                        />
                    </Col>
                    <Col lg="6">
                        <LineChart
                            filterHeading={`Emissions by ${filterData}`}
                            chartHeading={`Total Emissions by ${fuelSlug === "b100" ? "Locations" : "Fuel Type"}`}
                            unit={`(${t('tco2eUnit')})`}
                            loading={isLoadingFuelEmissionByPeriod}
                            data={fuelEmissionByPeriodData?.data}
                            yTitle={`Emissions (${t('tco2eUnit')})`}
                            xKey="periods"
                        />
                    </Col>
                    <Col lg="12">
                        <div className='mainGrayCards h-100 p-3'>
                            <Heading level="3" content="Location Comparison" className="font-14 font-xxl-16 fw-medium" />
                            <div className='d-flex flex-wrap select-box gap-2 border-bottom mb-3 pb-3'>
                                {fuelSlug === "bulk" && <SelectDropdown
                                    aria-label="fuel-type-dropdown"
                                    placeholder="Fuel Types"
                                    selectedValue={fuelType}
                                    onChange={(e: any) => {
                                        setFuelType(e);
                                        setSelectedLocation([])
                                    }}
                                    customClass="vehicleDropdown"
                                    options={getDropDownOptions(
                                        transactionFilterData?.FuelType, "name", "id", "All Fuel Types", "", false
                                    )}
                                />}

                                <div className="search-icon-img">
                                    <span className='d-block height-0'>
                                        <ImageComponent path="/images/search.svg" className="pe-0 search-img" />
                                    </span>
                                    <div>
                                        <MultiSelect
                                            placeHolder="Select Location"
                                            isSearchable={true}
                                            className="selectFuel-dropdown"
                                            aria-label="multi-carrier-dropdown"
                                            options={getDropDownOptions(searchLocationFilterData?.data, "name", "id", "", "", false)}
                                            onChange={handleLocationChange}
                                            selectedOptions={selectedLocation}
                                            menuPlacement={"bottom"}
                                            isClearable={false}
                                            disableClear={true}
                                            clearMessage="Selected Locations"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex flex-wrap mb-3 gap-1'>
                                {selectedLocation?.map((location: { label: string, value: string }) => (
                                    <button data-testid={`selected-location-${location?.value}`} onClick={() => handleClearLocation(location)} key={location?.value} className="d-flex align-items-center gap-1 selected-location">
                                        <Heading level="6" content={location?.label} className="font-14 font-xxl-16 fw-normal mb-0" />
                                        <div className="btn-transparent p-0" >
                                            <ImageComponent path="/images/cross.svg" className="pe-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <Row className='g-3'>
                                <Col lg="6">
                                    <div className='mainGrayCards h-100'>
                                        <div className="d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4">
                                            <div className='d-flex gap-1 align-items-start'>
                                                <div>
                                                    <Heading level="6" className="fw-medium font-14 mb-1" content={`Fuel Consumption by ${fuelSlug === "bulk" ? getLabel(fuelType, 'Fuel type') + "," : ""} ${filterData}`} />
                                                    <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`Total Fuel Consumption by Locations`} <span className='fw-medium font-xxl-14 font-12'> (Gallons)</span></Heading>
                                                </div>
                                            </div>
                                            <button data-testid={`export-btn-fuel-graph`} type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => exportChart(chartLocationFuelRef, {
                                                subTitle: "Total Fuel Consumption by Locations",
                                                mainTitle: `Fuel Consumption by ${filterData}`,
                                                unit: '(Gallons)'
                                            })}> <ImageComponent path="/images/download.svg" /></button>
                                        </div>
                                        <div className='py-3 pt-1 px-2'>
                                            <ChartHighChart
                                                chartComponentRef={chartLocationFuelRef}
                                                database={fuelConsumptionReportLocationData?.data?.length > 0}
                                                options={multiBarChart({
                                                    options: fuelConsumptionReportLocationData?.data,
                                                    yTitle: 'Fuel Consumption (Gallons)',
                                                    xTitle: 'Locations',
                                                    yKey: "value",
                                                    xKey: "location",
                                                    decimalPlace: 2,
                                                    barColor: (styles.primary),
                                                    isTooltip: true,
                                                })}
                                                constructorType=""
                                                isLoading={isLoadingfuelConsumptionReportLocation || isLoadingsearchLocationFilter}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="6">
                                    <div className='mainGrayCards h-100'>
                                        <div className="d-flex gap-2 justify-content-between align-items-baseline p-3 pe-4">
                                            <div className='d-flex gap-1 align-items-start'>
                                                <div>
                                                    <Heading level="6" className="fw-medium font-14 mb-1" content={`Emissions by ${fuelSlug === "bulk" ? getLabel(fuelType, 'Fuel type') + "," : ""} ${filterData}`} />
                                                    <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{`Total Emissions by Locations`} <span className='fw-medium font-xxl-14 font-12'> (tCO2e)</span></Heading>
                                                </div>
                                            </div>
                                            <button data-testid={`export-btn-fuel-graph1`} type='button' className="btn btn-transparent download-img p-0 h-0" onClick={() => exportChart(chartTotalEmissionRef, {
                                                subTitle: "Total Emissions by Locations.",
                                                mainTitle: `Emissions by ${filterData}`,
                                                unit: '(tCO2e)'
                                            })}> <ImageComponent path="/images/download.svg" /></button>
                                        </div>
                                        <div className='py-3 pt-1 px-2'>
                                            <ChartHighChart
                                                chartComponentRef={chartTotalEmissionRef}
                                                database={fuelConsumptionReportEmissionLocationData?.data?.length > 0}
                                                options={multiBarChart({
                                                    options: fuelConsumptionReportEmissionLocationData?.data,
                                                    yTitle: 'Emissions (tCO2e)',
                                                    xTitle: 'Locations',
                                                    yKey: "value",
                                                    xKey: "location",
                                                    decimalPlace: 2,
                                                    barColor: (styles.orange),
                                                    isTooltip: true,
                                                })}
                                                constructorType=""
                                                isLoading={isLoadingfuelConsumptionReportEmissionLocation || isLoadingsearchLocationFilter}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    {fuelSlug !== "rd" && <>
                        <Col md="12">
                            <div className='mainGrayCards h-100'>
                                <div className='border-bottom p-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2'>
                                    <div>
                                        <Heading level="6" className="fw-medium font-14 mb-1" content={`${filterData}`} />
                                        <Heading level="6" className="fw-semibold font-xxl-20 font-16 mb-0">{t('transactionDetail')}</Heading>
                                    </div>

                                    <div className='d-flex flex-wrap gap-2 align-items-center select-box'>
                                        {fuelSlug !== 'b100' && (
                                            <>
                                                <DatePicker
                                                    selectDate={selectedFilters?.StartDate}
                                                    maxDate={selectedFilters?.EndDate}
                                                    setSelectDate={(e: any) =>
                                                        setSelectedFilters((prev: any) => ({ ...prev, StartDate: e }))
                                                    }
                                                />
                                                <DatePicker
                                                    selectDate={selectedFilters?.EndDate}
                                                    minDate={selectedFilters?.StartDate}
                                                    setSelectDate={(e: any) =>
                                                        setSelectedFilters((prev: any) => ({ ...prev, EndDate: e }))
                                                    }
                                                />
                                            </>
                                        )}

                                        {filterOptions.map(({ key, placeholder, ariaLabel, isValid }) =>
                                            isValid.includes(fuelSlug) && (
                                                <SelectDropdown
                                                    key={key}
                                                    placeholder={placeholder}
                                                    aria-label={ariaLabel}
                                                    isSearchable
                                                    selectedValue={selectedFilters[key as keyof SelectedFilters]} // Fix TypeScript error
                                                    onChange={(e: FilterOption) => {
                                                        if (!e.value) {
                                                            handleSearchFilters(key, "");
                                                        }
                                                        setSelectedFilters((prev: any) => ({ ...prev, [key]: e }));
                                                    }}
                                                    customClass="vehicleDropdown"
                                                    onInputChange={(inputValue: string, { action }: { action: string }) => {
                                                        if (action === "input-change") handleSearchFilters(key, inputValue);
                                                    }}
                                                    options={getDropDownOptions(
                                                        transactionFilterData?.[key],
                                                        "name",
                                                        "id",
                                                        initialTransactionFilter(yearlyData?.value)[key as keyof SelectedFilters]?.label,
                                                        "",
                                                        false
                                                    )}
                                                />
                                            )
                                        )}
                                        <ButtonComponent
                                            text={t('apply')}
                                            data-testid="apply-button"
                                            btnClass="btn-deepgreen font-14 px-4 py-1"
                                            disabled={isLoadingPfnaTransactionDetail || isLoadingTransactionFilter}
                                            onClick={() => {
                                                setIsFilterApplied({ ...selectedFilters, isFilterApplied: true });
                                                setPageNumber(1)
                                            }}
                                        />
                                        <ButtonComponent
                                            text={t('reset')}
                                            data-testid="reset-button"
                                            btnClass="btn-reset font-14 px-4 py-1"
                                            disabled={isLoadingPfnaTransactionDetail || isLoadingTransactionFilter || !isFilterApplied?.isFilterApplied}
                                            onClick={() => handleResetTable(yearlyData?.value)}
                                        />
                                    </div>
                                </div>
                                <div className='pb-3'>
                                    <div className='static-table mb-0'>
                                        <table>
                                            <TableHead
                                                handleClickColumn={handleClickColumn} col_name={colName} order={order}
                                                columns={[
                                                    { key: "location_name", label: "Location", isSorting: true },
                                                    { key: "supplier", label: "Supplier Name", isSorting: false },
                                                    { key: "date", label: fuelSlug === "b100" ? "Delivery Date" : "Invoice Date", isSorting: true },
                                                    { key: "fuelType", label: "Fuel Type", isSorting: false, isHidden: fuelSlug === "b100" },
                                                    { key: "invoice", label: "Invoice Number", isSorting: false, isHidden: fuelSlug !== "b100" },
                                                    { key: "gallons", label: "Fuel Consumption", unit: "(Gallons)", isSorting: true },
                                                    { key: "emissions", label: "Emissions", unit: "(tCO2e)", isSorting: true },
                                                ]} />

                                            <TableBodyLoad colSpan={6} isLoading={isLoadingPfnaTransactionDetail} isData={pfnaTransactionDetailDto?.data?.list?.length > 0}><tbody>
                                                {pfnaTransactionDetailDto?.data?.list?.map((data: any) => (
                                                    <tr key={data.id}>
                                                        <td>{data.location_name}</td>
                                                        <td>{data.supplier}</td>
                                                        <td>{data.date}</td>

                                                        <td>{fuelSlug === "b100" ? data.invoice : data.fuel_name}</td>
                                                        <td> {formatNumber(true, data.gallons, 2)}</td>
                                                        <td>{formatNumber(true, data.emissions, 2)} </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            </TableBodyLoad>
                                        </table>
                                    </div>
                                    <Pagination
                                        currentPage={pageNumber}
                                        pageSize={pageSize}
                                        total={pfnaTransactionDetailDto?.data?.pagination?.total_count}
                                        handlePageSizeChange={(e: any) => {
                                            setPageSize(e);
                                            setPageNumber(1)
                                        }}
                                        handlePageChange={(page: number) => {
                                            setPageNumber(page)
                                        }}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col md="12">
                            <MapComponent isLoading={isLoadingTransactionLocation} showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>
                                <FuelStopMap page="fuelReport" containerStyle={mapStyles} fuelStopData={normalizedList(transactionLocationData?.data)} />
                            </MapComponent>
                        </Col></>}
                </Row>
            </div>

        </section>
    )
}

export default BulkCngView