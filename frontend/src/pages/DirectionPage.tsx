import React, { useState, useRef, useEffect } from "react";
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
  CarOutlined,
  AimOutlined,
  EnvironmentOutlined,
  SkinOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Content } = Layout;
const { Text } = Typography;
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const getRouteIcon = (type: string) => {
  switch (type) {
    case "walking":
      return <SkinOutlined />;
    case "cycling":
      return <ThunderboltOutlined />;
    default:
      return <CarOutlined />;
  }
};

const DirectionPage = () => {
  const [map, setMap] = useState<mapboxgl.Map>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visitMarkers, setVisitMarkers] = useState<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
  const [routeType, setRouteType] = useState("driving");
  const [pointSelection, setPointSelection] = useState<"start" | "end">(
    "start"
  );

  const pointSelectionRef = useRef(pointSelection);
  const startMarker = useRef<mapboxgl.Marker | null>(null);
  const endMarker = useRef<mapboxgl.Marker | null>(null);
  const mapContainer = useRef(null);

  const { t } = useTranslation();

  const categoryOptions = [
    { value: "restaurant", label: t("route.restaurants") },
    { value: "cafe", label: t("route.cafes") },
    { value: "atm", label: t("route.atm") },
    { value: "theatre", label: t("route.theatre") },
    { value: "hotel", label: t("route.hotel") },
    { value: "museum", label: t("route.museum") },
    { value: "park", label: t("route.parks") },
    { value: "shopping", label: t("route.shopping") },
  ];

  useEffect(() => {
    pointSelectionRef.current = pointSelection;
  }, [pointSelection]);

  useEffect(() => {
    const node = mapContainer.current;
    if (!node || typeof window === "undefined") return;

    const mapInstance = new mapboxgl.Map({
      container: node,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [23.994833, 49.83941],
      zoom: 12,
    });

    mapInstance.on("click", (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      const isStart = pointSelectionRef.current === "start";

      const setMarker = (
        markerRef: React.MutableRefObject<mapboxgl.Marker | null>,
        color: string
      ) => {
        if (markerRef.current) {
          markerRef.current.setLngLat(coords);
        } else {
          markerRef.current = new mapboxgl.Marker({ color })
            .setLngLat(coords)
            .addTo(mapInstance);
        }
      };

      if (isStart) {
        setStartPoint(coords);
        setMarker(startMarker, "green");
      } else {
        setEndPoint(coords);
        setMarker(endMarker, "red");
      }
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  const clearMap = () => {
    if (!map) return;

    startMarker.current?.remove();
    endMarker.current?.remove();
    map.getLayer("route-line") && map.removeLayer("route-line");
    map.getSource("route") && map.removeSource("route");
    visitMarkers.forEach((m) => m.remove());

    setStartPoint(null);
    setEndPoint(null);
    setVisitMarkers([]);
    setDistance(0);
    setDuration(0);
  };

  const generateRoute = async () => {
    if (!startPoint || !endPoint) return;

    const requestPayload = {
      startLocation: {
        lat: startPoint[1].toString(),
        lng: startPoint[0].toString(),
      },
      endLocation: { lat: endPoint[1].toString(), lng: endPoint[0].toString() },
      categories: selectedCategories,
      maxDetourDistance: 2000,
      maxPlacesToVisit: selectedCategories.length,
      routeType,
    };

    setIsLoading(true);

    try {
      const response = await fetch("https://localhost:7118/places/direction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) throw new Error("Failed to fetch route data");

      const result = await response.json();
      setDistance(result.totalDistance / 1000);
      setDuration(result.estimatedTime);

      if (!map) return;

      map.getLayer("route-line") && map.removeLayer("route-line");
      map.getSource("route") && map.removeSource("route");

      map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: result.route.geometry },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#3b82f6", "line-width": 4 },
      });

      visitMarkers.forEach((marker) => marker.remove());
      const newMarkers = result.placesToVisit.map((place) => {
        const lat = parseFloat(place.location.lat.replace(",", "."));
        const lng = parseFloat(place.location.lng.replace(",", "."));
        const marker = new mapboxgl.Marker({ color: "#f59e0b" })
          .setLngLat([lng, lat])
          .addTo(map);
        marker
          .getElement()
          .setAttribute(
            "title",
            `${place.name} (${place.categories[0]?.name || "Place"})`
          );
        return marker;
      });

      setVisitMarkers(newMarkers);

      const bounds = new mapboxgl.LngLatBounds();
      result.route.steps.forEach((step) =>
        bounds.extend([step.location.lng, step.location.lat])
      );
      map.fitBounds(bounds, { padding: 50 });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Content className="p-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            <Card title={t("route.routeConfiguration")}>
              <Space direction="vertical" size="large" className="w-full">
                <Text strong>
                  <EnvironmentOutlined /> {t("route.startPoint")}
                </Text>
                <Text type="secondary">
                  {startPoint
                    ? `${startPoint[1].toFixed(5)}, ${startPoint[0].toFixed(5)}`
                    : t("route.clickToSelect")}
                </Text>

                <Text strong>
                  <AimOutlined /> {t("route.endPoint")}
                </Text>
                <Text type="secondary">
                  {endPoint
                    ? `${endPoint[1].toFixed(5)}, ${endPoint[0].toFixed(5)}`
                    : t("route.clickToSelect")}
                </Text>

                <Radio.Group
                  value={pointSelection}
                  onChange={(e) => setPointSelection(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="start">
                    {t("route.setStart")}
                  </Radio.Button>
                  <Radio.Button value="end">{t("route.setEnd")}</Radio.Button>
                </Radio.Group>

                <Divider />

                <Text strong>{t("route.categoriesToVisit")}</Text>
                <Select
                  allowClear
                  mode="multiple"
                  placeholder={t("route.categoriesToVisit")}
                  style={{ width: "100%" }}
                  options={categoryOptions.map((opt) => ({
                    ...opt,
                    label: t(`route.${opt.value}`),
                  }))}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                />

                <Divider />

                <Text strong>{t("route.routeType")}</Text>
                <Select
                  value={routeType}
                  onChange={setRouteType}
                  style={{ width: "100%" }}
                  options={[
                    { value: "driving", label: t("route.car") },
                    { value: "walking", label: t("route.walking") },
                    { value: "cycling", label: t("route.cycling") },
                  ]}
                />

                <Divider />

                <Text strong>{t("route.estimatedDistance")}</Text>
                <Text>
                  {distance ? `${distance.toFixed(2)} ${t("route.km")}` : "—"}
                </Text>

                <Text strong>{t("route.estimatedTime")}</Text>
                <Text>
                  {duration
                    ? `${Math.floor(duration / 60)} ${t("route.min")}`
                    : "—"}
                </Text>

                <Button
                  type="primary"
                  icon={getRouteIcon(routeType)}
                  block
                  size="large"
                  onClick={generateRoute}
                  loading={isLoading}
                  disabled={
                    !startPoint || !endPoint || !selectedCategories.length
                  }
                >
                  {t("route.generateRoute")}
                </Button>

                <Button danger block size="large" onClick={clearMap}>
                  {t("route.clearMap")}
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={18}>
            <Card className="h-full">
              <div
                ref={mapContainer}
                style={{ height: "85vh", width: "100%" }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default DirectionPage;
