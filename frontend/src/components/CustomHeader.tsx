// src/components/Header.js
import { Image, Row, Col, Typography, Flex, MenuProps, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/point-vector.png";
import { useAuthContext } from "../context/useAuth";

const { Title, Text } = Typography;

const CustomHeader = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthContext();

  const userItems: MenuProps["items"] = [
    {
      label: <Text onClick={() => navigate("/profile")}>Profile</Text>,
      key: "0",
    },
    {
      label: <Text onClick={() => navigate("/history")}>Travel history</Text>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: <Text onClick={logout}>Logout</Text>,
      key: "3",
    },
  ];

  return (
    <header className="header">
      <Row justify="space-between" align="middle">
        <Col>
          <Flex
            onClick={() => navigate("/")}
            align="center"
            style={{ cursor: "pointer" }}
            gap={10}
          >
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
            style={{ marginTop: "0", color: "#4A4A4A", cursor: "pointer" }}
          >
            Discover
          </Title>
          <Title
            onClick={() => navigate("/direction")}
            level={4}
            style={{ marginTop: "0", color: "#4A4A4A", cursor: "pointer" }}
          >
            Map & Direction
          </Title>
          {isLoggedIn() ? (
            <Dropdown menu={{ items: userItems }} placement="bottomRight">
              <Title
                level={4}
                style={{
                  marginTop: "0",
                  color: "#496d96",
                  cursor: "pointer",
                }}
              >
                Hi, {user?.email}
              </Title>
            </Dropdown>
          ) : (
            <Title
              onClick={() => navigate("/sign-in")}
              level={4}
              style={{ marginTop: "0", color: "#4A4A4A", cursor: "pointer" }}
            >
              Account
            </Title>
          )}
        </Flex>
      </Row>
    </header>
  );
};

export default CustomHeader;
