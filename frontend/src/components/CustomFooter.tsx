import { Row, Col, Typography, Flex } from "antd";
import { Footer } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { Title, Text, Link } = Typography;

const CustomFooter = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <Footer className="footer">
      <Row justify="space-between" align="middle">
        <Col span={4}>
          <Title level={2} style={{ marginBottom: 10 }}>
            TOURNEST
          </Title>
          <Text className="footer-text">{t("footer.tagline")}</Text>
        </Col>
        <Col span={4} style={{ paddingBottom: "1vh", textAlign: "right" }}>
          <Title level={4} style={{ marginBottom: 10 }}>
            {t("footer.quickLinks")}
          </Title>
          <Flex vertical>
            <Col>
              <Link
                className="footer-text"
                href="https://ant.design"
                target="_blank"
              >
                {t("footer.aboutUs")}
              </Link>
            </Col>
            <Col>
              <Text
                className="footer-text"
                style={{ cursor: "pointer", color: "#1677ff" }}
                onClick={() => navigate("/contact-us")}
              >
                {t("footer.contact")}
              </Text>
            </Col>
            <Col>
              <Text
                className="footer-text"
                style={{ cursor: "pointer", color: "#1677ff" }}
                onClick={() => navigate("/privacy")}
              >
                {t("footer.privacyPolicy")}
              </Text>
            </Col>
          </Flex>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
