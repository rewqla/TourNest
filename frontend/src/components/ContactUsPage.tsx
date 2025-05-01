import { Typography, Card, Row, Col } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const ContactUsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Title level={2}>{t("contact.title")}</Title>
      <Paragraph>{t("contact.intro")}</Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>{t("contact.phoneSupportTitle")}</Title>
            <Paragraph>
              <PhoneOutlined /> <strong>{t("contact.phoneNumber")}</strong>
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>{t("contact.emailSupportTitle")}</Title>
            <Paragraph>
              <MailOutlined /> <strong>{t("contact.emailAddress")}</strong>
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: "20px" }}>
        {t("contact.closingTitle")}
      </Title>
      <Paragraph>{t("contact.closingText")}</Paragraph>
    </>
  );
};

export default ContactUsPage;
