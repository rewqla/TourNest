import { Typography, Card, Row, Col } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ContactUsPage = () => {
  return (
    <>
      <Title level={2}>Contact Us</Title>
      <Paragraph>
        Have questions or need assistance? We're here to help. Reach out via
        phone or email, and we’ll get back to you as soon as possible.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Phone Support</Title>
            <Paragraph>
              <PhoneOutlined /> <strong>+123 456 7890</strong>
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Email Support</Title>
            <Paragraph>
              <MailOutlined /> <strong>support@tournest.com</strong>
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: "20px" }}>
        We're here for you
      </Title>
      <Paragraph>
        Whether you need help planning your trip, navigating the app, or
        resolving any issues—just reach out. Our team is ready to assist you.
      </Paragraph>
    </>
  );
};

export default ContactUsPage;
