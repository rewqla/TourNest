import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Layout,
  Button,
  Select,
  InputNumber,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  AimOutlined,
  CarOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const categoryOptions = [
  { value: "restaurant", label: "Restaurants" },
  { value: "cafe", label: "Cafes" },
  { value: "bar", label: "Bars" },
  { value: "tourist_attraction", label: "Tourist Attractions" },
  { value: "museum", label: "Museums" },
  { value: "park", label: "Parks" },
  { value: "shopping", label: "Shopping" },
];

const DirectionPage = () => {
  const [map, setMap] = React.useState<mapboxgl.Map>();

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

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);

  return (
    <Layout className="min-h-screen">
      <Content className="p-6">
        <Row gutter={[16, 16]}>
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
