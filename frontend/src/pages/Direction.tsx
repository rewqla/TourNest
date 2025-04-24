import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Layout,
  Button,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Radio,
} from "antd";
import {
  EnvironmentOutlined,
  AimOutlined,
  CarOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const categoryOptions = [
  { value: "restaurant", label: "Restaurants" },
  { value: "cafe", label: "Cafes" },
  { value: "atm", label: "ATM" },
  { value: "theatre", label: "Theatre" },
  { value: "hotel", label: "Hotel" },
  { value: "museum", label: "Museums" },
  { value: "park", label: "Parks" },
  { value: "shopping", label: "Shopping" },
];

const DirectionPage = () => {
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
  const [pointSelection, setPointSelection] = useState<"start" | "end">(
    "start"
  );
  const pointSelectionRef = useRef(pointSelection);

  const startMarker = useRef<mapboxgl.Marker | null>(null);
  const endMarker = useRef<mapboxgl.Marker | null>(null);

  const mapNode = React.useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: import.meta.env.VITE_MAPBOX_API_KEY,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [23.994833, 49.83941],
      zoom: 12,
    });

    mapboxMap.on("click", (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      if (pointSelectionRef.current === "start") {
        setStartPoint(coords);
        if (startMarker.current) {
          startMarker.current.setLngLat(coords);
        } else {
          startMarker.current = new mapboxgl.Marker({ color: "green" })
            .setLngLat(coords)
            .addTo(mapboxMap);
        }
      } else {
        setEndPoint(coords);
        if (endMarker.current) {
          endMarker.current.setLngLat(coords);
        } else {
          endMarker.current = new mapboxgl.Marker({ color: "red" })
            .setLngLat(coords)
            .addTo(mapboxMap);
        }
      }
    });

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);

  useEffect(() => {
    pointSelectionRef.current = pointSelection;
  }, [pointSelection]);

  const handleGenerateRoute = async () => {
    if (!startPoint || !endPoint) {
      console.warn("Start or end point not set");
      return;
    }

    const directionRequest = {
      startLocation: {
        lat: startPoint[1].toString(),
        lng: startPoint[0].toString(),
      },
      endLocation: {
        lat: endPoint[1].toString(),
        lng: endPoint[0].toString(),
      },
      categories: selectedCategories,
      maxDetourDistance: 2000,
      maxPlacesToVisit: 4,
    };

    try {
      const response = await fetch("https://localhost:7118/places/direction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(directionRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error:", error);
        return;
      }

      const result = await response.json();
      console.log("Route data:", result);

      setDistance(result.totalDistance / 1000);

      setDuration(result.estimatedTime);

      if (!map) return;

      // Remove previous route layer if it exists
      if (map.getLayer("route-line")) {
        map.removeLayer("route-line");
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }

      // Add new route as a line
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: result.route.geometry,
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      });

      // Add place markers
      result.placesToVisit.forEach((place) => {
        console.log(place);
        let lat = parseFloat(place.location.lat.replace(",", "."));
        let lng = parseFloat(place.location.lng.replace(",", "."));

        const marker = new mapboxgl.Marker({ color: "#f59e0b" }) // yellow-orange
          .setLngLat([lng, lat])
          .addTo(map);

        const title = place.name + " " + (place.categories[0]?.name || "Place");

        marker.getElement().setAttribute("title", title);
      });

      // Fit bounds around the full route
      const bounds = new mapboxgl.LngLatBounds();
      result.route.steps.forEach((step) => {
        bounds.extend([step.location.lng, step.location.lat]);
      });
      map.fitBounds(bounds, { padding: 50 });
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Content className="p-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            <Card title="Route Configuration" className="mb-6">
              <Space direction="vertical" className="w-full" size="large">
                <div>
                  <Text strong>
                    <EnvironmentOutlined /> Start Point:
                  </Text>
                  <div>
                    <Text type="secondary">
                      {startPoint
                        ? `${startPoint[1].toFixed(5)}, ${startPoint[0].toFixed(
                            5
                          )}`
                        : "Click on the map to select"}
                    </Text>
                  </div>
                </div>

                <div>
                  <Text strong>
                    <AimOutlined /> End Point:
                  </Text>
                  <div>
                    <Text type="secondary">
                      {endPoint
                        ? `${endPoint[1].toFixed(5)}, ${endPoint[0].toFixed(5)}`
                        : "Click on the map to select"}
                    </Text>
                  </div>
                </div>
                <Radio.Group
                  value={pointSelection}
                  onChange={(e) => {
                    setPointSelection(e.target.value);
                  }}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="start">Set Start</Radio.Button>
                  <Radio.Button value="end">Set End</Radio.Button>
                </Radio.Group>

                <Divider />

                <div>
                  <Text strong>Categories to Visit:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Select
                      allowClear
                      mode="multiple"
                      placeholder="Select categories"
                      style={{ width: "100%" }}
                      options={categoryOptions}
                      value={selectedCategories}
                      onChange={setSelectedCategories}
                    />
                  </div>
                </div>

                <Divider />

                <div>
                  <Text strong>Estimated Distance:</Text>
                  <div>
                    <Text>
                      {distance !== 0 ? `${distance.toFixed(2)} km` : "—"}
                    </Text>
                  </div>
                </div>

                <div>
                  <Text strong>Estimated Time:</Text>
                  <div>
                    <Text>
                      {duration !== 0
                        ? `${Math.floor(duration / 60)} min`
                        : "—"}
                    </Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  icon={<CarOutlined />}
                  block
                  size="large"
                  onClick={handleGenerateRoute}
                  disabled={
                    !startPoint || !endPoint || selectedCategories.length === 0
                  }
                >
                  Generate Route
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={18}>
            <Card className="h-full">
              <div ref={mapNode} style={{ height: "75vh", width: "100%" }} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default DirectionPage;
