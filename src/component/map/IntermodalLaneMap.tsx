import React, { useState, useEffect, useRef } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Polyline,
    InfoWindow,
    DirectionsService,
} from "@react-google-maps/api";
import mapStyle from "../../constant/custom-map-style.json";
import styles from "../../scss/config/_variable.module.scss";
import {
    getStrokeOpacity,
    getMapIcon,
    getFirstLastElement,
    navigateToCarrier,
    getImageUrl,
    isPermissionChecked,
    getAddressName
} from "../../utils";
import { routeKey } from "constant"
import { calculatePolyLineCenter, checkSafariLoad, initialCenter, ResetButton } from "./MapFunctions";

const polylineDecode = require('google-polyline')

const getLocationName = (key: any, res: any, location: any) => {
    return key === "destination" ? res.routes[0]?.legs[0]?.end_location : location
}

const IntermodalLaneMap = React.memo((props: any) => {

    const [response, setResponse] = useState(props?.list);
    const [markerResponse, setMarkerResponse] = useState({});
    const [location, setLocation] = useState<any>(null);
    const [locationDestination, setLocationDestination] = useState<any>(null);
    const [mapCenter, setMapCenter] = useState<any>(initialCenter)
    const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;
    const [infoWindowOpen, setInfoWindowOpen] = useState<any>(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
    });
    
    const USA_CENTER = { lat: 37.0902, lng: -95.7129 }; // fallback center if nothing else



    const { laneIntermodalCordinateData, mapOrigin, mapDestination, navigate, projectId, laneName, loginDetails, configConstants, selectedFuelOption } = props;
    const [isLoadingCordinate, setIsLoadingCordinate] = useState(true);
    const permissionsDto = loginDetails?.data?.permissionsData || []
    const mapRef = useRef<google.maps.Map | null>(null);
  

    const handleSetCenter = (data: any) => {
        // If lane coordinates array exists -> calculate center
        if (data && data.length > 0) {
            setMapCenter(calculatePolyLineCenter(data))
        } else {
            // fallback to initialCenter if provided, otherwise USA_CENTER
            setMapCenter(initialCenter ?? USA_CENTER);
        }
    }
    useEffect(() => {
        setResponse(props?.list);
    }, [props?.list]);

    // Clear stale markers/response whenever laneIntermodalCordinateData changes
    useEffect(() => {
        // reset marker/response state to avoid showing old terminals
        setMarkerResponse({});
        setResponse(props?.list);
        setIsLoadingCordinate(true);
        
        // compute & set map center and get addresses (if loaded)
        if (isLoaded) {
            const center = selectedFuelOption?.value === "is_intermodal" ? laneIntermodalCordinateData?.laneCordinates
                ?.recommendedTerminalData?.[0] : laneIntermodalCordinateData?.recommendedTerminalData?.[0]

            const centerDestination =
                selectedFuelOption?.value === "is_intermodal"
                    ? laneIntermodalCordinateData?.laneCordinates?.recommendedTerminalData?.[laneIntermodalCordinateData?.laneCordinates?.recommendedTerminalData?.length - 1]
                    : laneIntermodalCordinateData?.recommendedTerminalData?.[laneIntermodalCordinateData?.recommendedTerminalData?.length - 1];
            handleSetCenter(
                selectedFuelOption?.value === "is_intermodal"
                    ? laneIntermodalCordinateData?.laneCordinates?.recommendedTerminalData
                    : laneIntermodalCordinateData?.recommendedTerminalData
            );
            
            getAddressName(center, (address: any) => {
                setLocation(address)
            })
            getAddressName(centerDestination, (address: any) => {
                setLocationDestination(address)
            })
        } else {
            // even if not loaded, set a sensible center fallback
            handleSetCenter(
                selectedFuelOption?.value === "is_intermodal"
                    ? laneIntermodalCordinateData?.laneCordinates?.recommendedTerminalData
                    : laneIntermodalCordinateData?.recommendedTerminalData
            );
        }
    }, [laneIntermodalCordinateData, selectedFuelOption, isLoaded]);

    const directionsCallback = (i: any, res: any) => {
        if (isLoadingCordinate && (response === null || res.status === "OK") && res?.request?.destination?.query) {
            setIsLoadingCordinate(false);
            const startLocation = res.routes[0]?.legs[0]?.start_location;
            const endLocation = getLocationName(i?.key, res, startLocation);

            setMarkerResponse((prevState: any) => ({
                ...prevState,
                [i.key]: {
                    key: i.key,
                    lat: endLocation?.lat(),
                    lng: endLocation?.lng(),
                    type: res.request?.travelMode,
                },
            }));
            setResponse((prevState: any) => ({
                ...prevState,
                [i.key]: { key: i.key, polyline: polylineDecode?.decode(res.routes[0]?.overview_polyline) },
            }));
        }
    };

    const getCenterFromMarkers = (markers: any[]) => {
        if (!markers.length) return null;

        const latitudes = markers.map(m => m.lat);
        const longitudes = markers.map(m => m.lng);

        const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

        return { lat: avgLat, lng: avgLng };
    };
    useEffect(() => {
        const markerList = Object.values(markerResponse);

        if (mapRef.current && markerList.length > 0) {
            const center = getCenterFromMarkers(markerList);
            if (center) {
                mapRef.current.panTo(center);
            }
        }
    }, [markerResponse]);


    const containerStyle = {
        width: "100%",
        height: "100vh",
    };

    const navigateToCarrierDetail = (carrierCode: string) => {
        if (isPermissionChecked(permissionsDto, routeKey?.Segmentation)?.isChecked) {
            navigate(navigateToCarrier(carrierCode, laneName, projectId, configConstants?.data?.DEFAULT_YEAR))
        }
    }

    const terminalData =
        selectedFuelOption?.value === "is_intermodal"
            ? laneIntermodalCordinateData?.laneCordinates?.recommendedTerminalData
            : laneIntermodalCordinateData?.recommendedTerminalData;

    const carrierData =
        selectedFuelOption?.value === "is_intermodal"
            ? laneIntermodalCordinateData?.laneCordinates
            : laneIntermodalCordinateData;

    const intermodalData =
        selectedFuelOption?.value === "is_intermodal"
            ? laneIntermodalCordinateData?.laneCordinates?.recommendedIntermodalData
            : laneIntermodalCordinateData?.recommendedIntermodalData;

    const providerData =
        selectedFuelOption?.value === "is_intermodal"
            ? laneIntermodalCordinateData?.laneCordinates
            : laneIntermodalCordinateData;

    return (
        <div className="mapOutter map-outer-wrap" data-testid="google-map">
            {isLoaded &&
                <>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        zoom={5}
                        onLoad={(map: any) => {
                            mapRef.current = map
                            checkSafariLoad(map)
                            // ensure map centers to computed center on load
                            if (mapCenter) {
                                try {
                                    map.panTo(mapCenter)
                                } catch (e) {
        
                                }
                            }
                        }}
                        options={{
                            styles: mapStyle,
                            minZoom: 2,
                            maxZoom: 15,
                            zoomControl: true,
                            keyboardShortcuts: false,
                            scrollwheel: true,
                            mapTypeControl: false,
                            streetViewControl: false,
                            center: mapCenter,
                            fullscreenControl: false
                        }}
                    >
                        {Object.values(markerResponse)?.map((i: any) => (
                            <Marker
                                key={i?.key}
                                position={{
                                    lat: i?.lat,
                                    lng: i?.lng,
                                }}
                                label=""
                                icon={carrierData?.carrier_image && getImageUrl(carrierData?.carrier_image)}
                                onClick={() => navigateToCarrierDetail(carrierData?.carrier_code)}
                            ></Marker>
                        ))}
                        {intermodalData && getFirstLastElement(intermodalData)?.map(
                            (i: any, index: number) => (
                                <Marker
                                    key={i?.terminal_id}
                                    position={{
                                        lat: Number.parseFloat(i?.latitude),
                                        lng: Number.parseFloat(i?.longitude),
                                    }}
                                    label=""
                                    onClick={() => {
                                        setInfoWindowOpen({ id: index + 1, dto: i });
                                    }}
                                    icon={getImageUrl("/images/terminalIcon.svg")}
                                >

                                    {infoWindowOpen?.id === index + 1 && (
                                        <InfoWindow onCloseClick={() => setInfoWindowOpen(null)}>
                                            <div>
                                                <div className="d-flex flex-column gap-3 index-wrapper">
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        {" "}
                                                        <h5 className="mb-0">
                                                            Terminal Id:{" "}
                                                            <span className="font-14">{infoWindowOpen?.dto?.terminal_id}</span>
                                                        </h5>{" "}
                                                    </div>

                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        {" "}
                                                        <h5 className="mb-0">
                                                            Terminal Name:{" "}
                                                            <span className="font-14">{infoWindowOpen?.dto?.terminal_name}</span>
                                                        </h5>{" "}
                                                    </div>
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        {" "}
                                                        <h5 className="mb-0">
                                                            Terminal Company:{" "}
                                                            <span className="font-14">{infoWindowOpen?.dto?.terminal_company}</span>
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </Marker>
                            )
                        )}

                        <Marker
                            position={{
                                lat: Number.parseFloat(
                                    terminalData?.[Math.trunc(terminalData?.length / 2)]?.latitude
                                ),
                                lng: Number.parseFloat(
                                    terminalData?.[Math.trunc(terminalData?.length / 2)]?.longitude
                                )
                            }}
                            label=""
                            icon={providerData?.provider_image && getImageUrl(providerData?.provider_image)}
                        ></Marker>

                        {location && locationDestination && [{
                            key: "source",
                            origin: `${mapOrigin}, USA`.toLocaleLowerCase(),
                            destination: location,

                        }, {
                            key: "destination",
                            origin: locationDestination,
                            destination: `${mapDestination}, USA`,
                        }]
                            ?.map((i: any) => (
                                <DirectionsService
                                    key={i?.key}
                                    options={{
                                        origin: i?.origin,
                                        destination: i?.destination,
                                        travelMode: google.maps.TravelMode.DRIVING,
                                    }}
                                    callback={(res) =>
                                        directionsCallback(i, res)
                                    }
                                ></DirectionsService>
                            ))}
                        {response &&
                            Object.values(response)?.map((i: any) => {
                                return (

                                    <Polyline
                                        key={i?.key}
                                        path={i?.polyline?.map(
                                            (i: any) => ({
                                                lat: Number.parseFloat(i[0]),
                                                lng: Number.parseFloat(i[1]),
                                            })
                                        )}
                                        options={{
                                            strokeColor: (styles.orange),
                                            strokeOpacity: getStrokeOpacity("DRIVING"),
                                            strokeWeight: 4,
                                            icons: getMapIcon("DRIVING"),
                                        }}
                                    />
                                )
                            }
                            )
                        }

                        {
                            <Polyline
                                path={terminalData?.map(
                                    (i: any) => ({
                                        lat: Number.parseFloat(i?.latitude),
                                        lng: Number.parseFloat(i?.longitude),
                                    })
                                )}
                                options={{
                                    strokeColor: (styles.orange),
                                    strokeOpacity: getStrokeOpacity("TRANSIT"),
                                    strokeWeight: 4,
                                    icons: getMapIcon("TRANSIT"),
                                }}
                            />
                        }
                    </GoogleMap>
                    {ResetButton(mapRef, () => handleSetCenter(terminalData))}
                </>}
        </div>
    );
},
    (_, nextProps) => {
        return nextProps?.reloadData;
    }
);

export default IntermodalLaneMap;
