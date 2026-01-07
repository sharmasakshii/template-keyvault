import React, { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "../../constant/custom-map-style.json"
import styles from "../../scss/config/_variable.module.scss";
import ImageComponent from "component/images"
import { useAppSelector } from 'store/redux.hooks';
import { distanceConverterInterModal, formatNumber, getImageUrl } from 'utils'
import Spinner from "component/spinner";
import { calculateCenter, checkSafariLoad, getDirection, getDirectionRender, getMarkerPosition, ResetButton } from "./MapFunctions";

// ✅ Extracted report blocks into separate components
const EmissionSaveReport = ({ laneInfo }: any) => (
    <>
        <div className="d-flex gap-2 align-items-start highIndex mb-1">
            <ImageComponent path="/images/alternative/truck.svg" className="pe-0" />
            <h5 className="mb-0">
                Total Shipments:{" "}
                <span>{formatNumber(true, laneInfo?.shipments, 0)}</span>
            </h5>
        </div>
        <div className="d-flex gap-2 align-items-start highIndex mb-1">
            <ImageComponent path="/images/alternative/fuel.svg" className="pe-0" />
            <h5 className="mb-0">
                Fuel Consumption:{" "}
                <span>
                    {laneInfo.fuel_consumption
                        ? formatNumber(true, laneInfo.fuel_consumption, 2)
                        : "N/A"}{" "}
                    (Gallons)
                </span>
            </h5>
        </div>
        <div className="d-flex gap-2 align-items-start highIndex mb-1">
            <ImageComponent path="/images/alternative/total-eission.svg" className="pe-0" />
            <h5 className="mb-0">
                Emissions Saved:{" "}
                <span>{formatNumber(true, laneInfo.emission_saved, 2)} (tCO2e)</span>
            </h5>
        </div>
    </>
);

const IntermodalReport = ({ laneInfo }: any) => (
    <>
        <div className="d-flex gap-2 align-items-start highIndex mb-1">
            <h5 className="mb-0">
                Lane Name: <span>{laneInfo?.lane_name}</span>
            </h5>
        </div>
        <div className="d-flex gap-2 align-items-start highIndex mb-1">
            <h5 className="mb-0">
                Total Shipments:{" "}
                <span>{formatNumber(true, laneInfo?.total_shipments, 0)}</span>
            </h5>
        </div>
        <div className="d-flex gap-2 align-items-start highIndex mb-1">
            <h5 className="mb-0">
                Distance:{" "}
                <span>{formatNumber(true, laneInfo?.total_distance, 0)}</span> Miles
            </h5>
        </div>
    </>
);

const DefaultReport = ({ laneStatisticsDto, infoWindowOpen }: any) => (
    <div className="d-flex gap-2 align-items-start highIndex mb-1">
        <ImageComponent path="/images/alternative/truck.svg" className="pe-0" />
        <h5 className="mb-0">
            Total Shipments: <span>{infoWindowOpen?.dto?.product_name}</span>
            <span>
                {" "}
                {formatNumber(true, laneStatisticsDto?.data?.total_shipments, 0)}
            </span>
        </h5>
    </div>
);

const GoogleMapLaneView = React.memo(
    ({
        origin,
        destination,
        laneInfo,
        isShowIntermodalReport,
        isLoading,
        isShowEmission,
        defaultUnit,
        isShowEmissionSaveReport = false,
    }: any) => {
        const initialCenter = { lat: 34.5204, lng: -105.8567 };
        const [response, setResponse] = useState<any>(null);
        const [isLoadingCordinate, setIsLoadingCordinate] = useState(true);
        const [center, setCenter] = useState(initialCenter);
        const [infoWindowOpen, setInfoWindowOpen] = useState<any>(null);
        const [markerPosition, setMarkerPosition] = useState<any>(null);

        const mapRef = useRef(null);

        const { laneStatisticsDto } = useAppSelector(
            (state) => state.localFreight
        );

        useEffect(() => {
            getMarkerPosition(response, setMarkerPosition);
        }, [response]);

        const getCenter = () => {
            setCenter(calculateCenter(response));
        };

        useEffect(() => {
            setIsLoadingCordinate(true);
        }, [origin, destination]);

        const containerStyle = {
            width: "100%",
            height: "100vh",
        };

        const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;

        const { isLoaded } = useJsApiLoader({
            googleMapsApiKey: googleMapsApiKey,
        });

        return (
            <div data-testid="google-map">
                {isLoaded && (
                    <div className="map-outer-wrap">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={2}
                            onLoad={(map: any) => {
                                mapRef.current = map;
                                checkSafariLoad(map);
                            }}
                            options={{
                                styles: mapStyle,
                                minZoom: 4,
                                maxZoom: 15,
                                mapTypeControl: false,
                                streetViewControl: false,
                                zoomControl: true,
                                keyboardShortcuts: false,
                                fullscreenControl: false,
                            }}
                        >
                            {getDirection(
                                origin,
                                destination,
                                isLoadingCordinate,
                                setIsLoadingCordinate,
                                setResponse,
                                setCenter,
                                response
                            )}

                            {getDirectionRender(origin, destination, response, styles.orange)}

                            <Marker
                                position={{
                                    lat: Number.parseFloat(markerPosition?.lat),
                                    lng: Number.parseFloat(markerPosition?.lng),
                                }}
                                onClick={() => {
                                    setInfoWindowOpen({ dto: laneInfo });
                                }}
                                icon={
                                    isShowIntermodalReport
                                        ? getImageUrl("/images/terminalIcon.svg")
                                        : getImageUrl("/images/terminal-fuel.svg")
                                }
                            >
                                {infoWindowOpen && (
                                    <InfoWindow onCloseClick={() => setInfoWindowOpen(null)}>
                                        <div>
                                            <div className="d-flex flex-column gap-3 index-wrapper">
                                                {isLoading ? (
                                                    <Spinner spinnerClass="mt-5 justify-content-center" />
                                                ) : (
                                                    <>
                                                        <div className="border-bottom pb-2 d-flex gap-1 flex-column">
                                                            {(() => {
                                                                let reportContent;
                                                                if (isShowEmissionSaveReport) {
                                                                    reportContent = <EmissionSaveReport laneInfo={laneInfo} />;
                                                                } else if (isShowIntermodalReport) {
                                                                    reportContent = <IntermodalReport laneInfo={laneInfo} />;
                                                                } else {
                                                                    reportContent = (
                                                                        <DefaultReport
                                                                            laneStatisticsDto={laneStatisticsDto}
                                                                            infoWindowOpen={infoWindowOpen}
                                                                        />
                                                                    );
                                                                }
                                                                return reportContent;
                                                            })()}

                                                            {isShowEmission && (
                                                                <div className="d-flex gap-2 align-items-start highIndex">
                                                                    <ImageComponent
                                                                        path="/images/alternative/total-eission.svg"
                                                                        className="pe-0"
                                                                    />
                                                                    <h5 className="mb-0">
                                                                        Total Emissions (tCO2e):{" "}
                                                                        <span>
                                                                            {laneStatisticsDto?.data?.total_emissions !==
                                                                                "NaN"
                                                                                ? laneStatisticsDto?.data
                                                                                    ?.total_emissions
                                                                                : "N/A"}
                                                                        </span>
                                                                    </h5>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Fuel breakdown */}
                                                        {!isShowEmissionSaveReport &&
                                                            isShowEmission &&
                                                            laneStatisticsDto?.data?.fuel_types?.map(
                                                                (i: any) => (
                                                                    <div
                                                                        key={i?.fuel_type}
                                                                        className="border-bottom pb-2 d-flex gap-1 flex-column"
                                                                    >
                                                                        <div className="d-flex gap-2 align-items-start highIndex">
                                                                            <ImageComponent
                                                                                path="/images/alternative/fuel.svg"
                                                                                className="pe-0"
                                                                            />
                                                                            <h5 className="mb-0">
                                                                                Fuel Consumption ({i?.fuel_type}):{" "}
                                                                                {i?.fuel_consumption ? (
                                                                                    <span>
                                                                                        {" "}
                                                                                        {formatNumber(
                                                                                            true,
                                                                                            i?.fuel_consumption,
                                                                                            2
                                                                                        )}{" "}
                                                                                        Gallons
                                                                                    </span>
                                                                                ) : (
                                                                                    <span>N/A</span>
                                                                                )}
                                                                            </h5>
                                                                        </div>
                                                                        <div className="d-flex gap-2 align-items-start highIndex">
                                                                            <ImageComponent
                                                                                path="/images/alternative/mileage.svg"
                                                                                className="pe-0"
                                                                            />
                                                                            <h5 className="mb-0">
                                                                                Mileage:{" "}
                                                                                <span>
                                                                                    {formatNumber(
                                                                                        true,
                                                                                        distanceConverterInterModal(
                                                                                            i?.mileage,
                                                                                            defaultUnit
                                                                                        ),
                                                                                        2
                                                                                    )}{" "}
                                                                                    {defaultUnit === "miles"
                                                                                        ? "Mile"
                                                                                        : "Kms"}
                                                                                </span>
                                                                            </h5>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        </GoogleMap>
                        {ResetButton(mapRef, getCenter)}
                    </div>
                )}
            </div>
        );
    },
    (_, nextProps) => {
        return nextProps?.reloadData;
    }
);

export default GoogleMapLaneView;
