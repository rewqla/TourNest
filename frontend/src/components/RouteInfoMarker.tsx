// components/RouteInfoMarker.tsx
import mapboxgl from "mapbox-gl";

interface RouteInfoMarkerProps {
  map: mapboxgl.Map;
  routeType: "driving" | "walking" | "cycling";
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

const RouteInfoMarker = ({
  map,
  routeType,
  distance,
  duration,
  coordinates,
}: RouteInfoMarkerProps) => {
  // Remove old marker if exists
  const existingInfoMarker = document.getElementById("route-info-marker");
  if (existingInfoMarker) {
    existingInfoMarker.remove();
  }

  const infoElement = document.createElement("div");
  infoElement.id = "route-info-marker";
  infoElement.style.padding = "6px 10px";
  infoElement.style.backgroundColor = "white";
  infoElement.style.borderRadius = "8px";
  infoElement.style.boxShadow = "0 0 6px rgba(0,0,0,0.15)";
  infoElement.style.fontSize = "14px";
  infoElement.style.fontWeight = "bold";
  infoElement.style.display = "flex";
  infoElement.style.alignItems = "center";
  infoElement.style.gap = "6px";

  const iconSpan = document.createElement("span");
  iconSpan.innerHTML =
    routeType === "walking" ? "🚶" : routeType === "cycling" ? "🚴" : "🚗";

  infoElement.appendChild(iconSpan);
  infoElement.append(
    `${distance.toFixed(1)} km, ${Math.round(duration / 60)} min`
  );

  const midpointCoord = coordinates[Math.floor(coordinates.length / 2)];

  new mapboxgl.Marker({ element: infoElement })
    .setLngLat(midpointCoord)
    .addTo(map);

  return null;
};

export default RouteInfoMarker;
