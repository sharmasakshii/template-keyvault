import React, { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyle from "../../constant/custom-map-style.json"
import styles from "../../scss/config/_variable.module.scss";
import { getImageUrl } from "utils";
import { calculateCenter, checkSafariLoad, getDirection, getDirectionRender, getMarkerPosition, initialCenter, ResetButton } from "./MapFunctions";

const EvDashMapView = React.memo(({ origin, destination, lane }: any) => {
    // Define state variables

    const [response, setResponse] = useState<any>(null);
    const [markerDto, setMarkerDto] = useState<any>(null);
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);
    const [isLoadingCordinate, setIsLoadingCordinate] = useState(true);
    const [center, setCenter] = useState(initialCenter)
    const mapRef = useRef(null);

    useEffect(() => {
        setIsLoadingCordinate(true)
    }, [origin, destination])

    useEffect(() => {
        getMarkerPosition(response, setMarkerDto)
    }, [response])

    const getCenter = () => {
        setCenter(calculateCenter(response))
    }

    const containerStyle = {
        width: "100%",
        height: "100vh",
    };

    const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey
    });

    return (
        <div data-testid="google-map">
            {isLoaded && <div className="map-outer-wrap">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={2}
                    onLoad={(map: any) => {
                        mapRef.current = map
                        checkSafariLoad(map)
                    }}
                    options={{
                        styles: mapStyle,
                        minZoom: 4,
                        maxZoom: 15,
                        mapTypeControl: false,
                        streetViewControl: false,
                        zoomControl: true,
                        keyboardShortcuts: false,
                        fullscreenControl: false
                    }}
                >
                    {getDirection(origin, destination, isLoadingCordinate, setIsLoadingCordinate, setResponse, setCenter, response)}

                    {getDirectionRender(origin, destination, response, styles.orange)}   

                    {markerDto && <Marker
                        position={markerDto}
                        label=""
                        onClick={() => { setInfoWindowOpen(true) }}
                        icon={{ url: getImageUrl("/images/company/transIcon.svg") }}
                    >
                        {infoWindowOpen && (
                            <InfoWindow onCloseClick={() => setInfoWindowOpen(false)}>
                                <div>
                                    <h4 className="colorPrimary font-18">Lane Details</h4>
                                    <h5 className="colorPrimary mb-2 font-14">Origin:  {lane?.origin}</h5>
                                    <h5 className="colorPrimary mb-2 font-14">Destination:  {lane?.destination}</h5>
                                    <h5 className="colorPrimary mb-2 font-14">Shipments: {lane.shipment}</h5>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                    }
                </GoogleMap>
                {ResetButton(mapRef, getCenter)}
            </div>}
        </div>
    )
}, (_, nextProps) => {
    return nextProps?.reloadData
}
)

export default EvDashMapView