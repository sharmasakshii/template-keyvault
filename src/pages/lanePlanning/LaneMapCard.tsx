import Heading from "component/heading";
import MapComponent from "component/map/MapComponent";
import GoogleMapView from "component/map";
import LanePathMap from "component/map/LanePathMap";
import IntermodalLaneMap from "component/map/IntermodalLaneMap";
import { useAppSelector, } from 'store/redux.hooks';
import Spinner from "component/spinner";
import { formatUnit } from "utils";

const LaneMapCard = (
    { lane,
        navigate,
        laneDto,
        baseLineDto,
        showFuelStops,
        showFuelStopsEV,
        showFuelStopsRD,
        originCity,
        destinationCity,
        laneName,
        selectedFuelStop, showFullScreen, setShowFullScreen, configConstants, defaultUnit,
        laneSortestPathLoading, t,
        projectId }: any
) => {
    
    const routeType = lane?.key === "modal_shift" ? "modal_shift" : "alternative_fuel"
    const { loginDetails } = useAppSelector((state: any) => state.auth);
    return (
        <div>
            <div className="mb-3 d-flex justify-content-between align-items-center gap-2 flex-wrap">
                <div className=" d-flex align-items-center gap-2">
                    <div className="recommendedlineImage d-flex gap-2 align-items-center">
                        <span></span>
                        <Heading level="4" className="font-12 mb-0 fw-normal">Recommended Lane</Heading>
                    </div>
                    <div className="railImage d-flex gap-2 align-items-center">
                        <span></span>
                        <Heading level="4" className="font-12 mb-0 fw-normal">Rail Line</Heading>
                    </div>
                </div>
                <Heading level="4" className="font-10 mb-0 fw-normal">
                    {t("gco2eFreightUnit", { unit: formatUnit(defaultUnit) })}
                </Heading>
            </div>
            <div className="lane-rightwrap">
                {
                    laneSortestPathLoading ? <Spinner spinnerClass="py-5 my-4 justify-content-center" /> :
                        <MapComponent showFullScreen={showFullScreen} setShowFullScreen={setShowFullScreen} isFullScreen={true}>
                            {lane?.key === "carrier_shift" && !laneDto?.data?.baseLine &&
                                <GoogleMapView origin={originCity?.value} destination={destinationCity?.value} />
                            }
                            {laneDto?.data?.baseLine && routeType === "alternative_fuel" &&
                                <LanePathMap
                                    key={lane?.key}
                                    zoom={5}
                                    lane={lane?.key === "alternative_fuel" && lane}
                                    laneDto={laneDto}
                                    baseLineDto={baseLineDto}
                                    showFuelStops={showFuelStops}
                                    showFuelStopsEV={showFuelStopsEV}
                                    showFuelStopsRD={showFuelStopsRD}
                                    selectedFuelStop={selectedFuelStop}
                                    isBaseLine={lane?.isBaseLine}
                                />
                            }
                            {laneDto?.data?.baseLine && routeType === "modal_shift" &&
                                <IntermodalLaneMap
                                    mapOrigin={originCity?.label}
                                    mapDestination={destinationCity?.label}
                                    laneIntermodalCordinateData={lane}
                                    navigate={navigate}
                                    laneName={laneName}
                                    loginDetails={loginDetails}
                                    configConstants={configConstants}
                                    projectId={projectId}
                                    routeType={routeType}
                                />
                            }
                        </MapComponent>
                }

            </div>
        </div>
    )

}

export default LaneMapCard