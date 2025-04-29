// src/components/Header.js
import { Image, Row, Col, Typography, Flex, MenuProps, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/point-vector.png";
import { useAuthContext } from "../context/useAuth";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const CustomHeader = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthContext();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ua" : "en");
  };

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
    <nav
      className="header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        padding: "1rem 2rem",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Row justify="space-between" align="middle" wrap={false}>
        {/* Logo Section */}
        <Col>
          <Flex
            onClick={() => navigate("/")}
            align="center"
            gap={10}
            style={{ cursor: "pointer" }}
          >
            <Image src={logo} preview={false} height={32} />
            <Title level={4} style={{ margin: 0, color: "#2d2d2d" }}>
              TOURNEST
            </Title>
          </Flex>
        </Col>

        {/* Navigation + Language + Auth */}
        <Flex align="center" gap={30}>
          <Text
            onClick={toggleLanguage}
            style={{
              cursor: "pointer",
              color: "#4A4A4A",
              fontWeight: 600,
              userSelect: "none",
            }}
          >
            <span
              style={{ fontWeight: i18n.language === "ua" ? "bold" : "normal" }}
            >
              UA
            </span>{" "}
            |{" "}
            <span
              style={{ fontWeight: i18n.language === "en" ? "bold" : "normal" }}
            >
              EN
            </span>
          </Text>

          <Text
            onClick={() => navigate("/discover")}
            style={{
              cursor: "pointer",
              fontWeight: 600,
              color: "#4A4A4A",
              fontSize: 16,
            }}
          >
            Discover
          </Text>
          <Text
            onClick={() => navigate("/direction")}
            style={{
              cursor: "pointer",
              fontWeight: 600,
              color: "#4A4A4A",
              fontSize: 16,
            }}
          >
            Map & Direction
          </Text>

          {isLoggedIn() ? (
            <Dropdown menu={{ items: userItems }} placement="bottomRight">
              <Text
                style={{
                  cursor: "pointer",
                  color: "#496d96",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Your space
              </Text>
            </Dropdown>
          ) : (
            <Text
              onClick={() => navigate("/sign-in")}
              style={{
                cursor: "pointer",
                fontWeight: 600,
                color: "#4A4A4A",
                fontSize: 16,
              }}
            >
              Account
            </Text>
          )}
        </Flex>
      </Row>
    </nav>
  );
};

export default CustomHeader;
