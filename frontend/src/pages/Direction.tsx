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
  { value: "tourist_attraction", label: "Tourist Attractions" },
  { value: "museum", label: "Museums" },
  { value: "park", label: "Parks" },
  { value: "shopping", label: "Shopping" },
];

const DirectionPage = () => {
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [distance, setDistance] = useState("—");
  const [duration, setDuration] = useState("—");

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
          <Col xs={24} lg={6}>
            <Card title="Route Configuration" className="mb-6">
              <Space direction="vertical" className="w-full" size="large">
                <div>
                  <Text strong>
                    <EnvironmentOutlined /> Start Point:
                  </Text>
                  <div>
                    <Text type="secondary">Click on the map to select</Text>
                  </div>
                </div>

                <div>
                  <Text strong>
                    <AimOutlined /> End Point:
                  </Text>
                  <div>
                    <Text type="secondary">Click on the map to select</Text>
                  </div>
                </div>

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
                    <Text>{distance} km</Text>
                  </div>
                </div>

                <div>
                  <Text strong>Estimated Time:</Text>
                  <div>
                    <Text>{duration}</Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  icon={<CarOutlined />}
                  block
                  size="large"
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
