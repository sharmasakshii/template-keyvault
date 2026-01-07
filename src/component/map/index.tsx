import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import mapStyle from "../../constant/custom-map-style.json"
import styles from "../../scss/config/_variable.module.scss";
import { calculateCenter, checkSafariLoad, getDirection, getDirectionRender, ResetButton } from "./MapFunctions";

const GoogleMapView = React.memo(({ origin, destination }: any) => {
    // Define state variables
    const initialCenter = { lat: 34.5204, lng: -105.8567 }
    const [response, setResponse] = useState<any>(null);
    const [isLoadingCordinate, setIsLoadingCordinate] = useState(true);
    const [center, setCenter] = useState(initialCenter)
    const mapRef = useRef(null);

    useEffect(() => {
        setIsLoadingCordinate(true)
    }, [origin, destination])

    const containerStyle = {
        width: "100%",
        height: "100vh",
    };

    const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey
    });

    const getCenter = () => {
        if (response?.routes?.length > 0) {
            setCenter(calculateCenter(response))
        }
    }

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

                </GoogleMap>
                {ResetButton(mapRef, getCenter)}
            </div>}
        </div>
    )

}, (_, nextProps) => {
    return nextProps?.reloadData
}
)

export default GoogleMapView