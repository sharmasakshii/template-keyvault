import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
  InfoWindow,
  MarkerClusterer
} from "@react-google-maps/api";
import ImageComponent from "../images";
import mapStyle from "../../constant/custom-map-style.json";
import styles from "../../scss/config/_variable.module.scss"

import {
  timeConverter,
  avgList,
  distanceConverter,
  getLowHighImage,
  formatNumber,
  getImageUrl,
} from "../../utils";
import { evProductCode } from "constant";
import { calculatePolyLineCenter, checkSafariLoad, getOffsetPosition, RenderMarkerWithInfoWindow, ResetButton } from "./MapFunctions";


const containerStyle = {
  width: "100%",
  height: "100vh",
};

/**
 * Renders a Google Map component with markers and polylines based on the provided lane information.
 *
 * @param {any} props - The props object containing the lane information.
 * @return {JSX.Element} - The rendered Google Map component.
 */
const LanePathMap = (props: any) => {

  const [infoWindowOpen, setInfoWindowOpen] = useState<any>(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  const {
    baseLineDto,
    laneDto,
    zoom,
    showFuelStopsEV,
    lane,
    isBaseLine,
    clustererSize,
    selectedFuelStop
  } = props;
  let fuelStopList = baseLineDto?.recommendedKLaneFuelStop

  const selectedFuelStopProductCode = selectedFuelStop?.map((res: any) => res.product_code) || []

  if (!isBaseLine) {
    fuelStopList = lane?.recommendedKLaneFuelStop
  }
  let listOfFuelStopDto: any = [] 

  let alternativeFuelStopList =
    fuelStopList?.filter((res: any) => {
      const codes = res.product_codes
        ?.split(",")
        .map((c: string) => c.trim());

      const hasMatch = codes?.some((code: string) =>
        selectedFuelStopProductCode.includes(code)
      );
      return hasMatch;
    }) || [];

  let evFuelStopList = fuelStopList?.filter((res: any) => res.product_codes === evProductCode) || []
  listOfFuelStopDto = [...listOfFuelStopDto, ...alternativeFuelStopList]
  if (showFuelStopsEV) {
    listOfFuelStopDto = [...listOfFuelStopDto, ...evFuelStopList]
  }

  const [center, setCenter] = useState({
    lat: 32.626522,
    lng: -100.93929,
  });

  const onLoad = (map: any) => {
    mapRef.current = map
    calculateCenter();
    checkSafariLoad(map)
  };

  const mapRef = useRef(null);

  const calculateCenter = () => {
    if (baseLineDto?.recommendedKLaneCoordinate?.length > 0) {
      setCenter(calculatePolyLineCenter(baseLineDto?.recommendedKLaneCoordinate));
    }
  };

  const [laneAvgTimeDistance, setLaneAvgTimeDistance] = useState<any>({
    lane_avg_time: "",
    lane_avg_distance: "",
    lane_actual_time: "",
    lane_actual_distance: "",
  });

  const googleMapsApiKey: any = process.env.REACT_APP_GOOGLE_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
  });

  const handlePolylineClick = (polyline: any, position: any) => {
    setInfoWindowPosition(position); // Set the InfoWindow position
    const avgTime = avgList(laneDto?.data?.sortestPaths, "time");
    const avgDistance = avgList(laneDto?.data?.sortestPaths, "distance");
    const timeData = polyline?.time - avgTime;
    const distanceData = polyline?.distance - avgDistance;
    setLaneAvgTimeDistance({
      lane_avg_time: avgTime,
      lane_avg_distance: avgDistance,
      lane_actual_time: polyline?.time,
      lane_actual_distance: polyline.distance,
    });
    setInfoWindowOpen({
      time_saved: timeConverter(Math.abs(timeData)),
      distance_saved: formatNumber(true, distanceConverter(Math.abs(distanceData)), 1),
    }); // Set the InfoWindow content
  };

  useEffect(() => {
    setInfoWindowOpen(null)
  }, [lane])

  return <div data-testid="google-map" className="mapOutter map-outer-wrap">
    {isLoaded &&
      <>
        <GoogleMap
          data-testid="google-map"
          key={lane?.key}
          mapContainerStyle={containerStyle}
          center={center}
          onLoad={onLoad}
          zoom={zoom}
          options={{
            styles: mapStyle,
            minZoom: 3,
            maxZoom: 15,
            zoomControl: true,
            keyboardShortcuts: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          }}
        >
          {baseLineDto?.recommendedKLaneCoordinate && (
              <RenderMarkerWithInfoWindow origin={baseLineDto?.recommendedKLaneCoordinate[0]} destination={baseLineDto?.recommendedKLaneCoordinate[
                baseLineDto?.recommendedKLaneCoordinate?.length - 1
              ]} />
          )}

          {baseLineDto && <Polyline
            path={baseLineDto?.recommendedKLaneCoordinate?.map(
              (i: any) => ({
                lat: Number.parseFloat(i?.latitude),
                lng: Number.parseFloat(i?.longitude),
              })
            )}
            options={{
              strokeColor: (styles.orange)
            }}
          />}

          <MarkerClusterer
            options={{
              gridSize: clustererSize,
              imagePath: "/knowledge-images/cluster",
            }}
          >
            {(clusterer) =>
              listOfFuelStopDto?.map((i: any) => {
                const lat = Number.parseFloat(i.latitude);
                const lng = Number.parseFloat(i.longitude);
                  
                if (isNaN(lat) || isNaN(lng)) return null; // safety check
                return (
                  <Marker
                    key={i?.id}
                    position={getOffsetPosition(lat, lng, 0.00005)}
                    clusterer={clusterer}
                    label=""
                    icon={i?.provider_image && getImageUrl(i?.provider_image)}
                    onClick={() => {
                      setInfoWindowOpen({ id: i?.id, dto: i, lat, lng });
                    }}
                  />
                );
              })
            }
          </MarkerClusterer>

          {infoWindowOpen && (
            <InfoWindow
              position={{ lat: infoWindowOpen.lat, lng: infoWindowOpen.lng }}
              onCloseClick={() => setInfoWindowOpen(null)}
            >
              <div>
                <div className="text-center">
                  <img
                    src={
                      infoWindowOpen?.dto?.provider_image &&
                      getImageUrl(infoWindowOpen?.dto?.provider_image)
                    }
                    alt="logo"
                    className="profileimgWrap"
                  />
                </div>

                <div className="d-flex flex-column gap-3 index-wrapper">
                  <div className="d-flex gap-2 align-items-center highIndex">
                  {
                    infoWindowOpen?.dto?.product_codes && infoWindowOpen?.dto?.product_names && (
                      <h5 className="mb-0">
                        Name:{" "}
                        <span>
                          {
                            infoWindowOpen.dto.product_codes
                              .split(",")
                              .map((code: string, idx: number) => {
                                const trimmedCode = code.trim();
                                const nameArr = infoWindowOpen.dto.product_names
                                  .split(",")
                                  .map((n: string) => n.trim());
                                if (selectedFuelStopProductCode.includes(trimmedCode)) {
                                  return nameArr[idx];
                                }
                                return null;
                              })
                              .filter((n:any) => n !== null)
                              .join(", ") || infoWindowOpen.dto.product_names
                          }
                        </span>
                      </h5>
                    )
                  }
                  </div>
                  <div className="d-flex gap-2 align-items-center highIndex">
                    <h5 className="mb-0">
                      City: <span>{infoWindowOpen?.dto?.city}</span>
                    </h5>
                  </div>
                  <div className="d-flex gap-2 align-items-center highIndex">
                    <h5 className="mb-0">
                    Fuel Stop: <span>{infoWindowOpen?.dto?.fuel_stop_name ?? infoWindowOpen?.dto?.name}</span>
                    </h5>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}


          {!isBaseLine && <Polyline
            path={lane?.recommendedKLaneCoordinate?.map(
              (i: any) => ({
                lat: Number.parseFloat(i?.latitude),
                lng: Number.parseFloat(i?.longitude),
              })
            )}
            options={{
              zIndex: 10,
              strokeOpacity: 0.7,
              strokeColor: (styles.orange),
              strokeWeight: 4,
            }}
            onClick={(event) => { laneDto && handlePolylineClick(lane, event?.latLng?.toJSON()) }
            }
          />}
          {infoWindowOpen && infoWindowPosition && (
            <Marker position={infoWindowPosition}>
              <InfoWindow
                position={infoWindowPosition}
                onCloseClick={() => {
                  setInfoWindowOpen(null);
                  setInfoWindowPosition(null);
                }}
              >
                <div>
                  {/* Display information within the InfoWindow */}
                  <div className="d-flex flex-column gap-3 index-wrapper">
                    <div className="d-flex gap-2 align-items-center highIndex">
                      <ImageComponent
                        path={`/images/${getLowHighImage(laneAvgTimeDistance?.lane_actual_time, laneAvgTimeDistance?.lane_avg_time)}`}
                        className="mb-1"
                      />
                      <h5 className="mb-0">
                        Time : <span>{infoWindowOpen?.time_saved}</span>
                      </h5>
                    </div>
                    <div className="d-flex gap-2 align-items-center highIndex">
                      <ImageComponent
                        path={`/images/${getLowHighImage(laneAvgTimeDistance?.lane_actual_distance, laneAvgTimeDistance?.lane_avg_distance)}`}
                        className="mb-1"
                      />
                      <h5 className="mb-0">
                        Distance : <span>{infoWindowOpen?.distance_saved} Miles</span>
                      </h5>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
        {ResetButton(mapRef, calculateCenter)}
      </>}
  </div>

};

LanePathMap.defaultProps = {
  zoom: 5,
  clustererSize: 10
};
export default LanePathMap;