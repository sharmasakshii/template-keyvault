import React, { useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import mapStyle from "../../constant/custom-map-style.json"
import { getImageUrl, formatNumber } from "utils";
import { checkSafariLoad, getOffsetPosition, initialCenter, ResetButton } from "./MapFunctions";

const FuelStopMap = React.memo(({ page, fuelStopData, containerStyle = {
    height: "550px",
    width: '100%',
} }: any) => {
    // Define state variables
    const [infoWindowOpen, setInfoWindowOpen] = useState<any>(null);
    const [center, setCenter] = useState(initialCenter)
    const mapRef = useRef(null);

    const getCenter = () => {
        setCenter(initialCenter)
    }

    const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey
    });

    const getImage = (el: any) => {
        if (page === "ev") {
            return "/images/greenStation.png"
        }
        if (page === "fuelStop" && el?.image_uri) {
            return el?.image_uri
        }
        if (page === "bioDiesel" || "fuelReport") {
            return "/images/fuel-icon-map.svg"
        }
        return "/images/default-location-pin.svg"
    }
    return (
        <div data-testid="google-map">
            {isLoaded && <div className="map-outer-wrap">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={4}
                    onLoad={(map: any) => {
                        mapRef.current = map
                        checkSafariLoad(map)
                    }}
                    options={{
                        styles: mapStyle,
                        minZoom: 4,
                        maxZoom: 100,
                        zoomControl: true,
                        keyboardShortcuts: false,
                        scrollwheel: true,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                    }}
                >
                    <MarkerClusterer
                        options={{
                            gridSize: 20,
                            imagePath: "/knowledge-images/cluster"
                        }}>
                        {(clusterer) => fuelStopData?.map((i: any, index: number) => (
                            <Marker
                                key={`${i?.latitude}_${i?.longitude}_${i?.id}`}
                                position={getOffsetPosition(Number.parseFloat(i.latitude), Number.parseFloat(i.longitude), 0.00005)} // Adjust the offset value}
                                clusterer={clusterer}
                                label=""
                                icon={getImageUrl(getImage(i))}
                                onClick={() => {
                                    setInfoWindowOpen({ id: index + 1, dto: i });
                                }}
                            >
                                {infoWindowOpen?.id === index + 1 && (
                                    <InfoWindow onCloseClick={() => setInfoWindowOpen(null)}>
                                        <>
                                            {page === "ev" && <div className="d-flex flex-column gap-3 index-wrapper">
                                                <div className="d-flex gap-2 align-items-center highIndex">
                                                    <h5 className="mb-0">
                                                        Year: <span className="font-14">{infoWindowOpen?.dto?.year}</span>
                                                    </h5>
                                                </div>
                                                <div className="d-flex gap-2 align-items-center highIndex">
                                                    <h5 className="mb-0">
                                                        Location Name: <span className="font-14">{infoWindowOpen?.dto?.name}</span>
                                                    </h5>
                                                </div>
                                            </div>
                                            }
                                            {page === "fuelStop" && <div>
                                                <div className="text-center">
                                                    <img
                                                        src={getImageUrl(getImage(i))}
                                                        alt="logo"
                                                        className=" profileimgWrap"
                                                    />
                                                </div>
                                                <div className="d-flex flex-column gap-3 index-wrapper">
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Name: <span className="font-16">{i?.product_type_name}</span>
                                                        </h5>
                                                    </div>
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            City: <span className="font-16">{infoWindowOpen?.dto?.city}</span>
                                                        </h5>
                                                    </div>
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Fuel Stop: <span className="font-16">{infoWindowOpen?.dto?.name}</span>
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                            {page === "bioDiesel" && <div>
                                                <div className="d-flex flex-column gap-3 index-wrapper bioDiesel">
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Name: <span className="font-16">{infoWindowOpen?.dto?.name}</span>
                                                        </h5>
                                                    </div>
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Total Transactions: <span className="font-16">{formatNumber(true, infoWindowOpen?.dto?.totalTransactions, 0)}</span>
                                                        </h5>
                                                    </div>
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Fuel Consumptions: <span className="font-16">{formatNumber(true, infoWindowOpen?.dto?.totalFuelConsumption, 2)} <span className="font-14 fw-medium">Gallons</span></span>
                                                        </h5>
                                                    </div>
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Total Emissions: <span className="font-16">{formatNumber(true, infoWindowOpen?.dto?.totalEmissions, 2)} <span className="font-14 fw-medium">tCO2e</span></span>
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                            {page === "fuelReport" && <div>
                                                <div className="d-flex flex-column gap-3 index-wrapper bioDiesel">
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Name: <span className="font-16">{infoWindowOpen?.dto?.name}</span>
                                                        </h5>
                                                    </div>
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Total Transactions: <span className="font-16">{formatNumber(true, infoWindowOpen?.dto?.total_transactions, 0)}</span>
                                                        </h5>
                                                    </div>
                                                    <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                            Fuel Consumption: <span className="font-16">{formatNumber(true, infoWindowOpen?.dto?.total_fuel_consumption, 2)} <span className="font-14 fw-medium">Gallons</span></span>
                                                        </h5>
                                                    </div>
                                                    {infoWindowOpen.dto?.emissions && <div className="d-flex gap-2 align-items-center highIndex">
                                                        <h5 className="mb-0">
                                                           Total Emissions: <span className="font-16">{formatNumber(true, infoWindowOpen?.dto?.emissions, 2)} <span className="font-14 fw-medium">tCO2e</span></span>
                                                        </h5>
                                                    </div>}
                                                </div>
                                            </div>
                                            }
                                        </>
                                    </InfoWindow>
                                )}
                            </Marker>
                        ))
                        }
                    </MarkerClusterer>
                </GoogleMap>
                {ResetButton(mapRef, getCenter)}
            </div>}
        </div>
    )
}, (prevProps, nextProps) => {
    // Re-render only if fuelStopData has changed
    return prevProps.fuelStopData === nextProps.fuelStopData;
}
)

export default FuelStopMap