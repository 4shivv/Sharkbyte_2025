import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import SearchDrawer from "./SearchDrawer";

/* ------------------ DIRECTIONS COMPONENT ------------------ */
function Directions({ origin, destination }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;

    const service = new routesLibrary.DirectionsService();
    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: false,
    });

    setDirectionsService(service);
    setDirectionsRenderer(renderer);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !destination) return;

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((err) => console.error("Directions error:", err));
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

/* ------------------ MAIN MAP VIEW ------------------ */
export const MapView = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [userLocation, setUserLocation] = useState({
    lat: 40.7580, // Times Square
    lng: -73.9855,
  }); // ✅ Dummy location for testing
  const [destination, setDestination] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7580, lng: -73.9855 });

  return (
    <APIProvider apiKey={apiKey} libraries={["places", "routes"]}>
      <MapWithSearch
        userLocation={userLocation}
        mapCenter={mapCenter}
        setMapCenter={setMapCenter}
        destination={destination}
        setDestination={setDestination}
      />
    </APIProvider>
  );
};

/* ------------------ MAP + SEARCH ------------------ */
function MapWithSearch({
  userLocation,
  mapCenter,
  setMapCenter,
  destination,
  setDestination,
}) {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    if (placesLibrary) {
      setAutocomplete(new placesLibrary.AutocompleteService());
    }
  }, [placesLibrary]);

  const handleSearch = (query) => {
    setDestination(query);
  };

  return (
    <div className="w-screen h-screen relative">
      <Map
        defaultCenter={userLocation || mapCenter}
        minZoom={3}
        gestureHandling="greedy"
        disableDefaultUI={true}
        style={{ width: "full", height: "100%" }}
      />

      {/* Search bar overlay */}
      <SearchDrawer autocomplete={autocomplete} onSearch={handleSearch} />

      {/* Render directions from dummy start to searched destination */}
      {userLocation && destination && (
        <Directions origin={userLocation} destination={destination} />
      )}
    </div>
  );
}
