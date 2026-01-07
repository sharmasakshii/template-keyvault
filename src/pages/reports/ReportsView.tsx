import SearchODPair from 'component/forms/searchODpair/SearchODPair'
import TitleComponent from 'component/tittle'
import { Form, Label, Input, Row, Col, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Button, Table, Spinner } from "reactstrap";
import ReportsController from './reportsController'
import ImageComponent from "component/images"
import ButtonComponent from 'component/forms/button';
import Heading from 'component/heading';
import SustainViewCard from 'component/cards/sustainabilityTracker';
import MapComponent from 'component/map/MapComponent';
import Pagination from 'component/pagination';
import TableBodyLoad from 'component/tableBodyHandle';
import { distanceConverter, formatNumber, getLowHighImage, sortIcon, kmToMilesConst, executeScroll, getGraphTitle, sortList, getTimeCheck, isCompanyEnable, encryptFuelType, formatPerUnit, formatUnit } from 'utils';
import { FuelStopRadiusComponent } from 'pages/lanePlanning/LaneFilterComponent';
import OptimusMap from 'component/map/OptimusMap';
import CarrierRankingTooltip from "component/carrierRankingTooltip";
import Logo from "component/logo";
import { Accordion } from "react-bootstrap";
import { millionT, evEmissionT, companySlug, fuelSlug } from "constant";
import DateFilter from 'component/forms/dateFilter';
import RegionFilter from 'component/forms/regionFilter';
import { setDivisionId, setRegionalId } from 'store/auth/authDataSlice';
import IntermodalLaneMap from 'component/map/IntermodalLaneMap';
import InputField from 'component/forms/input';
import { Link } from "react-router-dom";


const getCarrierEmissions = (fuelDto: any, carrierDto: any, laneDto: any) => {
    return fuelDto?.value === "eddv" ? (carrierDto?.intensity * evEmissionT * (laneDto?.distance * kmToMilesConst)) / millionT : carrierDto?.emissions
}

const getCarrierEmissionsSave = (fuelDto: any, carrierDto: any, laneDto: any, configConstants: any) => {
    return fuelDto?.value === "ev" ? carrierDto?.emissions * (((Number.parseInt(configConstants?.data?.ev_intensity) - carrierDto?.intensity) / carrierDto?.intensity)) : ((carrierDto?.emissions * laneDto?.emission_reduction) / 100)
}


const carrierEmissionDataList = (list: any[], selectedFuelOption: any, lane: any, configConstants: any, colName: string, order: string) => {
    // Ensure list is always an array
    const normalizedList = Array.isArray(list) ? list : [];

    const enrichedList = normalizedList.map((data) => ({
        ...data,
        carrierEmissions: getCarrierEmissions(selectedFuelOption, data, lane),
        carrierEmissionsSave: getCarrierEmissionsSave(selectedFuelOption, data, lane, configConstants),
    }));

    return sortList(enrichedList, colName, order);
};


const ReportsView = () => {
    const {
        isRBCompany,
        isPEPCompany,
        childRef,
        handleChangeLocation,
        handleResetODpair,
        pageSize,
        setCurrentPage,
        currentPage,
        showFuelStopRadius,
        handleClose,
        configConstants,
        showFullScreen,
        setShowFullScreen,
        handleFuelChange,
        selectedFuelOption,
        configConstantsIsLoading,
        reportKeyMatrixData,
        isLoadingKeyMatrix,
        reportLaneData,
        isLoadingReportLaneData,
        setPageSize,
        handleViewLane,
        myRef,
        sortColumn,
        sortOrder,
        handleLaneSort,
        selectedLane,
        optimusCordinatesData,
        optimusCordinatesLoading,
        handleGetLanesData,
        loginDetails,
        carrierEmissionData,
        isCarrierEmissionDataLoading,
        pId,
        setPId,
        divisionOptions,
        divisionLevel,
        setDivisionLevel,
        weekId,
        setWeekId,
        yearlyData, setYearlyData,
        regionalLevel, setRegionalLevel,
        quarterDetails, setQuarterDetails,
        regionOption,
        regions, divisions, timePeriodList,
        carrierOrder,
        carrierColName,
        handleCarrierLaneSort,
        tableRef,
        dispatch,
        timeId,
        navigate,
        originCityIntermodal,
        destinationCityIntermodal,
        handleToggle,
        radiusOptions,
        radius,
        handleRadiusChange,
        activeLane,
        handleThresholdChange,
        handleBlur,
        isCheckLaneFuelLoading,
        reportListDto
    } = ReportsController()

    const defaultUnit = configConstants?.data?.default_distance_unit
    const graphTitle = getGraphTitle({
        year: yearlyData,
        regionId: regionalLevel,
        division: divisionLevel,
        pId: pId,
        weekId: weekId,
        quarter: quarterDetails,
        regionList: regions,
        divisionList: divisions,
        timeList: timePeriodList,
        loginDetails
    })

    const getWidth = (isCompany: boolean) => isCompany ? 'w-auto' : 'w-100'

    return (
        <>
            <TitleComponent title={"Decarb Discovery"} pageHeading={`Decarb Discovery`} />
            <div className="reports-screen pb-4 px-2 pt-2 text-start">
                <div data-testid="reports-screen" className='d-flex flex-wrap justify-content-between align-items-center mb-3'>
                    <Heading level="4" className="font-xxl-24 font-20 fw-semibold mb-0" content={`Emissions Reduction Reports for ${graphTitle}`} />
                    <div className='text-end'>
                        <ButtonDropdown data-testid="fuel-stop-radius" isOpen={showFuelStopRadius} toggle={handleClose}>
                            <DropdownToggle caret>
                                Fuel Stops Radius Configuration
                            </DropdownToggle>
                            <DropdownMenu className={"action-btnlist flex-column gap-2 mt-1"}>
                                <DropdownItem className="lineBottom">
                                    <FuelStopRadiusComponent radius={radius} configConstants={configConstants} loginDetails={loginDetails} />
                                </DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </div>
                </div>
                <div className='pt-0'>
                    <div className='grid-type p-3 mb-3'>
                        <div className="select-box d-flex flex-wrap gap-1">
                            <RegionFilter
                                isDisabled={optimusCordinatesLoading}
                                regionAriaLabel="region-dropdown"
                                regionOption={regionOption}
                                divisionOptions={divisionOptions}
                                regionalLevel={regionalLevel}
                                divisionLevel={divisionLevel}
                                handleChangeDivision={(e: any) => {
                                    setDivisionLevel(e.value)
                                    dispatch(setDivisionId(e.value))
                                    setRegionalLevel("");
                                    dispatch(setRegionalId(""))
                                    setCurrentPage(1);
                                    setPageSize({ label: 10, value: 10 });
                                }}
                                handleChangeRegion={(e: any) => {
                                    setRegionalLevel(e.value);
                                    dispatch(setRegionalId(e.value))
                                    setCurrentPage(1);
                                    setPageSize({ label: 10, value: 10 });
                                }}
                            />
                            {/* Dropdown for selecting yearly data */}
                            <DateFilter
                                yearDropDownId="year-dropdown"
                                quarterDropDownId="quarter-dropdown"
                                isLoading={optimusCordinatesLoading}
                                yearlyId={yearlyData}
                                quarterId={quarterDetails}
                                pId={pId}
                                setPId={setPId}
                                weekId={weekId}
                                setWeekId={setWeekId}
                                updateYear={(e: any) => {
                                    setYearlyData(e.value)
                                    setQuarterDetails(0)
                                    setPId(0)
                                    setWeekId(0)
                                    setCurrentPage(1);
                                    setPageSize({ label: 10, value: 10 });
                                }}
                                updateQuarter={(e: any) => {
                                    setQuarterDetails(e.value)
                                    setPId(0)
                                    setWeekId(0)
                                    setCurrentPage(1);
                                    setPageSize({ label: 10, value: 10 });
                                }}
                                setCurrentPage={setCurrentPage}
                                setPageSize={setPageSize}
                            />
                        </div>
                    </div>
                    <div className='grid-type p-3'>
                        <Form className="whiteSpace">
                            <Row className='g-3'>
                                {[
                                    {
                                        heading: "Alternative Fuels",
                                        buttonData: [
                                            { key: fuelSlug.b1_20, label: 'Upto B20', value: "bio_1_20", image: "/images/b1Fuel.svg", companyEnable: true },
                                            { key: fuelSlug?.b21_99, label: 'B21 to B99', value: "bio_21_99", image: "/images/b20-b99.svg", companyEnable: true },
                                            { key: fuelSlug?.b100, label: 'B100', value: "bio_100", image: "/images/b100Fuel.svg", companyEnable: true },
                                            { key: fuelSlug?.optimus, label: 'Optimus', value: "optimus", image: "/images/rng-icon.svg", companyEnable: isCompanyEnable(loginDetails?.data, [companySlug?.pep]) },
                                            { key: fuelSlug?.rd, label: 'RD', value: 'rd', image: "/images/rd-icon.svg", companyEnable: true },
                                            { key: fuelSlug?.rng, label: 'RNG', value: "rng", image: "/images/rng-icon-new.svg", companyEnable: true },
                                            { key: fuelSlug?.hvo, label: 'HVO', value: "hvo", image: "/images/hvoFuel-icon.svg", companyEnable: isCompanyEnable(loginDetails?.data, [companySlug?.pep]) },
                                            { key: fuelSlug?.hydrogen, label: 'Hydrogen', value: "hydrogen", image: "/images/hydrogen-icon.svg", companyEnable: isCompanyEnable(loginDetails?.data, [companySlug?.demo, companySlug?.pep]) },
                                            { key: fuelSlug?.b99, label: 'B99', value: "b99", image: "/images/b99.svg", companyEnable: isCompanyEnable(loginDetails?.data, [companySlug?.demo]) },
                                        ]
                                    },

                                    // 👇 Electric comes before Transportation now
                                    ...(isCompanyEnable(loginDetails?.data, [companySlug?.pep]) ? [{
                                        heading: "Electric", classTxt: "electric",
                                        buttonData: [
                                            { key: fuelSlug?.ev, label: 'EV Grid', id: '297', value: "ev", image: "/images/grid-icon.svg", companyEnable: true, disabled: isCompanyEnable(loginDetails?.data, [companySlug?.demo]) },
                                            { key: 'EV_CAPTIVE', label: 'EV Captive', value: "captive", image: "/images/captive-icon.svg", companyEnable: true, disabled: true },
                                            { key: 'EV_RENEWABLE', label: 'EV Renewable', value: "renewable", image: "/images/renewable-icon.svg", companyEnable: true, disabled: true }
                                        ]
                                    }] : []),

                                    {
                                        heading: "Transportation Modes",
                                        buttonData: [
                                            { key: 'intermodal', label: 'Modal Shift', value: "is_intermodal", image: "/images/rail-icon.svg", companyEnable: true },
                                        ]
                                    },

                                ].map((radioData) => (
                                    <Col lg={isRBCompany ? 12 : 6} key={radioData.heading}>
                                        <div
                                            className={`h-100 ${radioData.classTxt ? "electric" : ""} 
                                             ${(isPEPCompany && radioData.heading !== "Transportation Modes") ? "fuel-outer" : ""}`}
                                        >
                                            <Heading level="3" className="font-16 fw-semibold mb-3" content={radioData.heading} />
                                            <div className='d-flex flex-wrap gap-2 fuel-innner-div'>
                                                {radioData?.buttonData?.filter((el: any) => el.companyEnable).map((option: any) => (
                                                    <div key={option?.key}>
                                                        <Button
                                                            data-testid={`fuel-${option.key}`}
                                                            onClick={() => handleFuelChange(option)}
                                                            disabled={option?.disabled || isLoadingReportLaneData || configConstantsIsLoading}
                                                            className={`fuel-inner cursor ${selectedFuelOption?.value === option?.value ? "active" : ""}`}
                                                        >
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="fuelOptions"
                                                                    value={option.value}
                                                                    checked={selectedFuelOption?.value === option.value}
                                                                    onChange={(e: any) => e.stopPropagation()}
                                                                    data-testid={`fuel-option-${option.value}`}
                                                                />{" "}
                                                                {option?.label}
                                                            </Label>
                                                            <ImageComponent tooltipTitle={option.key} path={option.image} className="pe-0 ps-1 fuelIcon" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Form>
                    </div>
                </div>

                <div className='mt-3'>
                    <div className="reagionCards mb-3">
                        {selectedFuelOption?.value !== "is_intermodal" && (
                            <Row className='g-3'>
                                <Col md="6">
                                    <SustainViewCard
                                        className="rdimg"
                                        isLoading={isLoadingKeyMatrix || configConstantsIsLoading}
                                        cardValue={`${radius || 0} 
                                        ${formatPerUnit(defaultUnit)}
                                        `}
                                        cardDate={`${selectedFuelOption?.label} Stations Radius Configuration`}
                                        imagePath={selectedFuelOption.image}
                                    />
                                </Col>
                                <Col md="6">
                                    <SustainViewCard
                                        isLoading={isLoadingKeyMatrix || configConstantsIsLoading}
                                        cardValue={`${formatNumber(true, Math.abs(reportKeyMatrixData?.data?.emission_reduction_percentage), 0)}%`}
                                        cardDate="Avg. Emissions Reduction Opportunity"
                                        imagePath="/images/co2e-img.svg"
                                        imagePathArrow={`/images/${getLowHighImage(reportKeyMatrixData?.data?.emission_reduction_percentage, 0)}`}
                                    />
                                </Col>
                            </Row>
                        )}
                    </div>

                    <div className='mainGrayCards pb-3' ref={tableRef}>
                        <div className='d-flex flex-wrap justify-content-between gap-2 align-items-center mb-3 p-3'>
                            <Heading content="List of all Lanes" className="font-20 fw-semibold" level="3" />
                            <SearchODPair
                                page="laneReport"
                                ref={childRef}
                                handleChangeLocation={handleChangeLocation}
                                handleGetSearchData={handleGetLanesData}
                                handleResetODpair={handleResetODpair}
                                showRadius={true}
                                isDisabled={isLoadingKeyMatrix || isLoadingReportLaneData || !configConstants?.data}
                                odParams={{
                                    fuel_type: selectedFuelOption?.value, radius: configConstants?.data[selectedFuelOption?.value + "_radius"],
                                    region_id: regionalLevel,
                                    division_id: divisionLevel,
                                    ...getTimeCheck(yearlyData, quarterDetails, timeId)
                                }}
                                radiusOptions={radiusOptions}
                                radius={radius}
                                handleRadiusChange={handleRadiusChange}
                            />
                        </div>
                        <div className='mb-4'>
                            <div className="static-table mb-0">
                                <table className="w-100 lanenewTable">
                                    <thead>
                                        <tr className="topRow">
                                            <th className={`${isPEPCompany ? '' : 'w-100'} pointer`} data-testid="name-sort">
                                                <div className="d-flex text-capitalize pointer fw-semibold">
                                                    Lane Name
                                                </div>
                                            </th>

                                            <th className={`${isPEPCompany ? '' : 'w-100'} pointer`} data-testid="intensity-sort-distance" onClick={() => handleLaneSort("distance")}>
                                                <div className="pointer fw-semibold">
                                                    Distance <span><ImageComponent imageName={sortIcon("distance", sortColumn, sortOrder)} className="pe-0" /></span>
                                                    <h6 className="font-10">({formatUnit(configConstants?.data?.default_distance_unit)})</h6>
                                                </div>
                                            </th>
                                            {
                                                isRBCompany ?
                                                    <th className="w-100 pointer" data-testid="intensity-sort-divison">
                                                        <div className="pointer fw-semibold">
                                                            Region Name
                                                        </div>
                                                    </th> : ""
                                            }

                                            {
                                                isPEPCompany ?
                                                    <th className="pointer" data-testid="intensity-sort-divison">
                                                        <div className="pointer fw-semibold">
                                                            Division
                                                        </div>
                                                    </th> :
                                                    ""
                                            }
                                            {
                                                isPEPCompany ?
                                                    <th className="pointer w-auto" data-testid="emission-sort">
                                                        <div className="pointer fw-semibold">
                                                            Business Units
                                                        </div>
                                                    </th> : ""
                                            }

                                            <th className={`${getWidth(isPEPCompany)} pointer`} data-testid="emission-sort-dt" onClick={() => handleLaneSort("emissions")}>
                                                <div className="pointer fw-semibold">
                                                    Total Emissions <span><ImageComponent imageName={sortIcon("emissions", sortColumn, sortOrder)} className="pe-0" /></span>
                                                    <h6 className="font-10">(tCO2e)</h6>
                                                </div>

                                            </th>

                                            {selectedFuelOption?.value !== "is_intermodal" && (
                                                <>
                                                    <th
                                                        className={`${getWidth(isPEPCompany)} pointer`}
                                                        data-testid="emission-sort"
                                                    >
                                                        <div className="pointer fw-semibold">
                                                            Emissions Saved
                                                            <h6 className="font-10">(tCO2e)</h6>
                                                        </div>
                                                    </th>
                                                    <th
                                                        className={`${getWidth(isPEPCompany)} pointer`}
                                                        data-testid="emission-sort"
                                                    >
                                                        <div className="pointer fw-semibold">
                                                            Threshold Distance
                                                            <div className='d-flex align-items-center'>
                                                                <h6 className="font-10 mb-0">(miles)</h6>
                                                                <div className="tooltip-wrapper ps-1">
                                                                    <ImageComponent
                                                                        path="/images/infoPrimary.svg"
                                                                        className="pe-0 cursor-pointer"
                                                                    />

                                                                    <div className="tooltip-box">
                                                                        Availability is determined by the threshold distance you enter.
                                                                        The threshold represents the maximum allowed gap between
                                                                        consecutive fuel stops of the selected fuel type along the lane.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </th>
                                                </>
                                            )
                                            }
                                            <th className={`${getWidth(isPEPCompany)} pointer`}></th>
                                        </tr>
                                    </thead>

                                    <TableBodyLoad noDataMsg="No Lanes Found" isLoading={isLoadingReportLaneData || configConstantsIsLoading} colSpan={selectedFuelOption?.value !== "is_intermodal" ? 8 : 6} isData={reportLaneData?.data?.laneData?.length > 0}>
                                        <tbody className='w-100'>
                                            <tr>
                                                <td colSpan={selectedFuelOption?.value !== "is_intermodal" ? 8 : 6} className='p-0'>
                                                    <Accordion
                                                        className={selectedFuelOption?.value === "is_intermodal" ? "noIconHeader newAccordion" : "newAccordion"}
                                                    >
                                                        {reportListDto?.map((lane: any, index: number) => {
                                                            return <tr key={lane.lane_id} className={`d-block ${selectedLane?.lane_id === lane?.lane_id ? 'activeRow' : ''}`} >
                                                                <Accordion.Item key={lane.lane_id} eventKey={index?.toString()} >
                                                                    <Accordion.Header data-testid={`accordion-header-${index}`} onClick={() => handleToggle(index, lane?.lane_name)}>
                                                                        <td className='customWidth'>
                                                                            <Link className='link-color' to={`/scope3/lane-planning/${lane?.lane_name}/reports/${encryptFuelType([selectedFuelOption?.key])}/${lane?.thresholdDistance}`} >
                                                                                <Heading level="5"
                                                                                    content={lane?.lane_name?.replace("_", " to ")}
                                                                                    className="font-14 font-xxl-16 fw-normal mb-0"
                                                                                />
                                                                            </Link>
                                                                        </td>

                                                                        <td className='customWidth'>
                                                                            <Heading
                                                                                level="4"
                                                                                content={formatNumber(
                                                                                    true,
                                                                                    distanceConverter(lane?.distance,
                                                                                        defaultUnit),
                                                                                    2)}
                                                                                className="font-14 font-xxl-16 fw-normal mb-0"
                                                                            />
                                                                        </td>

                                                                        {isPEPCompany && (
                                                                            <>
                                                                                <td className='customWidth'>
                                                                                    <Heading level="4"
                                                                                        content={lane?.division_names}
                                                                                        className="font-14 font-xxl-16 text-start fw-normal mb-0"
                                                                                    />
                                                                                </td>
                                                                                <td className='customWidth'>
                                                                                    <Heading level="5"
                                                                                        content={lane?.bu_names}
                                                                                        className="font-14 font-xxl-16 text-start fw-normal mb-0"
                                                                                    />
                                                                                </td>
                                                                            </>
                                                                        )}
                                                                        {isRBCompany &&
                                                                            <td className='customWidth'>
                                                                                <Heading level="5"
                                                                                    content={lane?.region_name}
                                                                                    className="font-14 font-xxl-16 text-start fw-normal mb-0"
                                                                                />
                                                                            </td>
                                                                        }


                                                                        <td className='customWidth'>
                                                                            <Heading level="4"
                                                                                content={formatNumber(true, (lane?.emissions / millionT), 2)}
                                                                                className="font-14 font-xxl-16 fw-normal mb-0"
                                                                            />
                                                                        </td>

                                                                        {selectedFuelOption?.value !== "is_intermodal" && (
                                                                            <>
                                                                                <td className="customWidth">
                                                                                    <Heading
                                                                                        level="4"
                                                                                        content={formatNumber(
                                                                                            true,
                                                                                            Math.abs((lane?.emissions - lane?.impact_emissions) / millionT),
                                                                                            2
                                                                                        )}
                                                                                        className="font-14 font-xxl-16 fw-normal mb-0"
                                                                                    />
                                                                                </td>


                                                                                <td className="customWidth" data-testid={`threshold-section-${lane?.lane_id}`}>
                                                                                    {(activeLane === lane?.lane_id && isCheckLaneFuelLoading) ? (
                                                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '38px' }}>
                                                                                            <Spinner spinnerClass="small-spinner" />
                                                                                        </div>
                                                                                    ) : (<div className="d-flex gap-1 align-items-center">
                                                                                        <InputField
                                                                                            type="text"
                                                                                            testid={`threshold-input-${lane?.lane_id}`}
                                                                                            name="text"
                                                                                            placeholder=""
                                                                                            value={lane?.thresholdDistance || ""}
                                                                                            onClick={(e: React.ChangeEvent<HTMLInputElement>) => e.stopPropagation()}
                                                                                            onFocus={(e: React.ChangeEvent<HTMLInputElement>) => e.stopPropagation()}
                                                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleThresholdChange(e, lane?.lane_id)}
                                                                                            onBlur={() => {
                                                                                                handleBlur(lane);
                                                                                            }}
                                                                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                                                                if (e.key === "Enter") {
                                                                                                    e.preventDefault();
                                                                                                    handleBlur(lane);
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                        <div >
                                                                                            {lane?.isChecked !== "" && (
                                                                                                <ImageComponent
                                                                                                    path={lane?.isChecked === 1 ? "/images/filled-tick.svg" : "/images/filled-cross.svg"}
                                                                                                    className="pe-0"
                                                                                                />
                                                                                            )}

                                                                                        </div>
                                                                                    </div>
                                                                                    )}
                                                                                </td>
                                                                                {/* <td className="customWidth">
                                                                                    <div >
                                                                                        {lane?.isChecked !== "" && (
                                                                                            <ImageComponent
                                                                                                path={lane?.isChecked === 1 ? "/images/filled-tick.svg" : "/images/filled-cross.svg"}
                                                                                                className="pe-0"
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                </td> */}
                                                                            </>
                                                                        )
                                                                        }


                                                                        <td className='customWidth'>
                                                                            <ButtonComponent
                                                                                imagePath="/images/mapView.svg"
                                                                                data-testid={`view-map-detail-${lane?.lane_id}`}
                                                                                text="View"
                                                                                onClick={() => {
                                                                                    handleViewLane(lane, configConstants, selectedFuelOption);
                                                                                    executeScroll(myRef);
                                                                                }}
                                                                                btnClass='d-flex align-items-center border-0 viewmap-btn'
                                                                            />
                                                                        </td>
                                                                    </Accordion.Header>

                                                                    {
                                                                        selectedFuelOption?.value !== "is_intermodal" &&
                                                                        <Accordion.Body className="px-0 pt-0 pb-0">
                                                                            <Table responsive className="mt-0 mb-0 lanesnew-table w-100">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>
                                                                                            <div className='fw-medium'>Carrier Name</div>
                                                                                        </th>
                                                                                        <th data-testid={`carrier-emission-sort-dt-${lane?.lane_id}`} className="pointer" onClick={() => handleCarrierLaneSort("carrierEmissions")}>
                                                                                            <div className=" pointer fw-medium">
                                                                                                Total Emissions<span><ImageComponent imageName={sortIcon("carrierEmissions", carrierColName, carrierOrder)} className="pe-0" /></span>
                                                                                                <h6 className="font-10">(tCO2e)</h6>
                                                                                            </div>
                                                                                        </th>
                                                                                        <th data-testid={`carrier-emission-save-sort-dt-${lane?.lane_id}`} className="w-auto pointer" onClick={() => handleCarrierLaneSort("carrierEmissionsSave")}>
                                                                                            <div className='fw-medium'>Emissions Saved <span><ImageComponent imageName={sortIcon("carrierEmissionsSave", carrierColName, carrierOrder)} className="pe-0" /></span>
                                                                                                <h6 className="font-10">(tCO2e)</h6>
                                                                                            </div>
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <TableBodyLoad isLoading={isCarrierEmissionDataLoading} noDataMsg="No Data Found" isData={carrierEmissionData?.data.length > 0} colSpan={3}>

                                                                                    <tbody>
                                                                                        {carrierEmissionDataList(carrierEmissionData?.data, selectedFuelOption, lane, configConstants, carrierColName,
                                                                                            carrierOrder)?.map((res: any) => {

                                                                                                return <tr
                                                                                                    key={res?.carrier_name}
                                                                                                    className="m-cursor"
                                                                                                >
                                                                                                    <td className="">
                                                                                                        <div className="d-flex align-items-center">
                                                                                                            <div className="carrierLogoTooltip d-flex align-items-center">
                                                                                                                <CarrierRankingTooltip
                                                                                                                    item={res}
                                                                                                                />
                                                                                                                <Logo
                                                                                                                    path={
                                                                                                                        res?.carrier_logo
                                                                                                                    }
                                                                                                                    name={
                                                                                                                        res?.carrier_name
                                                                                                                    }
                                                                                                                />({res.carrier})
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </td>

                                                                                                    <td className="">
                                                                                                        <div className="d-flex align-items-center">
                                                                                                            {formatNumber(true, res?.carrierEmissions, 2)}
                                                                                                        </div>
                                                                                                    </td>
                                                                                                    <td className=" w-auto">
                                                                                                        <div className="d-flex align-items-center">
                                                                                                            {formatNumber(true, Math.abs(res?.carrierEmissionsSave), 2)}
                                                                                                        </div>
                                                                                                    </td>

                                                                                                </tr>
                                                                                            })}
                                                                                    </tbody>
                                                                                </TableBodyLoad>
                                                                            </Table>
                                                                        </Accordion.Body>
                                                                    }

                                                                </Accordion.Item>
                                                            </tr>
                                                        }
                                                        )
                                                        }
                                                    </Accordion>
                                                </td>
                                            </tr>
                                        </tbody>

                                    </TableBodyLoad>
                                </table>

                            </div>
                            <Pagination currentPage={currentPage}
                                pageSize={pageSize}
                                pageSelectDisabled={isLoadingReportLaneData}
                                handlePageSizeChange={(e: any) => { setPageSize(e); setCurrentPage(1); executeScroll(tableRef) }}
                                total={reportLaneData?.data?.pagination?.total_count}
                                handlePageChange={(e: any) => { setCurrentPage(e); }}
                            />
                        </div>

                    </div>
                    <div className='mt-3' ref={myRef}>
                        {selectedLane && (
                            <MapComponent
                                key={selectedLane.lane_id}
                                showFullScreen={showFullScreen}
                                setShowFullScreen={setShowFullScreen}
                                isFullScreen={true}
                                modalClass="bioFuel-map alternative-map"
                            >
                                {selectedFuelOption?.value !== "is_intermodal" ? (
                                    <OptimusMap
                                        key={`optimus-${selectedLane.lane_id}`}
                                        laneData={optimusCordinatesData?.data}
                                        isCluster={true}
                                    />
                                ) : (
                                    <IntermodalLaneMap
                                        key={`intermodal-${selectedLane.lane_id}`}
                                        mapOrigin={originCityIntermodal?.label}
                                        mapDestination={destinationCityIntermodal?.label}
                                        laneIntermodalCordinateData={optimusCordinatesData?.data}
                                        navigate={navigate}
                                        laneName={`${originCityIntermodal?.label}_${destinationCityIntermodal?.label}`}
                                        loginDetails={loginDetails}
                                        configConstants={configConstants}
                                        selectedFuelOption={selectedFuelOption}
                                        selectedLane={selectedLane}
                                    />
                                )}
                            </MapComponent>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportsView