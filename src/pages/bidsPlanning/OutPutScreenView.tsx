import ButtonComponent from 'component/forms/button'
import Heading from 'component/heading'
import ImageComponent from 'component/images'
import SustainViewCard from 'component/cards/sustainabilityTracker';
import { Col, Row } from 'reactstrap';
import ChartHighChart from "../../component/highChart/ChartHighChart";
import SelectDropdown from "../../component/forms/dropdown";
import TableBodyLoad from 'component/tableBodyHandle';
import OutputScreenController from "./outputScreenController"
import { barchart } from "utils/highchart/barchart"
import { formatNumber } from "utils";
import BioFuelComponent from "./BioFuelComponent"
import Pagination from 'component/pagination';
import styles from '../../scss/config/_variable.module.scss'
import Spinner from 'component/spinner';

const OutPutScreenView = () => {

    const {
        useViewAllFilesHandler,
        isLoadingEmissionCostImpactBarChartBid,
        costImpactBarChartBid,
        isLoadingKeyMetricsSummaryOutput,
        keyMetricsSummaryOutput,
        isLoadingOutputDataOfBidPlanning,
        outputDataOfBidPlanning,
        outputPageSize,
        setOutputPageSize,
        outputPageNumber,
        setOutputPageNumber,
        setIfApplied,
        isLoadingOriginBidOutput,
        isLoadingDestinationBidOutput,
        selectedOrigin,
        setSelectedOrigin,
        selectedDestination,
        setSelectedDestination,
        selectedScac,
        setSelectedScac,
        searchDestination,
        menuIsOpen1,
        setMenuIsOpen1,
        menuIsOpen2,
        setMenuIsOpen2,
        menuIsOpen3,
        setMenuIsOpen3,
        originOptions,
        destinationOptions,
        handleSearchOrigin,
        handleSearchDestination,
        handleOriginMenuChange,
        handleDestinationMenuChange,
        handleSectionClick,
        reverseLocation,
        isLoadingScacBidOutput,
        handleSearchScac,
        scacOptions,
        handleScacMenuChange,
        handleDownloadReport,
        isLoadingOutputOfBidPlanningExport,
        handleResetOutput,
        isLoadingFuelStop,
        resFuel,
        handleDownLoadFile,
        isLoadingSingleFile
    } = OutputScreenController()

    const handleViewAllFiles = useViewAllFilesHandler();

    return (
        <div className="bidsPlanning-outerScreen p-3 mt-0" data-testid="bid-output">
            <button data-testid="bid-output-section" className='bid-Output w-100 bg-transparent text-start p-0 border-0 cursorAuto' onClick={handleSectionClick}>
                <div className='outPut-heading d-flex flex-wrap align-items-center gap-2 justify-content-between mb-3'>
                    <div className='d-flex align-items-center gap-2 position-relative'>
                        <ImageComponent
                            path="/images/Excel.svg"
                            alt="files"
                            className='pe-0'
                        />
                        <Heading level="5" content={keyMetricsSummaryOutput?.data?.file_name} className="font-18 font-xxl-20 fw-semibold mb-0 file-name" >
                            <div className="tootltip-div">
                                {keyMetricsSummaryOutput?.data?.file_name}
                            </div>
                        </Heading>
                    </div>
                    <div className='d-flex gap-2 align-items-center filterBtns'>
                        <ButtonComponent
                            text="Download"
                            data-testid="download-button"
                            btnClass="justify-content-center font-12 font-xxl-14  gap-1 btn-deepgreen downloadListView"
                            imagePath="/images/download.svg"
                            onClick={handleDownLoadFile}
                            isLoading={isLoadingSingleFile}
                        />
                        <ButtonComponent
                            imagePath="/images/eyeicon.svg"
                            text="View All Files"
                            data-testid="view-all-button"
                            btnClass="btn-lightGreen font-14 font-xxl-16 py-2  viewFile"
                            onClick={handleViewAllFiles}
                        />
                    </div>
                </div>
                <div className="reagionCards mb-3">
                    <Heading level="5" content="Key Metrics" className="font-18 font-xxl-20 fw-semibold mb-3" />

                    <Row className='g-3'>
                        <Col md="4">
                            <SustainViewCard
                                isLoading={isLoadingKeyMetricsSummaryOutput}
                                cardValue={`${formatNumber(
                                    true,
                                    keyMetricsSummaryOutput?.data?.bid_details?.emissions?.value,
                                    0
                                )}`}
                                cardDate="Emissions Reduction Potential"
                                imagePath={keyMetricsSummaryOutput?.data?.bid_details?.emissions?.sign === "up" ? "/images/highValue-arrow.svg" : "/images/lowValue-arrow.svg"}
                                unit="(tCO2e)"
                                className={`${keyMetricsSummaryOutput?.data?.bid_details?.emissions?.sign === "up" ? "upArrow" : "downArrow"}`}
                            />
                        </Col>
                        <Col md="4">
                            <SustainViewCard
                                isLoading={isLoadingKeyMetricsSummaryOutput}
                                cardValue={`$${formatNumber(
                                    true,
                                    keyMetricsSummaryOutput?.data?.bid_details?.cost_impact?.value,
                                    0
                                )}`}
                                className={`${keyMetricsSummaryOutput?.data?.bid_details?.cost_impact?.sign === "up" ? "upArrow" : "downArrow"}`}
                                cardDate="Cost Change"
                                imagePath={keyMetricsSummaryOutput?.data?.bid_details?.cost_impact?.sign === "up" ? "/images/highValue-arrow.svg" : "/images/lowValue-arrow.svg"}
                            />
                        </Col>
                        <Col md="4">
                            <SustainViewCard
                                isLoading={isLoadingKeyMetricsSummaryOutput}
                                cardValue={formatNumber(
                                    true,
                                    keyMetricsSummaryOutput?.data?.bid_details?.rpm?.value,
                                    1
                                )}
                                cardDate="Dollar Per Ton Emissions Reduction"
                                imagePath={keyMetricsSummaryOutput?.data?.bid_details?.rpm?.sign === "up" ? "/images/highValue-arrow.svg" : "/images/lowValue-arrow.svg"}
                                className={`${keyMetricsSummaryOutput?.data?.bid_details?.rpm?.sign === "up" ? "upArrow" : "downArrow"}`}
                            />
                        </Col>
                    </Row>
                </div>
                <div className='mb-3'>
                    <Row className='g-3'>
                        <Col lg="6">
                            <div className='mainGrayCards h-100'>
                                <div className='border-bottom p-3'>
                                    <div className='d-flex align-items-center gap-2 '>
                                        <ImageComponent
                                            path="/images/cloud.svg"
                                            alt="files"
                                            className='pe-0'
                                        />
                                        <Heading level="5" content="Highest Emissions Reduction Potential Lanes (%)" className="font-18 font-xxl-20  fw-semibold mb-0" />
                                    </div>
                                </div>
                                <div className='p-3 '>
                                    <Row className='align-items-center pieChart'>
                                        <Col>
                                            <ChartHighChart
                                                loadingTestId="high-chart-emission-intensity-loader"
                                                testId="high-chart-emission-intensity"
                                                database={costImpactBarChartBid?.data?.length > 0}
                                                options={barchart({
                                                    options: costImpactBarChartBid?.data,
                                                    title: 'Emissions Impact Lanes',
                                                    yTitle: 'Emissions Reduction (%)',
                                                    yKey: 'max_emission',
                                                    barColor: (styles.primary),
                                                    costImpact: 'Emissions Impact :'

                                                })}
                                                constructorType=""
                                                isLoading={isLoadingEmissionCostImpactBarChartBid}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className='mainGrayCards h-100'>
                                <div className='border-bottom p-3'>
                                    <div className='d-flex align-items-center gap-2 '>
                                        <ImageComponent
                                            path="/images/dollar.svg"
                                            alt="files"
                                            className='pe-0'
                                        />
                                        <Heading level="5" content="Cost Impact (%)" className="font-18 font-xxl-20  fw-semibold mb-0" />
                                    </div>
                                </div>
                                <div className='p-2 p-xxl-3'>
                                    <ChartHighChart
                                        loadingTestId="high-chart-emission-intensity-loader"
                                        testId="high-chart-emission-intensity"
                                        database={costImpactBarChartBid?.data?.length > 0}
                                        options={barchart({
                                            options: costImpactBarChartBid?.data,
                                            title: 'Cost Impact Lanes',
                                            yTitle: 'Cost (%)',
                                            yKey: 'max_cost',
                                            barColor: (styles.primary),
                                            costImpact: 'Cost Impact :'
                                        })}
                                        constructorType=""
                                        isLoading={isLoadingEmissionCostImpactBarChartBid}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className='mainGrayCards mb-3'>
                    <div className='border-bottom p-3'>
                        <div className='d-flex align-items-center gap-2'>
                            <ImageComponent
                                path="/images/outline-fuel.svg"
                                alt="files"
                                className='pe-0'
                            />
                            <Heading level="5" content="Top 5 Lanes for Biofuels" className="font-18 font-xxl-20  fw-semibold mb-0" />
                        </div>

                    </div>
                    <div className='p-2 p-xxl-3'>
                        {isLoadingFuelStop ? (
                            <Spinner spinnerClass="py-5 my-4 justify-content-center" />
                        ) : (
                            <div className="grid-container">
                                {keyMetricsSummaryOutput?.data?.bid_lanes?.length === 0 ? (
                                    <div className="d-flex justify-content-center align-items-center py-5 mt-2 w-100">
                                        <p>No Lane Found with Biofuels</p>
                                    </div>
                                ) :
                                    keyMetricsSummaryOutput?.data?.bid_lanes?.map((item: any) => (
                                        <BioFuelComponent
                                            key={item?.lane_name}
                                            bioFuelDto={item}
                                            resFuel={resFuel}
                                            laneName={item?.lane_name}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className='mainGrayCards mb-3'>
                    <div className='border-bottom p-3'>
                        <div className=' gap-2 flex-wrap tableHeading-wrapper position-relative'>
                            <div className='d-flex align-items-center gap-2 heading'>
                                <ImageComponent
                                    path="/images/Excel.svg"
                                    alt="files"
                                    className='pe-0'
                                />
                                <Heading level="5" content={keyMetricsSummaryOutput?.data?.file_name} className="font-18 font-xxl-20 fw-semibold mb-0 file-name" >
                                    <div className="tootltip-div">
                                        {keyMetricsSummaryOutput?.data?.file_name}
                                    </div>
                                </Heading>

                            </div>
                            <div className='d-flex flex-wrap gap-3 searchBars'>
                                <div className="select-box d-flex flex-wrap gap-2 align-items-center" data-testid="spinner-load">
                                    <button data-testid="change-origin" className="search-icon-img btn-transparent border-0 " onClick={(event) => handleOriginMenuChange(event)}>
                                        {isLoadingOriginBidOutput ?
                                            <div className="dropdownSpinner spinnerNew">
                                                <div className="spinner-border ">
                                                    <span className="sr-only"></span>
                                                </div>
                                            </div>
                                            :
                                            <span className='d-block height-0'>
                                                <ImageComponent path="/images/search.svg" className="pe-0 search-img searchImgNew" />
                                            </span>
                                        }
                                        <SelectDropdown
                                            aria-label="origin-dropdown"
                                            placeholder="Enter Origin"
                                            isSearchable={true}
                                            selectedValue={selectedOrigin}
                                            menuIsOpen={menuIsOpen1}
                                            onChange={(e: any) => {
                                                setSelectedOrigin(e);
                                                searchDestination(e)
                                                setMenuIsOpen1(false)
                                            }}
                                            onInputChange={(e: any) => {
                                                handleSearchOrigin(e);
                                            }}
                                            options={originOptions}
                                            customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize"
                                        />
                                    </button>
                                    <div className=" text-center arrow-icons my-2">
                                        <ButtonComponent
                                            imagePath="/images/placeArrows.svg"
                                            data-testid="upDown-arrows"
                                            onClick={reverseLocation}
                                            text=""
                                        />
                                    </div>
                                    <button data-testid="change-destination" className="search-icon-img lane btn-transparent border-0" onClick={(event) => handleDestinationMenuChange(event)}>
                                        {isLoadingDestinationBidOutput ? <div className="dropdownSpinner spinnerNew">
                                            <div className="spinner-border ">
                                                <span className="sr-only"></span>
                                            </div>
                                        </div>
                                            :
                                            <span className='d-block height-0'>
                                                <ImageComponent path="/images/search.svg" className="pe-0 search-img searchImgNew" />
                                            </span>}
                                        <SelectDropdown
                                            aria-label="destination-dropdown"
                                            placeholder="Enter Destination"
                                            isSearchable={true}
                                            selectedValue={selectedDestination}
                                            menuIsOpen={menuIsOpen2}
                                            onChange={(e: any) => {
                                                setSelectedDestination(e);
                                                setMenuIsOpen2(false)
                                            }}
                                            onInputChange={(e: any) => {
                                                if (e.length >= 3) {
                                                    handleSearchDestination(e);
                                                }
                                            }}
                                            options={destinationOptions}
                                            customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize"
                                        />
                                    </button>
                                    <button data-testid="change-scac" className="search-icon-img sace-code bg-transparent border-0 p-0" onClick={(event) => handleScacMenuChange(event)}>
                                        {isLoadingScacBidOutput ? <div className="dropdownSpinner">
                                            <div className="spinner-border ">
                                                <span className="sr-only"></span>
                                            </div>
                                        </div>
                                            :
                                            <span className='d-block height-0'>
                                                <ImageComponent path="/images/search.svg" className="pe-0 search-img" />
                                            </span>}
                                        <SelectDropdown
                                            aria-label="scac-dropdown"
                                            placeholder="Enter SCAC"
                                            isSearchable={true}
                                            selectedValue={selectedScac}
                                            menuIsOpen={menuIsOpen3}
                                            onChange={(e: any) => {
                                                setSelectedScac(e);
                                                setMenuIsOpen3(false)
                                            }}
                                            onInputChange={(e: any) => {
                                                handleSearchScac(e);
                                            }}
                                            options={scacOptions}
                                            customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize"
                                        />
                                    </button>
                                </div>
                                <div className='d-flex gap-3 align-items-center resetBtns'>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <ButtonComponent
                                            text="Apply"
                                            data-testid="apply-button"
                                            btnClass="btn-deepgreen font-14 py-2 px-4"
                                            onClick={() => {
                                                setOutputPageNumber(1);
                                                setOutputPageSize({ value: 10, label: 10 });
                                                setIfApplied(true)
                                            }}
                                            disabled={!selectedOrigin && !selectedScac && !selectedDestination}
                                        />
                                        <ButtonComponent
                                            text="Reset"
                                            data-testid="reset-button"
                                            btnClass="outlineBtn-deepgreen font-14 py-2 px-4 "
                                            onClick={handleResetOutput}
                                            disabled={!selectedOrigin && !selectedScac && !selectedDestination}
                                        />
                                    </div>
                                    {outputDataOfBidPlanning?.data?.total > 0 &&
                                        <>
                                            <span className='line'>
                                            </span>
                                            <ButtonComponent
                                                data-testid="download-button-report"
                                                imagePath="/images/download.svg"
                                                text="Report"
                                                btnClass="btn-deepgreen font-14 py-2 px-3  downloadReport"
                                                onClick={handleDownloadReport}
                                                isLoading={isLoadingOutputOfBidPlanningExport}
                                            />
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='py-3'>
                        <div className='static-table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Lane
                                        </th>
                                        <th>
                                            Carrier_SCAC
                                        </th>
                                        <th>
                                            Rate Per Mile ($)
                                        </th>
                                        <th>
                                            Distance_miles
                                        </th>
                                        <th>
                                            Emission_intensity
                                            <h6 className="font-10">
                                                gCO2e/Ton-Mile
                                                <br /> of freight
                                            </h6>
                                        </th>
                                        <th>
                                            Emissions
                                            <h6 className="font-10">
                                                tCO2e
                                            </h6>
                                        </th>
                                        <th>
                                            Cost_impact (%)
                                        </th>
                                        <th>
                                            Emission_impact (%)
                                        </th>
                                        <th className='w-auto'>
                                            Alternate _fuels
                                        </th>
                                    </tr>
                                </thead>
                                <TableBodyLoad isLoading={isLoadingOutputDataOfBidPlanning} isData={outputDataOfBidPlanning?.data?.data?.length > 0} colSpan={6}>
                                    <tbody>
                                        {outputDataOfBidPlanning?.data?.data?.map((item: any) => (
                                            <tr key={item?.id}>
                                                <td>{item?.lane_name.split("_").join(" to ")} </td>
                                                <td>{item?.scac}</td>
                                                <td>
                                                    ${formatNumber(true, item?.rpm, 2)}
                                                </td>
                                                <td>
                                                    {formatNumber(true, item?.distance, 1)}
                                                </td>
                                                <td>
                                                    {formatNumber(true, item?.intensity, 1)}
                                                </td>
                                                <td>
                                                    {formatNumber(true, item?.emissions, 2)}
                                                </td>
                                                <td>
                                                    {formatNumber(true, item?.cost_impact, 0)}%
                                                </td>
                                                <td>
                                                    {formatNumber(true, item?.emission_impact, 0)}%
                                                </td>
                                                <td className='w-auto'>
                                                    {item?.fuel_type?.split(",").join(", ")}
                                                </td>
                                            </tr>

                                        ))}

                                    </tbody>
                                </TableBodyLoad>
                            </table>
                        </div>
                        <Pagination currentPage={outputPageNumber} pageSize={outputPageSize} handlePageSizeChange={(e: any) => { setOutputPageSize(e); setOutputPageNumber(1); setIfApplied(true) }} total={outputDataOfBidPlanning?.data?.pagination?.total_count || 0} handlePageChange={(e: any) => { setOutputPageNumber(e); setIfApplied(true) }} />
                    </div>
                </div>
            </button>
        </div>
    )
}

export default OutPutScreenView