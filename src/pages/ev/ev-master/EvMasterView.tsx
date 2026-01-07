import Heading from 'component/heading'
import ImageComponent from "component/images";
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import EvMasterController from "./evMasterController"
import DatePicker from 'component/forms/datePicker';
import SelectDropdown from "component/forms/dropdown";
import ChartHighChart from 'component/highChart/ChartHighChart';
import TitleComponent from 'component/tittle';
import ButtonComponent from 'component/forms/button';
import MultiSelect, { OptionType } from "component/forms/multiSelect/MultiSelect";
import { LineChartEv } from 'utils/highchart/lineGraphEv';
import { toast } from 'react-toastify';
import ChartSection from './ChartComponent';
import { dateFormatValue, getDropDownOptions } from 'utils';

const evMasterView = () => {
    const {
        evFilterData,
        configConstants,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedCarrier,
        listOfCarriers,
        handleCarrierChange,
        setSelectedCarrier,
        masterCarrierData,
        isLoadingMasterCarrierData,
        navigate,
        selectCarrierToNext,
        setSelectCarrierToNext,
        isLoadingEvFilterDate,
        totalTonMileData, isLoadingTotalTonMileData,
        handleDownloadClick,
        isLoadingDwonloadEvData,
        visibleCarriers,
        hiddenCount,
        showAll,
        setShowAll,
        isLoadingCountryList, countryListData,
        country, setCountry,
        isLcvView,
        handleToggleChange
    } = EvMasterController()

    const countryOptionList = [
        { label: "All Countries", value: "" },
        ...getDropDownOptions(
            countryListData?.data,
            "country_name",
            "country_code",
            "",
            "",
            false
        ),
    ];

    const countryOption = countryOptionList;
    const handleChange = (selected: OptionType[]) => {
        if (selected?.length < 2) {
            toast.error("You must choose at least two carriers for comparison")
            return null
        }
        setSelectedCarrier(selected);

    };
    const dateValue = dateFormatValue(startDate, endDate)

    return (
        <section className='mb-3 mt-2 evDashboard-main-screen-wrap'>
            <TitleComponent title={"Master-dashboard"} pageHeading={`EV dashboard`} />
            <div className='p-3 pt-0 border-bottom mb-3 d-flex flex-wrap justify-content-between align-items-center' data-testid="EvMasterView">
                <Heading level="3" content="Carrier Comparison Dashboard" className="font-xxl-26 font-22 fw-semibold mb-0" />
                <div className='select-box d-flex flex-wrap align-items-center gap-2 detail-carrier'>
                    <SelectDropdown
                        aria-label="carrier-dropdown"
                        placeholder="Select Carrier"
                        isSearchable={true}
                        options={listOfCarriers?.data?.map((res: any) => ({ value: res?.scac, label: res?.name }))}
                        customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize"
                        onChange={(e: any) => setSelectCarrierToNext(e.value)}
                    />
                    <ButtonComponent data-testid="view-details" text="View Details" disabled={!selectCarrierToNext} btnClass='btn-deepgreen font-12 fw-medium'
                        onClick={() => navigate(`/scope3/ev-dashboard/${selectCarrierToNext}/${country === "" ? "all" : country}`)}

                    />
                </div>
            </div>
            <div className='p-3 pt-0 d-sm-flex justify-content-between align-items-center selected-carrier'>

                <FormGroup className="select-box form-group d-sm-flex flex-wrap align-items-center gap-2">
                    <SelectDropdown
                        placeholder="Select Country"
                        options={countryOption}
                        disabled={isLoadingCountryList}
                        selectedValue={countryOption?.filter((el: any) => el.value === country)}
                        customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize"
                        onChange={(e: any) => {
                            setCountry(e.value);
                        }}
                    />

                    <div className='d-sm-flex gap-1 align-items-center my-3 my-md-0'>
                        <Label htmlFor="exampleDate1" className="font-12 mb-0 fw-medium">
                            Start Date
                        </Label>
                        <DatePicker
                            selectDate={startDate}
                            minDate={evFilterData?.data?.start_date}
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
                            maxDate={evFilterData?.data?.end_date}
                            setSelectDate={setEndDate}
                        />
                    </div>
                    <div className='lcvBorder d-flex gap-3 align-items-center'>
                        <h6 className='mb-0 font-12 fw-normal'>LCV </h6><Input type="checkbox" checked={isLcvView} onChange={(e) => handleToggleChange(e)} disabled={isLoadingMasterCarrierData} />
                    </div>

                </FormGroup>
                <ButtonComponent text='Download' btnClass='font-14 btn-deepgreen py-2 px-4 downloadBtn' imagePath='/images/download.svg' onClick={handleDownloadClick} isLoading={isLoadingDwonloadEvData} />
            </div>
            <div className='select-box filter-wrapper p-3'>
                <div className='d-flex align-items-center mb-3 justify-content-between'>
                    <Heading level="3" content="Selected Carriers" className="font-xxl-18 font-16 fw-medium mb-0" />

                </div>
                <div className='mb-3'>
                    <MultiSelect
                        key="example_id"
                        aria-label="multi-carrier-dropdown"
                        options={listOfCarriers?.data?.map((res: any) => ({ ...res, value: res?.scac, label: res?.name }))}
                        onChange={handleChange}
                        selectedOptions={selectedCarrier}
                        menuPlacement={"bottom"}
                        isClearable={false}
                        disableClear={true}
                        className={"selectFuel-dropdown"}
                        clearMessage="Selected carrier"
                        placeHolder="Select carrier"
                        isSearchable={true}
                    />
                </div>
                <div className='d-flex flex-wrap gap-2 align-items-center'>
                    <div className='d-flex flex-wrap gap-2 align-items-center'>
                        {visibleCarriers.map((carrier: any, index: number) => (
                            <div key={carrier?.scac} className="d-flex align-items-center gap-1 ev-master">
                                <ImageComponent path={carrier?.image} className="pe-0 carrier-icon-logo" />
                                <Button data-testid={`change-carrier-detail-${index}`} className="btn-transparent p-0" onClick={() => handleCarrierChange(carrier.scac)}>
                                    <ImageComponent path="/images/cross.svg" className="pe-0" />
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
            </div>
            <div className='evDashboard-main-screen select-box'>

                <div className='p-3'>

                    <Row className='g-3'>
                        <ChartSection
                            headingContent="Total Number of EV Lanes"
                            barKey="total_ev_lanes"
                            yTitle="EV Lanes Count"
                            decimalUpto={0}
                            dateFormat={dateValue}
                            isLoadingChart={isLoadingMasterCarrierData || isLoadingEvFilterDate}
                            graphOptions={masterCarrierData?.data || []}
                            data={masterCarrierData?.data?.length > 0}
                        />
                        <ChartSection
                            headingContent="Total Number of EV Shipments"
                            barKey="total_shipment"
                            yTitle="EV Shipment Count"
                            decimalUpto={0}
                            dateFormat={dateValue}
                            isLoadingChart={isLoadingMasterCarrierData || isLoadingEvFilterDate}
                            graphOptions={masterCarrierData?.data || []}
                            data={masterCarrierData?.data?.length > 0}
                        />

                        <ChartSection
                            headingContent="Emissions Saved"
                            headingSubtitle="tCO2e"
                            barKey="emissions_saved"
                            yTitle="Emissions Saved"
                            decimalUpto={2}

                            dateFormat={dateValue}
                            isLoadingChart={isLoadingMasterCarrierData || isLoadingEvFilterDate}
                            graphOptions={masterCarrierData?.data || []}
                            data={masterCarrierData?.data?.length > 0}
                        />
                        <ChartSection
                            headingContent="Total Energy Consumption"
                            headingSubtitle="KWH"
                            barKey="kwh"
                            yTitle="Total Energy Consumption (KWH)"
                            decimalUpto={1}

                            dateFormat={dateValue}
                            isLoadingChart={isLoadingMasterCarrierData || isLoadingEvFilterDate}
                            graphOptions={masterCarrierData?.data || []}
                            data={masterCarrierData?.data?.length > 0}
                        />

                        <Col lg="12">
                            <div className='emission-region h-100'>
                                <div className='mb-3 p-3 border-bottom'>
                                    <p className='font-12 fw-medium mb-2'>{dateValue}</p>
                                    <Heading level="3" className="font-16 font-xxl-20 mb-0 fw-semibold" >
                                        Total Ton {configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"} Covered
                                    </Heading>
                                </div>
                                <div className='p-3'>
                                    <ChartHighChart
                                        loadingTestId="high-chart-emission-intensity-loader"
                                        testId="high-chart-emission-intensity"
                                        database={totalTonMileData?.data?.data?.length > 0}
                                        classname=''
                                        options={LineChartEv({
                                            options: totalTonMileData?.data || { data: [], dates: [] },
                                            decimalUpto: 1,
                                            xKey: "dates",
                                            yTitle: `Total Ton ${configConstants?.data?.default_distance_unit === "miles" ? "Mile" : "Kms"}`
                                        })}
                                        constructorType=""
                                        isLoading={isLoadingTotalTonMileData || isLoadingEvFilterDate}
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

export default evMasterView 