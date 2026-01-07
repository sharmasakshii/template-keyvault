import { useEffect } from "react";
import Heading from "../../component/heading";
import ImageComponent from "../../component/images"
import { useAppSelector, } from 'store/redux.hooks';
import LaneDataCard from "./LaneDataCard";
import {
    FormGroup,
    Input,
    Label
} from "reactstrap";
import MultiSelect from "../../component/forms/multiSelect/MultiSelect";
import { evProductCode } from "constant";
import Spinner from "component/spinner";
import ButtonComponent from "component/forms/button";
import SelectDropdown from "component/forms/dropdown";

const LanePlanningCard = ({
    lane,
    deltaMetrix,
    scenarioDetails,
    laneDto,
    showFuelStops,
    setShowFuelStops,
    showFuelStopsEV,
    setShowFuelStopsEV,
    showFuelStopsRD,
    setShowFuelStopsRD,
    setSelectedFuelStop,
    selectedFuelStop,
    isLaneScenarioDetailLoading,
    params,
    filterList,
    configConstants,
    handleSearch,
    threshold,
    handleThresholdChange,
    handleClearSelectSelection,
    handleChange,
    radiusOptions,
    radius,
    handleRadiusChange,
    handleAlternativeFuelCheckbox,
    handleEvCheckbox,
    handleBlur,
    isCheckLaneFuelLoading
}: any) => {
    const { loginDetails } = useAppSelector((state: any) => state.auth);

    useEffect(() => {
        if (lane?.recommendedKLaneFuelStop?.length > 0) {
            if (params?.filter && !(filterList?.includes("intermodal") && lane?.key === "modal_shift")) {
                const fuelStopList = lane?.unique_fuel_stops?.filter((res: any) => filterList?.includes(res?.product_code)).map((i: any) => ({ ...i, label: i?.name, value: i?.id }))
                setSelectedFuelStop(fuelStopList);
                setShowFuelStops(fuelStopList?.length > 0)
                setShowFuelStopsEV(lane?.recommendedKLaneFuelStop?.filter((res: any) => (res.product_codes === evProductCode)).length > 0 && filterList?.includes(evProductCode))

            } else {
                setSelectedFuelStop(lane?.unique_fuel_stops?.filter((res: any) => res.product_code === lane?.fuel_stop?.product_code)?.map((i: any) => ({ ...i, label: i?.product_name, value: i?.id })))
                setShowFuelStops(lane?.recommendedKLaneFuelStop?.filter((res: any) => (res.product_codes !== evProductCode)).length > 0)
                setShowFuelStopsEV(lane?.recommendedKLaneFuelStop?.filter((res: any) => (res.product_codes === evProductCode)).length > 0)

            }
            setShowFuelStopsRD(false)
        }
    }, [lane, setShowFuelStops, setShowFuelStopsEV, setShowFuelStopsRD, setSelectedFuelStop, params?.filter, filterList])
    return (
        <div className="lane-rightOuter" data-testid="recommendation-card">
            <div className="recommendationMain-card" >
                {isLaneScenarioDetailLoading ? <Spinner spinnerClass="py-5 my-4 justify-content-center" /> : <>
                    <div className="recommendationTxt d-flex flex-wrap justify-content-between gap-2 select-box">
                        <div className="">
                            <Heading level="4" className="font-14 font-xxl-16 mb-0 fw-normal">Recommendation {lane?.recommondationId || 0 + 1}</Heading>
                            {(lane?.key !== "modal_shift" && lane?.key !== "carrier_shift") &&

                                <div className="d-flex align-items-center gap-2">
                                    {lane?.recommendedKLaneFuelStop?.filter((res: any) => (res.product_codes !== evProductCode))?.length > 0 && <>

                                        <FormGroup check className="mb-0">
                                            <Input type="checkbox" checked={showFuelStops} onChange={() => {
                                                handleAlternativeFuelCheckbox()
                                            }
                                            } disabled={isCheckLaneFuelLoading} />
                                            <Label check className="font-12 font-xxl-14">
                                                Alternative Fuel
                                            </Label>
                                        </FormGroup>
                                        <ImageComponent path="/images/fuelNew.svg" className="pe-0 recommendation-img" />
                                    </>}
                                    {(loginDetails?.data?.Company?.slug === "PEP" && lane?.recommendedKLaneFuelStop?.filter((res: any) => res.product_codes === evProductCode)?.length > 0) &&
                                        <>
                                            {lane?.recommendedKLaneFuelStop?.filter((res: any) => (res.product_codes !== evProductCode))?.length > 0 && <span className="line">|</span>}
                                            <FormGroup check className="mb-0">
                                                <Input type="checkbox" checked={showFuelStopsEV} onChange={() => {
                                                    handleEvCheckbox()
                                                }} disabled={isCheckLaneFuelLoading} />
                                                <Label check className="font-12 font-xxl-14">
                                                    EV Charging
                                                </Label>
                                            </FormGroup>
                                            <ImageComponent path="/images/evChargeIcon.svg" className="pe-0 recommendation-img" />
                                        </>
                                    }

                                </div>
                            }
                        </div>
                    </div>
                    <LaneDataCard
                        selectedFuelStop={selectedFuelStop}
                        lane={lane}
                        deltaMetrix={deltaMetrix}
                        scenarioDetails={scenarioDetails}
                        showFuelStops={showFuelStops}
                        showFuelStopsEV={showFuelStopsEV}
                        showFuelStopsRD={showFuelStopsRD}
                        laneFuelStopDto={laneDto?.data}
                        configConstants={configConstants} />
                    {lane?.key === "alternative_fuel" &&
                        <div className="p-3 pt-3 d-flex gap-3 align-items-end border-top flex-wrap">
                            {lane?.unique_fuel_stops?.length > 0 && <div>
                                <label htmlFor="fuel-types-multiselect" className="d-block text-sm font-medium mb-1">
                                    Select Fuel Types
                                </label>
                                <MultiSelect
                                    key="example_id"
                                    id="fuel-types-multiselect"
                                    isDisabled={isCheckLaneFuelLoading}
                                    options={
                                        lane?.unique_fuel_stops?.map((el: any) => {
                                            return {
                                                ...el,
                                                label: el?.product_name,
                                                value: el?.id,
                                            };
                                        })
                                    }
                                    selectedOptions={selectedFuelStop}
                                    handleClearSelectSelection={handleClearSelectSelection}
                                    clearMessage="Clear fuel type"
                                    placeHolder="Select fuel type"
                                    className="selectFuel-dropdown multiDropdown"
                                    menuPlacement="bottom"
                                    isClearable={false}
                                    onChange={handleChange}
                                    showChips={true}
                                />
                            </div>}


                            <div className='select-box radius-checkbox'>
                                <label htmlFor="radius-configuration" className="d-block text-sm font-medium mb-1">
                                    Radius Configuration (miles)
                                </label>
                                <SelectDropdown
                                    menuPlacement="bottom"
                                    aria-label="status-dropdown"

                                    options={radiusOptions}
                                    placeholder="Radius"
                                    selectedValue={radiusOptions?.filter(
                                        (el: any) => el.value === radius
                                    )}
                                    onChange={handleRadiusChange}
                                />
                            </div>
                            <div className="newSection-input">
                                <label htmlFor="threshold-distance" className="d-block text-sm font-medium mb-1">
                                    Threshold Distance (miles)
                                </label>
                                <input
                                    id="threshold-distance"
                                    type="text"
                                    className="border rounded-pill px-3 py-1"
                                    placeholder=""
                                    value={threshold}
                                    onChange={handleThresholdChange}
                                    onBlur={handleBlur}

                                />
                            </div>

                            <ButtonComponent
                                type='button'
                                text="Search"
                                imagePath="/images/search.svg"
                                btnClass="btn-deepgreen search font-14 px-3 py-2"
                                onClick={() => handleSearch()}
                            />

                        </div>
                    }
                </>
                }
            </div>



        </div>
    )
}
export default LanePlanningCard