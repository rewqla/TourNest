import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TestPage = () => {
  const [map, setMap] = React.useState<mapboxgl.Map>();

  const mapNode = React.useRef(null);

  React.useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: import.meta.env.VITE_MAPBOX_API_KEY,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
    });

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);
  return <div ref={mapNode} style={{ width: "100%", height: "100vh" }} />;
};

export default TestPage;
