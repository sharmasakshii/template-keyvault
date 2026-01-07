import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import mapStyle from "../../constant/custom-map-style.json";
import ImageComponent from "../../component/images"
import styles from '../../scss/config/_variable.module.scss'
import { checkSafariLoad, getDirection, getDirectionRender, getMarkerPosition, initialCenter } from "./MapFunctions";

const MapLaneBenchMark = React.memo(
  (props: any) => {
    const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;

    const [response, setResponse] = useState(null);
    const [center, setCenter] = useState(initialCenter)
    const [markerList, setMarkerList] = useState({lat: 0,lng: 0});

    const [isLoadingCordinate, setIsLoadingCordinate] = useState(true);

    useEffect(()=>{
      getMarkerPosition(response, setMarkerList)
    },[response])


    const containerStyle = {
      width: "100%",
      height: "100vh",
    };

    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: googleMapsApiKey,
    });


    return (
      <div data-testid="google-map">
        <div className="map-outer-wrap">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={2}
              onLoad={(map: any) => {
                checkSafariLoad(map)
              }}
              options={{
                styles: mapStyle,
                minZoom: 2,
                maxZoom: 10,
                zoom: 2,
                zoomControl: false,
                keyboardShortcuts: false,
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
              }}
            >
              {markerList && (
                <Marker
                  position={{
                    lat: markerList?.lat,
                    lng: markerList?.lng,
                  }}
                  label=""
                >
                  <InfoWindow
                    position={{
                      lat: markerList?.lat,
                      lng: markerList?.lng,
                    }}
                  >
                    <div>
                      <div className="d-flex flex-column gap-3 index-wrapper">
                        <div className="d-flex gap-2 align-items-center highIndex">
                          {" "}
                          <ImageComponent path="/images/highIndex.svg" className="pe-0" />
                          <h5 className="mb-0">
                            Emissions Index:{" "}
                            <span>
                              {(
                                Math.round(
                                  (props?.dto?.company_emission_index || 0) *
                                  10
                                ) / 10
                              )?.toLocaleString("en-US", {
                                minimumFractionDigits: 1,
                              })}
                            </span>
                          </h5>{" "}
                        </div>
                        <div className="d-flex gap-2 align-items-center lowIndex">
                          {" "}
                          <ImageComponent path="/images/lowIndex.svg" className="pe-0" />
                          <h5 className="mb-0">
                            Intermodal Index:{" "}
                            <span>
                              {(
                                Math.round(
                                  (props?.dto?.company_intermodal_index || 0) * 10
                                ) / 10
                              )?.toLocaleString("en-US", {
                                minimumFractionDigits: 1,
                              })}
                            </span>
                          </h5>{" "}
                        </div>
                        <div className="d-flex gap-2 align-items-center lowIndex">
                          {" "}
                          <ImageComponent path="/images/upIndex.svg" className="pe-0" />
                          <h5 className="mb-0">
                            Alternative Fuel Index: <span>
                              {(
                                Math.round(
                                  (props?.dto?.alternative_fuel_index || 0) * 10
                                ) / 10
                              )?.toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                              })}
                            </span>
                          </h5>{" "}
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                </Marker>
              )}

              {getDirection(props?.origin, props?.destination, isLoadingCordinate, setIsLoadingCordinate, setResponse, setCenter, response)}
              
              {getDirectionRender(props?.origin, props?.destination, response, styles.orange)}

            </GoogleMap>
          ) : (
            <div className="graph-loader  d-flex justify-content-center align-items-center">
              <div className="spinner-border  spinner-ui d-flex justify-content-center align-items-center">
                <span className="visually-hidden"></span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
  (_, nextProps) => {
    return nextProps?.reloadData;
  }
);

export default MapLaneBenchMark;
