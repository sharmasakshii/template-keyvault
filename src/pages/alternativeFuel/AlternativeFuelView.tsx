import SustainViewCard from 'component/cards/sustainabilityTracker';
import Heading from 'component/heading'
import TitleComponent from 'component/tittle'
import ImageComponent from 'component/images'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap';
import TableBodyLoad from 'component/tableBodyHandle';
import GoogleMapLaneView from 'component/map/GoogleMapLaneView';
import AlternativeFuelController from "./alternativeFuelController"
import { formatNumber, sortIcon, executeScroll, getDropDownOptions, countryListDto, distanceConverterInterModal, formatUnit, isCompanyEnable } from 'utils'
import Pagination from 'component/pagination';
import MapComponent from 'component/map/MapComponent';
import ChartHighChart from 'component/highChart/ChartHighChart';
import { stackChart } from "utils/highchart/stackChart"
import { barchartRNG } from 'utils/highchart/barchartRNG';
import SelectDropdown from "../../component/forms/dropdown";
import Logo from "component/logo";
import { requiredCarrierItems, companySlug, typeOptionListDto } from "constant";
import multiBarChart from 'utils/highchart/multiBarChart';
import styles from '../../scss/config/_variable.module.scss'
import MultiSelect from 'component/forms/multiSelect/MultiSelect';
import ButtonComponent from 'component/forms/button';
import Accordion from 'react-bootstrap/Accordion';
import Schneider from './Schneider';
import CountryFilter from 'component/countryFilter';

const ShowData = (props: any) => {
    const { month, monthOption, year } = props
    return (<span>{monthOption?.find((el: any) => el.value === month)?.label} {year}</span>)
}

const checkSelectedCarrier = (selectedCarrier: any) => {
    const filteredList = selectedCarrier.filter((item: any) => requiredCarrierItems.includes(item));
    const otherItemsExist = selectedCarrier.some((item: any) => !requiredCarrierItems.includes(item));
    return filteredList.length > 0 && !otherItemsExist;
}

const getMdClass = (isMd: any) => isMd ? 6 : 4

const AlternativeFuelView = () => {
    const {
        laneName,
        getLaneName,
        currentPage,
        pageSize,
        handlePageChange,
        setCurrentPage,
        myRef,
        showFullScreen,
        setShowFullScreen,
        keyMetricsAlternativeDto,
        keyMetricsAlternativeDtoLoading,
        listOfAllLanesByShipmentsDto,
        listOfAllLanesByShipmentsDtoLoading,
        lanesByFuelUsageAndMileageDto,
        lanesByFuelUsageAndMileageDtoLoading,
        month,
        setMonth,
        year,
        setYear,
        currentShipmentPage,
        setCurrentShipmentPage,
        colName,
        order,
        handleChangeOrder,
        lanesByFuelStackeByEmissionsDto,
        lanesByFuelStackeByEmissionsDtoLoading,
        lanesByFuelStackeByQuantityDto,
        lanesByFuelStackeByQuantityDtoLoading,
        lanesByFuelStackeByMileageDto,
        lanesByFuelStackeByMileageDtoLoading,
        totalEmissionGraphByLaneAndFuelTypeLoading,
        totalEmissionGraphByLaneAndFuelType,
        orderShipment,
        handleChangeOrderShipment,
        handleLaneFuelType,
        laneFuelType,
        isLoadinglaneStatistics,
        monthOption,
        selectedCarrier,
        handleCarrierChange,
        alternativeFuelFiltersDto,
        alternativeFuelTotalShipmentsLoading,
        alternativeFuelTotalShipmentsDto,
        fuelType, setFuelType,
        alternativeFuelListLoading,
        alternativeFuelListDto,
        showAll, setShowAll,
        visibleCarriers,
        hiddenCount,
        country, setCountry,
        configConstants,
        handleChangeCarrier,
        carrierList,
        alternativeCarrierList,
        isLoadingTotalEmissionsbyCarrierList,
        totalEmissionsbyCarrierListData,
        mileagebyCarrierListData,
        isLoadingMileagebyCarrierList,
        fuelTypeEmissions, setFuelTypeEmissions,
        fuelTypeMileage, setFuelTypeMileage,
        setLaneAccordion,
        setCarrierAccordion,
        activeKey, setActiveKey,
        resetFiltersAndPagination,
        schneider,
        type,
        setType,
        isLoadingSchneider,
        setSchneider,
        schneiderData,
        loginDetails,
        emissionSavedFilters
    } = AlternativeFuelController();

    const fuelOptions = getDropDownOptions(alternativeFuelListDto?.data, "name", "id", "All Fuel Types", "", false);
    const defaultUnit = configConstants?.data?.default_distance_unit
    const pageTitle = schneider ? 'Schneider RD Report' : "Alternative Fuels Dashboard"

    return (
        <>
            <TitleComponent
                title={pageTitle}
                pageHeading={pageTitle}
            />
            <section className='alternativeFuel-screen pb-3 pt-2 px-2' data-testid="alternative-fuel-view">
                <div className='mb-3 d-sm-flex flex-wrap gap-2 select-box border-bottom pb-3 d-flex justify-content-between align-items-center'>
                    <CountryFilter
                        country={{ value: country, label: countryListDto(emissionSavedFilters?.data?.countryData)?.find((el: any) => el.value === country)?.label }}
                        year={{ value: year, label: year }}
                        month={{ value: month, label: monthOption?.find((el: any) => el.value === month)?.label ?? 'All Months' }}
                        tblSlug="LAFT"
                        schneider={schneider}
                        type={type}
                        handleUpdateCountry={(e) => {
                            setCountry(e.value)
                            setYear(Number.parseInt(configConstants?.data?.alternative_fuel_default_year));
                            setMonth(Number.parseInt(configConstants?.data?.alternative_fuel_default_month))

                        }}
                        handleUpdateMonth={(e) => {
                            setMonth(e?.value)
                            resetFiltersAndPagination()

                        }}
                        handleUpdateyear={(e) => {
                            setYear(e?.value)
                            setMonth(0)
                            resetFiltersAndPagination()

                        }}
                        handleUpdateType={(e) => {
                            setType(e?.value)
                            resetFiltersAndPagination()
                        }}
                    />


                    {isCompanyEnable(loginDetails?.data, [companySlug?.pep]) && <div className="d-flex align-items-center gap-2" data-toggle="tooltip" data-placement="top" title={'Schneider'}>
                        <Button className={`btn-transparent ev-master companyBtn ${schneider ? "active" : ""}`} onClick={() => setSchneider(!schneider)}>
                            <ImageComponent path="/images/company_logo/schneider-national.png" className='w-75' />

                            {schneider && <ButtonComponent imagePath="/images/cross.svg" btnClass='btn-transparent'> </ButtonComponent>}

                        </Button>
                    </div>}
                </div>
                {schneider ?
                    <Schneider
                        schneiderData={schneiderData}
                        isLoadingSchneider={isLoadingSchneider}
                        month={month}
                        year={year}
                        monthOption={monthOption}
                        type={typeOptionListDto?.find((el: any) => el.value === type)}
                    />
                    : <>
                        <div className='mb-3 p-3 select-box select-carrier'>
                            <Heading level="3" content="Selected Carriers" className="font-xxl-18 font-16 fw-medium mb-3" />
                            <div className='mb-3 d-flex'>
                                <MultiSelect
                                    key="example_id"
                                    placeHolder="Select carrier"
                                    isSearchable={true}
                                    className="selectFuel-dropdown"
                                    aria-label="multi-carrier-dropdown"
                                    options={carrierList}
                                    onChange={handleChangeCarrier}
                                    selectedOptions={carrierList?.filter((item: any) => selectedCarrier?.includes(item?.value))}
                                    menuPlacement={"bottom"}
                                    isClearable={false}
                                    disableClear={true}
                                    clearMessage="Selected carrier"
                                />
                            </div>

                            {alternativeCarrierList?.data?.length === 0 ? (
                                <div className="text-center my-3">No carrier found</div>
                            ) : (
                                <div className='d-flex flex-wrap align-items-center gap-2 carrier-items'>
                                    <div className='d-flex flex-wrap gap-2 align-items-center'>
                                        {visibleCarriers?.map((carrier: any) => (
                                            <div key={carrier?.scac} className="d-flex align-items-center gap-2" data-toggle="tooltip" data-placement="top" title={carrier?.name}>
                                                <Button data-testid={`carrier-${carrier?.scac}`} className='btn-transparent ev-master' onClick={() => handleCarrierChange(carrier?.scac)}>
                                                    <Logo path={carrier?.image} name={carrier?.scac} />
                                                    <Button className="btn-transparent p-0">
                                                        <ImageComponent path="/images/cross.svg" className="pe-0" />
                                                    </Button>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {!showAll && hiddenCount > 0 && (
                                        <ButtonComponent btnClass="moreContent font-16 fw-medium" onClick={() => setShowAll(true)}>
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
                            )}
                        </div>

                        <div className="reagionCards mb-3">
                            <Heading level="5" content="Key Metrics" className="font-18 font-xxl-20 fw-semibold mb-3" />
                            <Row className='g-3'>
                                <Col md={getMdClass(checkSelectedCarrier(selectedCarrier))}>
                                    <SustainViewCard
                                        isLoading={keyMetricsAlternativeDtoLoading}
                                        cardValue={formatNumber(
                                            true,
                                            keyMetricsAlternativeDto?.data?.totalLanes,
                                            0
                                        )}
                                        cardDate="Total Lanes"
                                        imagePath="/images/total-lanes.svg"
                                        isLoadingTestid="total-lanes-card"
                                    />
                                </Col>
                                <Col md={getMdClass(checkSelectedCarrier(selectedCarrier))}>
                                    <SustainViewCard
                                        isLoading={keyMetricsAlternativeDtoLoading}
                                        cardValue={formatNumber(
                                            true,
                                            keyMetricsAlternativeDto?.data?.totalShipments,
                                            0
                                        )}
                                        cardDate="Total Shipments"
                                        imagePath="/images/total-shipments.svg"
                                        isLoadingTestid="total-shipment-card"
                                    />
                                </Col>
                                {!checkSelectedCarrier(selectedCarrier) && (
                                    <Col md="4">
                                        <SustainViewCard
                                            isLoading={keyMetricsAlternativeDtoLoading}
                                            cardValue={formatNumber(
                                                true,
                                                keyMetricsAlternativeDto?.data?.totalEmissions,
                                                2
                                            )}
                                            cardDate="Total Emissions"
                                            cardSubHeading="tCO2e"
                                            imagePath="/images/co2e-img.svg"
                                            isLoadingTestid="total-emission-card"
                                        />
                                    </Col>
                                )}

                            </Row>
                        </div>
                        <div className='mb-3'>
                            <Row className='g-3'>
                                <Col lg={checkSelectedCarrier(selectedCarrier) ? 12 : 6}>
                                    <div className='mainGrayCards pb-3 h-100'>
                                        <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                                            <Heading level="5" content="List of All Lanes by Shipments" className="font-18 font-xxl-20 fw-semibold mb-0" />
                                            <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                        </div>
                                        <div className="static-table listLane ">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className='w-auto'>
                                                            Origin
                                                        </th>
                                                        <th>
                                                            Destination
                                                        </th>
                                                        <th className='w-auto' onClick={handleChangeOrderShipment}>
                                                            Total Shipments <span data-testid="change-order-shipment">
                                                                <ImageComponent
                                                                    className="pe-0"
                                                                    imageName={`${sortIcon(
                                                                        "shipment",
                                                                        "shipment",
                                                                        orderShipment
                                                                    )}`}
                                                                />
                                                            </span>

                                                        </th>
                                                    </tr>
                                                </thead>
                                                <TableBodyLoad noDataMsg="No Lanes Found" isLoading={listOfAllLanesByShipmentsDtoLoading} colSpan={3} isData={listOfAllLanesByShipmentsDto?.data?.list?.length > 0}>
                                                    <tbody data-testid="lanes-by-shipment">
                                                        {listOfAllLanesByShipmentsDto?.data?.list?.map((res: any) => (

                                                            <tr key={res?.lane_name}>
                                                                <td>
                                                                    {res?.lane_name?.split("_")[0]}
                                                                </td>
                                                                <td>
                                                                    {res?.lane_name?.split("_")[1]}
                                                                </td>
                                                                <td>
                                                                    {formatNumber(
                                                                        true,
                                                                        res?.shipment,
                                                                        0
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </TableBodyLoad>
                                            </table>
                                        </div>
                                        <Pagination
                                            currentPage={currentShipmentPage}
                                            pageSize={{ value: 7 }}
                                            isShowPageSize={false}
                                            total={listOfAllLanesByShipmentsDto?.data?.pagination?.total_count}
                                            handlePageChange={(page: number) => {
                                                setCurrentShipmentPage(page);
                                            }}
                                        />
                                    </div>
                                </Col>
                                {!checkSelectedCarrier(selectedCarrier) && (
                                    <Col lg="6">
                                        <div className='mainGrayCards pb-3 h-100'>
                                            <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                                                <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0" >Total Emissions by Fuel Type <span className='font-xxl-16 font-14 fw-normal'>(tCO2e)</span></Heading>
                                                <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                            </div>
                                            <div className='p-3 pb-0'>
                                                <ChartHighChart
                                                    loadingTestId="high-chart-emission-intensity-loader"
                                                    testId="high-chart-emission-intensity"
                                                    database={totalEmissionGraphByLaneAndFuelType?.data?.options?.length > 0}
                                                    classname=''
                                                    options={barchartRNG({
                                                        chartType: 'column',
                                                        options: totalEmissionGraphByLaneAndFuelType?.data?.options || [],
                                                        title: 'Emissions Impact Lanes',
                                                        yTitle: 'Total Emissions (tCO2e)',
                                                        xTitle: 'Fuel Type',
                                                        showXtitle: true
                                                    })}
                                                    constructorType=""
                                                    isLoading={totalEmissionGraphByLaneAndFuelTypeLoading}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                )}
                                <Accordion activeKey={activeKey} onSelect={(key: any) => setActiveKey(key)}>
                                    <Accordion.Item eventKey="0" className='mb-3' onClick={() => setLaneAccordion(true)}>
                                        <Accordion.Header>By Lane and Fuel Type Graphs</Accordion.Header>
                                        <Accordion.Body className="mainGrayCards p-0">

                                            {!checkSelectedCarrier(selectedCarrier) && (
                                                <>
                                                    <div className='pb-3 border-bottom'>
                                                        <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                                                            <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0" >Total Emissions by Lane and Fuel Type <span className='font-xxl-14 font-12 fw-normal'>(Top 15 Only)</span></Heading>
                                                            <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                                        </div>
                                                        <div className='p-3 pb-0'>
                                                            <ChartHighChart
                                                                loadingTestId="high-chart-emission-intensity-loader"
                                                                testId="high-chart-emission-intensity"
                                                                database={lanesByFuelStackeByEmissionsDto?.data?.categories?.length > 0}
                                                                classname=''
                                                                options={stackChart({
                                                                    chartType: 'column',
                                                                    categories: lanesByFuelStackeByEmissionsDto?.data?.categories,
                                                                    options: lanesByFuelStackeByEmissionsDto?.data?.options,
                                                                    title: 'Emissions Impact Lanes',
                                                                    yTitle: 'Total Emissions (tCO2e)',
                                                                    xTitle: '',
                                                                    showXtitle: true,
                                                                    roundUpto: 2,
                                                                    isXLabelLaneName: true,
                                                                })}
                                                                constructorType=""
                                                                isLoading={lanesByFuelStackeByEmissionsDtoLoading}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='pb-3 border-bottom'>
                                                        <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                                                            <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0">Quantity of Fuel by Lane and Fuel Type <span className='font-xxl-14 font-12 fw-normal'>(Top 15 Only)</span></Heading>
                                                            <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                                        </div>
                                                        <div className='p-3 pb-0'>
                                                            <ChartHighChart
                                                                loadingTestId="high-chart-emission-intensity-loader"
                                                                testId="high-chart-emission-intensity"
                                                                database={lanesByFuelStackeByQuantityDto?.data?.categories?.length > 0}
                                                                classname=''
                                                                options={stackChart({
                                                                    chartType: 'column',
                                                                    categories: lanesByFuelStackeByQuantityDto?.data?.categories,
                                                                    options: lanesByFuelStackeByQuantityDto?.data?.options,
                                                                    title: 'Emissions Impact Lanes',
                                                                    yTitle: 'Fuel Quantity (in Gallons)',
                                                                    xTitle: '',
                                                                    showXtitle: true,
                                                                    roundUpto: 1,
                                                                    isXLabelLaneName: true,

                                                                })}
                                                                constructorType=""
                                                                isLoading={lanesByFuelStackeByQuantityDtoLoading}
                                                            />
                                                        </div>
                                                    </div>

                                                </>
                                            )}
                                            <div className='pb-0'>
                                                <div className='headingLine p-3 border-bottom d-flex justify-content-between gap-1 align-items-center'>
                                                    <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0">Mileage by Lane and Fuel Type <span className='font-xxl-14 font-12 fw-normal'>(Top 15 Only)</span></Heading>
                                                    <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                                </div>
                                                <div className='p-3 px-0'>
                                                    <ChartHighChart
                                                        loadingTestId="high-chart-emission-intensity-loader"
                                                        testId="high-chart-emission-intensity"
                                                        database={lanesByFuelStackeByMileageDto?.data?.categories?.length > 0}
                                                        classname=''
                                                        options={stackChart({
                                                            chartType: 'column',
                                                            categories: lanesByFuelStackeByMileageDto?.data?.categories,
                                                            options: lanesByFuelStackeByMileageDto?.data?.options,
                                                            title: 'Emissions Impact Lanes',
                                                            yTitle:
                                                                `Mileage (${formatUnit(defaultUnit)})`,
                                                            xTitle: '',
                                                            showXtitle: true,
                                                            roundUpto: 1,
                                                            isXLabelLaneName: true,
                                                            xValue: -700,
                                                        })}
                                                        constructorType=""
                                                        isLoading={lanesByFuelStackeByMileageDtoLoading}
                                                    />
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1" onClick={() => setCarrierAccordion(true)}>
                                        <Accordion.Header>Carrier Graphs</Accordion.Header>
                                        <Accordion.Body className=" mainGrayCards p-0">
                                            <div className='pb-3 border-bottom'>
                                                <div className='headingLine p-3 border-bottom d-flex  flex-wrap justify-content-between gap-1 align-items-center'>
                                                    <div className='select-box d-flex gap-2 align-items-center'>
                                                        <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0">Total Shipments of Carriers by Fuel Type</Heading>
                                                        <SelectDropdown
                                                            aria-label="fuel-dropdown"
                                                            placeholder="Fuel Type"
                                                            options={fuelOptions}
                                                            selectedValue={fuelType}
                                                            onChange={setFuelType}
                                                            disabled={alternativeFuelListLoading}
                                                        />
                                                    </div>

                                                    <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                                </div>
                                                <div className='p-3 pb-0'>
                                                    <ChartHighChart
                                                        database={alternativeFuelTotalShipmentsDto?.data?.length > 0}
                                                        options={
                                                            multiBarChart(
                                                                {
                                                                    yTitle: 'Total Shipment (Count)',
                                                                    xTitle: 'Carriers',
                                                                    options: alternativeFuelTotalShipmentsDto?.data,
                                                                    yKey: "total_shipments",
                                                                    xKey: "name",
                                                                    decimalPlace: 0,
                                                                    barColor: (styles.primary),
                                                                    isTooltip: true,
                                                                }
                                                            )
                                                        }
                                                        constructorType=""
                                                        isLoading={alternativeFuelTotalShipmentsLoading}
                                                    />
                                                </div>
                                            </div>
                                            <div className='pb-3 border-bottom'>
                                                <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                                                    <div className='select-box d-flex gap-2 align-items-center'>
                                                        <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0">Total Emissions of Carriers by Fuel Type</Heading>
                                                        <SelectDropdown
                                                            aria-label="fuel-dropdown"
                                                            placeholder="Fuel Type"
                                                            options={fuelOptions}
                                                            selectedValue={fuelTypeEmissions}
                                                            onChange={setFuelTypeEmissions}
                                                            disabled={isLoadingTotalEmissionsbyCarrierList}
                                                        />
                                                    </div>

                                                    <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                                </div>
                                                <div className='p-3 pb-0'>
                                                    <ChartHighChart
                                                        database={totalEmissionsbyCarrierListData?.data?.length > 0}
                                                        options={
                                                            multiBarChart(
                                                                {
                                                                    yTitle: 'Total Emissions (tCO2e)',
                                                                    xTitle: 'Carriers',
                                                                    options: totalEmissionsbyCarrierListData?.data,
                                                                    yKey: "emission",
                                                                    xKey: "name",
                                                                    decimalPlace: 2,
                                                                    barColor: (styles.primary),
                                                                    isTooltip: true,
                                                                }
                                                            )
                                                        }
                                                        constructorType=""
                                                        isLoading={isLoadingTotalEmissionsbyCarrierList}
                                                    />
                                                </div>
                                            </div>
                                            <div className='pb-3'>
                                                <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                                                    <div className='select-box d-flex gap-2 align-items-center'>
                                                        <Heading level="5" className="font-18 font-xxl-20 fw-semibold mb-0">Mileage by Carriers and Fuel Type</Heading>
                                                        <SelectDropdown
                                                            aria-label="fuel-dropdown"
                                                            placeholder="Fuel Type"
                                                            options={fuelOptions}
                                                            selectedValue={fuelTypeMileage}
                                                            onChange={setFuelTypeMileage}
                                                            disabled={isLoadingMileagebyCarrierList}
                                                        />
                                                    </div>
                                                    <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                                </div>
                                                <div className='p-3 pb-0'>
                                                    <ChartHighChart
                                                        database={mileagebyCarrierListData?.data?.length > 0}
                                                        options={
                                                            multiBarChart(
                                                                {
                                                                    yTitle: `Mileage (${formatUnit(defaultUnit)})`,
                                                                    xTitle: 'Carriers',
                                                                    options: mileagebyCarrierListData?.data,
                                                                    yKey: "fuel_mileage",
                                                                    xKey: "name",
                                                                    decimalPlace: 1,
                                                                    barColor: (styles.primary),
                                                                    isTooltip: true,
                                                                }
                                                            )
                                                        }
                                                        constructorType=""
                                                        isLoading={isLoadingMileagebyCarrierList}
                                                    />
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>

                                <Col lg="12">
                                    <div className=''>
                                        <div className='mainGrayCards pb-3'>
                                            <div className='headingLine p-3 border-bottom d-flex flex-wrap justify-content-between gap-1 align-items-center'>
                                                <Heading level="5" content="List of All Lanes" className="font-18 font-xxl-20 fw-semibold mb-0" />
                                                <Heading level="5" className="font-14 fw-medium mb-0" ><ShowData month={month} monthOption={monthOption} year={year} /></Heading>
                                            </div>
                                            <div className='headingLine p-3 d-flex justify-content-end flex-wrap gap-2 align-items-center'>

                                                <div>
                                                    <Form className='d-flex flex-wrap gap-3'>
                                                        {alternativeFuelFiltersDto?.data?.map((fuel: any) => (
                                                            <FormGroup key={fuel.id} check>
                                                                <Input data-testid={`${fuel?.name}-fuel-type`} type="checkbox" checked={laneFuelType[fuel.id]} onChange={(e) => handleLaneFuelType(e, fuel?.id)} />
                                                                <Heading className="font-xxl-16 font-14 fw-medium" content={fuel.name} level="6" />
                                                            </FormGroup>
                                                        ))}
                                                    </Form>

                                                </div>
                                            </div>
                                            <div className="static-table listLane">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                Origin
                                                            </th>
                                                            <th>
                                                                Destination
                                                            </th>
                                                            <th>
                                                                Fuel Type
                                                            </th>
                                                            {!checkSelectedCarrier(selectedCarrier) && (
                                                                <th onClick={() => handleChangeOrder("fuel_consumption")}>
                                                                    Fuel Consumption <span className='fw-normal font-10'>(Gallons)</span>
                                                                    <span data-testid="change-order-fuel_consumption">
                                                                        <ImageComponent
                                                                            className="pe-0"
                                                                            imageName={`${sortIcon(
                                                                                "fuel_consumption",
                                                                                colName,
                                                                                order
                                                                            )}`}
                                                                        />
                                                                    </span>
                                                                </th>
                                                            )}
                                                            <th onClick={() => handleChangeOrder("fuel_mileage")}>
                                                                Mileage <span className='fw-normal font-10'>({formatUnit(defaultUnit)})</span>
                                                                <span data-testid="change-order-fuel_mileage">
                                                                    <ImageComponent
                                                                        className="pe-0"
                                                                        imageName={`${sortIcon(
                                                                            "fuel_mileage",
                                                                            colName,
                                                                            order
                                                                        )}`}
                                                                    />
                                                                </span>
                                                            </th>
                                                            {!checkSelectedCarrier(selectedCarrier) && (

                                                                <th onClick={() => handleChangeOrder("emission")}>
                                                                    Total Emissions<span className='fw-normal font-10'>(tCO2e)</span>
                                                                    <span data-testid="change-order-emission">
                                                                        <ImageComponent
                                                                            className="pe-0"
                                                                            imageName={`${sortIcon(
                                                                                "emission",
                                                                                colName,
                                                                                order
                                                                            )}`}
                                                                        />
                                                                    </span>
                                                                </th>
                                                            )}

                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <TableBodyLoad noDataMsg="No Lanes Found" isLoading={lanesByFuelUsageAndMileageDtoLoading} colSpan={checkSelectedCarrier(selectedCarrier) ? 5 : 7} isData={lanesByFuelUsageAndMileageDto?.data?.list?.length > 0}>
                                                        <tbody>
                                                            {lanesByFuelUsageAndMileageDto?.data?.list?.map((res: any) => (
                                                                <tr data-testid={`${res?.lane_name}_${res?.fuel_type}`}
                                                                    onClick={() => {
                                                                        executeScroll(myRef)
                                                                        getLaneName(res)
                                                                    }}
                                                                    key={`${res?.lane_name}_${res?.fuel_type}`}
                                                                    className={laneName?.source === `${res?.lane_name}_${res?.fuel_type}` ? 'activeRow' : ''}>
                                                                    <td>
                                                                        {res?.lane_name?.split("_")[0]}
                                                                    </td>
                                                                    <td>
                                                                        {res?.lane_name?.split("_")[1]}
                                                                    </td>

                                                                    <td>
                                                                        {res?.fuel_type}
                                                                    </td>
                                                                    {!checkSelectedCarrier(selectedCarrier) && (
                                                                        <td>

                                                                            {res?.fuel_consumption ? formatNumber(
                                                                                true,
                                                                                res?.fuel_consumption,
                                                                                1
                                                                            ) : 'N/A'}
                                                                        </td>
                                                                    )}
                                                                    <td>
                                                                        {formatNumber(
                                                                            true,
                                                                            distanceConverterInterModal(res?.fuel_mileage,
                                                                                defaultUnit),
                                                                            2)}
                                                                    </td>
                                                                    {!checkSelectedCarrier(selectedCarrier) && (

                                                                        <td>
                                                                            {res?.emission ? formatNumber(
                                                                                true,
                                                                                res?.emission,
                                                                                2
                                                                            ) : "N/A"}
                                                                        </td>
                                                                    )}
                                                                    <td>
                                                                        <div className='d-flex gap-2 align-items-center cursor' >
                                                                            <ImageComponent
                                                                                path="/images/viewFile-lane.svg"
                                                                                alt="files"
                                                                                className='pe-0'
                                                                            />
                                                                            View
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </TableBodyLoad>
                                                </table>
                                            </div>
                                            <Pagination
                                                currentPage={currentPage}
                                                pageSize={pageSize}
                                                total={lanesByFuelUsageAndMileageDto?.data?.pagination?.total_count}
                                                handlePageSizeChange={(e: any) => {
                                                    handlePageChange(e);
                                                }}
                                                handlePageChange={(page: number) => {
                                                    setCurrentPage(page);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="12" className='map-outer'>
                                    {(laneName && lanesByFuelUsageAndMileageDto?.data?.list?.length > 0) &&
                                        <div ref={myRef} className={`mb-3 alternativeMap ${isLoadinglaneStatistics ? "loading" : ""}`}>
                                            <MapComponent isLoading={isLoadinglaneStatistics} showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true} modalClass="bioFuel-map alternative-map">
                                                <GoogleMapLaneView
                                                    reloadData={false}
                                                    origin={laneName?.origin}
                                                    destination={laneName?.destination}
                                                    laneInfo={laneName?.dto}
                                                    isLoading={isLoadinglaneStatistics}
                                                    isShowEmission={!checkSelectedCarrier(selectedCarrier)}
                                                    defaultUnit={defaultUnit}
                                                />
                                            </MapComponent>
                                        </div>
                                    }
                                </Col>
                            </Row>

                        </div>
                    </>
                }
            </section >
        </>
    )
}

export default AlternativeFuelView                                                                          