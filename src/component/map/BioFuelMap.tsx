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
import {
    getStrokeOpacity,
    getMapIcon,
    getImageUrl
} from "../../utils";
import { calculatePolyLineCenter, checkSafariLoad, getOffsetPosition, initialCenter, RenderMarkerWithInfoWindow, ResetButton } from "./MapFunctions";

const BioFuelMap = React.memo((props: any) => {
    const { showFullScreen, zoom, strokeWeight, scaledSize, fuelStops, locations } = props
    const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;
    const [infoWindowOpen, setInfoWindowOpen] = useState<any>(null);
    const [center, setCenter] = useState(initialCenter);
    const mapRef = useRef(null);


    const handleSetCenter = (data:any) =>{
        if(data?.length > 0){
            setCenter(calculatePolyLineCenter(data))
        }
    }

    useEffect(() => {
        handleSetCenter(locations)
    }, [locations])

    const containerStyle = {
        width: "100%",
        height: "100vh",
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
    });

    return (isLoaded ? (
                <>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        zoom={zoom}
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

                        {showFullScreen &&
                            <MarkerClusterer options={{
                                gridSize: 10,
                                imagePath: "/knowledge-images/cluster"
                            }}>
                                {(clusterer) => fuelStops?.map(
                                    (i: any, index: number) => (
                                        <Marker
                                            key={i?.fuel_stop_id}
                                            clusterer={clusterer}
                                            position={getOffsetPosition(Number.parseFloat(i?.latitude), Number.parseFloat(i?.longitude), 0.00005)}
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
                                                                    Name: <span>{infoWindowOpen?.dto?.product_name}</span>
                                                                </h5>{" "}
                                                            </div>
                                                            <div className="d-flex gap-2 align-items-center highIndex">
                                                                {" "}
                                                                <h5 className="mb-0">
                                                                    City:{" "}
                                                                    <span>{infoWindowOpen?.dto?.city}</span>
                                                                </h5>{" "}
                                                            </div>
                                                            <div className="d-flex gap-2 align-items-center highIndex">
                                                                {" "}
                                                                <h5 className="mb-0">
                                                                    Fuel Stop: <span>{infoWindowOpen?.dto?.name}</span>
                                                                </h5>{" "}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </InfoWindow>
                                            )}
                                        </Marker>
                                    )
                                )}
                            </MarkerClusterer>
                        }

                        {locations && <RenderMarkerWithInfoWindow origin={locations[0]} destination={ locations[locations.length - 1]} icon={{
                                        url: getImageUrl("/images/Union.svg"),
                                        scaledSize: new window.google.maps.Size(scaledSize, scaledSize)}}
                                        />
                        }

                        {locations &&
                            <Polyline
                                path={locations?.map(
                                    (i: any) => ({
                                        lat: Number.parseFloat(i?.latitude),
                                        lng: Number.parseFloat(i?.longitude),
                                    })
                                )}
                                options={{
                                    strokeColor: (styles.orange),
                                    strokeOpacity: getStrokeOpacity("DRIVING"),
                                    strokeWeight: strokeWeight,
                                    icons: getMapIcon("DRIVING"),
                                }}
                            />
                        }
                    </GoogleMap>
                    {showFullScreen && ResetButton(mapRef, ()=>handleSetCenter(locations))}
                </>
            ) : (
                <div className="graph-loader  d-flex justify-content-center align-items-center">
                    <div className="spinner-border  spinner-ui d-flex justify-content-center align-items-center">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            )
    );
},
    (_, nextProps) => {
        return nextProps?.reloadData;
    }
);

export default BioFuelMap;
