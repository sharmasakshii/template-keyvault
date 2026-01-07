import React, { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Polyline,
    InfoWindow,
    MarkerClusterer
} from "@react-google-maps/api";
import mapStyle from "../../constant/custom-map-style.json";
import styles from "../../scss/config/_variable.module.scss";
import { getStrokeOpacity, getMapIcon, getImageUrl } from "../../utils";
import { calculatePolyLineCenter, checkSafariLoad, initialCenter, ResetButton, calculateClusterSize, getOffsetPosition, RenderMarkerWithInfoWindow } from "./MapFunctions";

const OptimusMap = React.memo((props: any) => {
    const { laneData, isCluster=false } = props
    const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;
    const [infoWindowOpen, setInfoWindowOpen] = useState<any>(null);
    const [center, setCenter] = useState(initialCenter);
    const mapRef = useRef(null);

    const containerStyle = {
        width: "100%",
        height: "100vh",
    };

    const handleSetCenter = (data: any) => {
        if (data?.laneCordinates?.length > 0) {
            setCenter(calculatePolyLineCenter(data?.laneCordinates))
        }
    }

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
    });

    useEffect(() => {
        setInfoWindowOpen(null)
        if (laneData?.laneCordinates) {
            handleSetCenter(laneData)
        }
    }, [laneData])

    return (
        <>
            {isLoaded &&
                <div className="map-outer-wrap">
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        zoom={5}
                        center={center}
                        onLoad={(map: any) => {
                            mapRef.current = map
                            checkSafariLoad(map)
                        }}
                        options={{
                            styles: mapStyle,
                            minZoom: 2,
                            maxZoom: 15,
                            zoomControl: true,
                            keyboardShortcuts: false,
                            scrollwheel: true,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            streetViewControl: false,
                        }}
                    >
                        {laneData?.fuelStopData?.length > 0 &&
                            <>
                            <RenderMarkerWithInfoWindow origin={laneData?.laneCordinates[0]} destination={laneData?.laneCordinates[
                                laneData?.laneCordinates?.length - 1
                            ]} />
                                <MarkerClusterer options={{
                                    gridSize: calculateClusterSize(laneData?.fuelStopData?.length),
                                    imagePath: "/knowledge-images/cluster"
                                }}>
                                    {(clusterer) =>
                                        laneData?.fuelStopData?.map((i: any, index: number) => (
                                            <Marker
                                                key={i?.fuel_stop_id}
                                                position={getOffsetPosition(Number.parseFloat(i.latitude), Number.parseFloat(i.longitude), 0.00005)}
                                                clusterer={isCluster && clusterer}
                                                label=""
                                                onClick={() => {
                                                    setInfoWindowOpen({ id: index + 1, dto: i });
                                                }}
                                                icon={
                                                    i?.provider_image && getImageUrl(i?.provider_image)
                                                }
                                            >
                                                {infoWindowOpen?.id === index + 1 && (
                                                    <InfoWindow onCloseClick={() => setInfoWindowOpen(null)}>
                                                        <div>
                                                            <div className="text-center">
                                                                <img
                                                                    src={
                                                                        i?.provider_image && getImageUrl(i?.provider_image)
                                                                    }
                                                                    alt="logo"
                                                                    className=" profileimgWrap"
                                                                />
                                                            </div>
                                                            <div className="d-flex flex-column gap-3 index-wrapper">
                                                                <div className="d-flex gap-2 align-items-center highIndex">
                                                                    {" "}
                                                                    <h5 className="mb-0">
                                                                        Name: <span className="font-16">{infoWindowOpen?.dto?.product_name}</span>
                                                                    </h5>{" "}
                                                                </div>
                                                                <div className="d-flex gap-2 align-items-center highIndex">
                                                                    {" "}
                                                                    <h5 className="mb-0">
                                                                        City:{" "}
                                                                        <span className="font-16">{infoWindowOpen?.dto?.city}</span>
                                                                    </h5>{" "}
                                                                </div>
                                                                <div className="d-flex gap-2 align-items-center highIndex">
                                                                    {" "}
                                                                    <h5 className="mb-0">
                                                                        Fuel Stop: <span className="font-16">{infoWindowOpen?.dto?.name}</span>
                                                                    </h5>{" "}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </InfoWindow>
                                                )}
                                            </Marker>
                                        ))
                                    }
                                </MarkerClusterer>
                                <Polyline
                                    path={laneData?.laneCordinates?.map(
                                        (i: any) => ({
                                            lat: Number.parseFloat(i?.latitude),
                                            lng: Number.parseFloat(i?.longitude
                                            ),
                                        })
                                    )}
                                    options={{
                                        strokeColor: (styles.orange),
                                        strokeOpacity: getStrokeOpacity("DRIVING"),
                                        strokeWeight: 4,
                                        icons: getMapIcon("DRIVING"),
                                    }}
                                />
                            </>
                        }
                    </GoogleMap>
                    {ResetButton(mapRef, () => handleSetCenter(laneData))}
                </div>}
        </>
    );
},
    (_, nextProps) => {
        return nextProps?.reloadData;
    }
);

export default OptimusMap;
