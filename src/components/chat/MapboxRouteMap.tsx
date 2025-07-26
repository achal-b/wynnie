import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface MapboxRouteMapProps {
  warehouseCoords: [number, number]; // [lng, lat]
  deliveryCoords: [number, number]; // [lng, lat]
  mapboxToken: string;
  width?: number | string;
  height?: number | string;
}

export const MapboxRouteMap = ({
  warehouseCoords,
  deliveryCoords,
  mapboxToken,
  width = 320,
  height = 200,
}: MapboxRouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapboxgl.accessToken = mapboxToken;
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: warehouseCoords,
        zoom: 11,
      });
      mapRef.current = map;

      // Add markers
      new mapboxgl.Marker({ color: "#0071ce" })
        .setLngLat(warehouseCoords)
        .setPopup(new mapboxgl.Popup().setText("Warehouse"))
        .addTo(map);
      new mapboxgl.Marker({ color: "#2ecc40" })
        .setLngLat(deliveryCoords)
        .setPopup(new mapboxgl.Popup().setText("Delivery Address"))
        .addTo(map);

      // Add route line
      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [warehouseCoords, deliveryCoords],
            },
          },
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#0071ce", "line-width": 4 },
        });
      });
    }
    // Clean up map on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [warehouseCoords, deliveryCoords, mapboxToken]);

  return (
    <div
      ref={mapContainer}
      style={{ width, height, borderRadius: 12, overflow: "hidden" }}
      className="shadow-md border border-gray-200"
    />
  );
};
