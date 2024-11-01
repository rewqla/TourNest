// src/components/Header.js
import { Image, Row, Col, Typography, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/point-vector.png";

const { Title } = Typography;

const CustomHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <Row justify="space-between" align="middle">
        <Col>
          <Flex onClick={() => navigate("/")} align="center" gap={10}>
            <span>
              <Image src={logo} preview={false} height={30} />
            </span>
            <Title level={4} style={{ marginTop: "0.5rem" }}>
              TOURNEST
            </Title>
          </Flex>
        </Col>
        <Flex align="center" gap={15}>
          <Title
            onClick={() => navigate("/discover")}
            level={4}
            style={{ marginTop: "0", color: "#4A4A4A" }}
          >
            Discover
          </Title>
          <Title
            onClick={() => navigate("/direction")}
            level={4}
            style={{ marginTop: "0", color: "#4A4A4A" }}
          >
            Map & Direction
          </Title>
          <Title
            onClick={() => navigate("/sign-in")}
            level={4}
            style={{ marginTop: "0", color: "#4A4A4A" }}
          >
            Account
          </Title>
        </Flex>
      </Row>
    </header>
  );
};

export default CustomHeader;
