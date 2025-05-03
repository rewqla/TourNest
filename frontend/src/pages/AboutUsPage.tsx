import { Typography, Card, Row, Col } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const AboutUsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Title level={2}>{t("about.title")}</Title>
      <Paragraph>{t("about.intro")}</Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>{t("about.missionTitle")}</Title>
            <Paragraph>{t("about.missionText")}</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>{t("about.valuesTitle")}</Title>
            <Paragraph>
              {t("about.valuesIntro")}
              <ul>
                <li>
                  <strong>{t("about.values.innovation.title")}:</strong>{" "}
                  {t("about.values.innovation.text")}
                </li>
                <li>
                  <strong>{t("about.values.community.title")}:</strong>{" "}
                  {t("about.values.community.text")}
                </li>
                <li>
                  <strong>{t("about.values.trust.title")}:</strong>{" "}
                  {t("about.values.trust.text")}
                </li>
                <li>
                  <strong>{t("about.values.sustainability.title")}:</strong>{" "}
                  {t("about.values.sustainability.text")}
                </li>
              </ul>
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: "20px" }}>
        {t("about.closingTitle")}
      </Title>
      <Paragraph>{t("about.closingText")}</Paragraph>
    </>
  );
};

export default AboutUsPage;
