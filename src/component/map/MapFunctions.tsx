import { DirectionsRenderer, DirectionsService, Marker } from "@react-google-maps/api";
import ButtonComponent from "component/forms/button";
import styles from "../../scss/config/_variable.module.scss";
import { createPngTileLayer, isOldSafari } from "utils";

const polyline = require('google-polyline')

export const initialCenter = { lat: 40, lng: -100.93929 }

export const checkSafariLoad = (map: any) => {
  if (isOldSafari()) {
    const tileLayer = createPngTileLayer();
    map.overlayMapTypes.insertAt(0, tileLayer);
  }
}

export const calculateCenter = (res: any) => {
  const result: any = polyline.decode(res?.routes[0]?.overview_polyline)
  return {
    lat: result[Math.floor(result.length / 2)][0],
    lng: result[Math.floor(result.length / 2)][1]
  }
}

export const calculatePolyLineCenter = (data: any) => {
  return {
    lat: Number.parseFloat(data[Math.trunc(data?.length / 2)]?.latitude),
    lng: Number.parseFloat(data[Math.trunc(data?.length / 2)]?.longitude
    )
  }
}

// Callback function for handling the response from DirectionsService
export const mapDirectionsCallback = (
  res: any,
  isLoadingCoordinate: boolean,
  setIsLoadingCoordinate: (value: boolean) => void,
  setResponse: (res: any) => void,
  setCenter: (center: { lat: number; lng: number }) => void,
  response: any
) => {
  if (isLoadingCoordinate && (response === null || res.status === "OK") && res?.request?.destination?.query && res?.routes?.length > 0) {
    setIsLoadingCoordinate(false);
    setResponse(res);
    setCenter(calculateCenter(res))
  }
};

// Type definition for the function arguments
export const getDirection = (
  origin: string,
  destination: string,
  isLoadingCoordinate: boolean,
  setIsLoadingCoordinate: (value: boolean) => void,
  setResponse: (res: any) => void,
  setCenter: (center: { lat: number; lng: number }) => void,
  response: any
) => {
  // Conditional rendering with a ternary operator
  return (origin && destination) ? (
    <DirectionsService
      data-testid="directions-service"
      options={{
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      }}
      callback={(res: any) =>
        mapDirectionsCallback(
          res,
          isLoadingCoordinate,
          setIsLoadingCoordinate,
          setResponse,
          setCenter,
          response
        )
      }
    />
  ) : null; // Render nothing if no origin or destination
};

export const getDirectionRender = (origin: string, destination: string, response: any, color: any = styles.orange) => {
  return (origin && destination && response !== null) ? (
    <DirectionsRenderer
      data-testid="directions-renderer"
      routeIndex={0}
      options={{
        routeIndex: 0,
        directions: response,
        polylineOptions: { strokeColor: color },
      }}
    />
  ) : null
}

export const getMarkerPosition = (response: any, setMarkerPosition: any) => {
  if (response?.routes) {
    setMarkerPosition(calculateCenter(response))
  } else {
    setMarkerPosition(null)
  }
}

export const handleResetZoom = (mapRef: any, setCenter: any, zoomSize = 5) => {
  if (mapRef.current) {
    const map: any = mapRef.current;
    map.setZoom(zoomSize);
    setCenter()
  }
};

export const ResetButton = (mapRef: any, setCenter: any, zoomSize: number = 5) => {
  return <ButtonComponent
    data-toggle="tooltip" data-placement="left" title="Reset Zoom"
    imagePath="/images/zoomIcon.svg"
    imageTooltipTitle="Reset Zoom"
    btnClass="fw-medium resetBtn-zoom"
    onClick={() => handleResetZoom(mapRef, setCenter, zoomSize)} />
}

export const calculateClusterSize = (fuelStopDataLength: number) => {
  const minClusterSize = 2;
  const maxClusterSize = 30;

  // Use a logarithmic scale for smoother transitions
  // Adjust the log base and scaling factor to your needs
  const logBase = 2; // You can adjust this base to change scaling behavior
  const scaleFactor = 10; // Adjust the scale factor to control growth rate

  // Calculate cluster size using logarithmic scaling
  const clusterSize = minClusterSize + Math.log(fuelStopDataLength + 1) / Math.log(logBase) * scaleFactor;

  // Clamp the cluster size to the min and max values
  return Math.min(maxClusterSize, Math.max(minClusterSize, clusterSize));
};

let seed = Date.now(); // Initialize the seed

function lcg() {
  seed = (seed * 16807) % 2147483647; // LCG formula
  return seed / 2147483647; // Normalize to [0, 1)
}

export const getOffsetPosition = (lat: number, lng: number, offset: number) => {
  return {
    lat: lat + (lcg() - 0.5) * offset,
    lng: lng + (lcg() - 0.5) * offset,
  };
}

export const RenderMarkerWithInfoWindow = ({
  origin,
  destination, 
  icon
}: any) => {

  return (
    <>
      <Marker
        position={{
          lat: Number.parseFloat(origin?.latitude),
          lng: Number.parseFloat(origin?.longitude)
        }}
        label=""
        icon = {icon}
      />
      <Marker
        position={{
          lat: Number.parseFloat(destination?.latitude),
          lng: Number.parseFloat(destination?.longitude)
        }}
        label=""
        icon = {icon}
      />
    </>
  );
};
