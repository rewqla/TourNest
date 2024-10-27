// src/components/Header.js
import { Image, Row, Col, Typography, Flex } from "antd";
import logo from "../assets/point-vector.png";

const { Title } = Typography;

const CustomHeader = () => {
  return (
    <header className="header">
      <Row justify="space-between" align="middle">
        <Col>
          <Flex align="center" gap={10}>
            <span>
              <Image src={logo} preview={false} height={30} />
            </span>
            <Title level={4} style={{ marginTop: "0.5rem" }}>
              TOURNEST
            </Title>
          </Flex>
        </Col>
        <Flex align="center" gap={15}>
          <Title level={4} style={{ marginTop: "0" }}>
            Home
          </Title>
          <Title level={4} style={{ marginTop: "0" }}>
            Map & Direction
          </Title>
          <Title level={4} style={{ marginTop: "0" }}>
            Gallery
          </Title>
          <Title level={4} style={{ marginTop: "0" }}>
            Account
          </Title>
        </Flex>
      </Row>
    </header>
  );
};

export default CustomHeader;
