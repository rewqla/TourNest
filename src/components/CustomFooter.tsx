// src/components/Header.js
import { Row, Col, Typography, Flex } from "antd";
import { Footer } from "antd/es/layout/layout";

const { Title, Text, Link } = Typography;

const CustomFooter = () => {
  return (
    <Footer className="footer">
      <Row justify="space-between" align="middle">
        <Col span={4}>
          <Title level={4} style={{ marginBottom: 10 }}>
            TourNest
          </Title>
          <Text>Less stress more feelings. Be free with us</Text>
        </Col>
        <Col span={4} style={{ paddingBottom: "1vh" }}>
          <Title level={4} style={{ marginBottom: 10 }}>
            Quick Links
          </Title>
          <Flex vertical>
            <Col>
              <Text>
                <Link href="https://ant.design" target="_blank">
                  About Us
                </Link>
              </Text>
            </Col>
            <Col>
              <Link href="https://ant.design" target="_blank">
                Contact
              </Link>
            </Col>
            <Col>
              <Link href="https://ant.design" target="_blank">
                Privacy Policy
              </Link>
            </Col>
          </Flex>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
