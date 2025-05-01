import { Layout, Typography, Card, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const AboutUsPage = () => {
  return (
    <>
      <Title level={2}>About Us</Title>
      <Paragraph>
        Welcome to TOURNEST—your ultimate travel companion! We are passionate
        about helping travelers explore the world with ease, offering the best
        navigation, discovery, and experience-enhancing tools for your
        adventures.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Our Mission</Title>
            <Paragraph>
              At TOURNEST, we strive to make travel seamless and memorable.
              Whether you're looking for hidden gems, top attractions, or the
              best routes, our platform ensures you have everything you need to
              make your trip extraordinary.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Our Values</Title>
            <Paragraph>
              We believe in:
              <ul>
                <li>
                  <strong>Innovation:</strong> Constantly improving travel
                  experiences.
                </li>
                <li>
                  <strong>Community:</strong> Connecting travelers worldwide.
                </li>
                <li>
                  <strong>Trust:</strong> Providing reliable navigation and
                  recommendations.
                </li>
                <li>
                  <strong>Sustainability:</strong> Promoting eco-friendly travel
                  solutions.
                </li>
              </ul>
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: "20px" }}>
        Join Us on the Journey
      </Title>
      <Paragraph>
        Whether you're an adventurer, a planner, or a dreamer, TOURNEST is here
        to support your travel aspirations. Explore, discover, and experience
        the world like never before.
      </Paragraph>
    </>
  );
};

export default AboutUsPage;
