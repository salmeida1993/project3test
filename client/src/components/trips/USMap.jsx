import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import statesData from "../../data/states.json";
import statesGeoJSON from "../../data/gz_2010_us_040_00_5m.json";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Create a mapping from state abbreviation to full state name
// Example: { "CA": "California", "TX": "Texas", ... }
const stateAbbrToName = Object.fromEntries(
  statesData.map(({ code, name }) => [code, name])
);

export default function USMap({ visitedStates = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Map visited state codes to full state names
  const visitedStateNames = visitedStates
    .map((code) => stateAbbrToName[code])
    .filter(Boolean);

  console.log("Visited state names:", visitedStateNames); // DEBUG

  const [mapLoaded, setMapLoaded] = React.useState(false);

  // Define fill color expression for Mapbox
  const fillColor = [
    "match",
    ["get", "NAME"],
    ...(visitedStateNames.length > 0
      ? visitedStateNames.flatMap((name) => [name, "#3CB043"])
      : ["__none__", "#E0E0E0"]), // dummy pair so expression is never invalid
    "#E0E0E0", // default color
  ];

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.5795, 39.8283],
      zoom: 3,
    });
    map.current.on("load", () => {
      map.current.addSource("states", {
        type: "geojson",
        data: statesGeoJSON,
      });
      map.current.addLayer({
        id: "state-fills",
        type: "fill",
        source: "states",
        paint: {
          "fill-color": fillColor,
          "fill-opacity": 0.7,
        },
      });
      map.current.addLayer({
        id: "state-borders",
        type: "line",
        source: "states",
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 2,
        },
      });
      setMapLoaded(true);
    });
  });

  useEffect(() => {
    if (!mapLoaded) return;
    if (!map.current || !map.current.getLayer("state-fills")) return;

    map.current.setPaintProperty("state-fills", "fill-color", [
      "match",
      ["get", "NAME"],
      ...(visitedStateNames.length > 0
        ? visitedStateNames.flatMap((name) => [name, "#3CB043"])
        : ["__none__", "#E0E0E0"]), // dummy pair so expression is never invalid
      "#E0E0E0",
    ]);
  }, [visitedStateNames, mapLoaded]);

  return (
    <div
      ref={mapContainer}
      aria-label="US Map showing visited states"
      style={{ width: "100%", height: "500px", borderRadius: "8px" }}
    />
  );
}
