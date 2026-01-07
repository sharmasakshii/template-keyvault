import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock the @react-google-maps/api library
jest.mock('@react-google-maps/api', () => ({
  ...jest.requireActual('@react-google-maps/api'),
  useJsApiLoader: jest.fn(),
  GoogleMap: jest.fn((props) => <div data-testid="google-map">{props.children}</div>),
  DirectionsRenderer: jest.fn(() => <div data-testid="directions-renderer" />),
  DirectionsService: jest.fn(() => <div data-testid="directions-service" />),
  Marker: jest.fn(() => <div data-testid="marker" />),

}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const createLatLngMock = (lat: number, lng: number) => ({
  lat: () => lat,
  lng: () => lng,
});
class GeocoderMock {
  public async geocode() {
    return Promise.resolve();
  }
}

export const RenderMap = (props: any) => {
  describe("GoogleMapView", () => {
    const mockNavigate = jest.fn();

    const setupGoogleMock = () => {
      global.window.google = {
        maps: {
          Geocoder: GeocoderMock,
          DirectionsService: jest.fn(() => ({
            route: jest.fn(),
          })),
          LatLng: jest.fn().mockImplementation(createLatLngMock), 
          SymbolPath: {
            CIRCLE: "CIRCLE",
            FORWARD_CLOSED_ARROW: "FORWARD_CLOSED_ARROW",
            FORWARD_OPEN_ARROW: "FORWARD_OPEN_ARROW",
            BACKWARD_CLOSED_ARROW: "BACKWARD_CLOSED_ARROW",
            BACKWARD_OPEN_ARROW: "BACKWARD_OPEN_ARROW",
          },
          TravelMode: {
            DRIVING: "DRIVING",
            TRANSIT: "TRANSIT",
            WALKING: "WALKING",
          },
          GeocoderStatus: {
            ERROR: "ERROR",
            INVALID_REQUEST: "INVALID_REQUEST",
            OK: "OK",
            OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
            REQUEST_DENIED: "REQUEST_DENIED",
            UNKNOWN_ERROR: "UNKNOWN_ERROR",
            ZERO_RESULTS: "ZERO_RESULTS",
          },
        } as any,
      };
    };

    beforeAll(() => {
      setupGoogleMock();
    });

    it("renders GoogleMapView with directions", async () => {
      (useJsApiLoader as jest.Mock).mockReturnValue({ isLoaded: true });
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

      const origin = "Origin";
      const destination = "Destination";
      const reloadData = false;

      render(
        <MemoryRouter>
          <props.component
            origin={origin}
            destination={destination}
            reloadData={reloadData}
          />
        </MemoryRouter>
      );

      expect(screen.getByTestId(props?.mapTestId)).toBeInTheDocument();
    });
  });
};


