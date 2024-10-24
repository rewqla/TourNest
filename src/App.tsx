import { Layout, Image, Row, Col, Flex, Typography } from "antd";
import logo from "./assets/point-vector.png";
const { Content, Footer, Header } = Layout;
const { Title, Text, Link } = Typography;

function App() {
  return (
    <Layout className="layout">
      <Header className="header">
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
              Map & direction
            </Title>
            <Title level={4} style={{ marginTop: "0" }}>
              Gallery
            </Title>
            <Title level={4} style={{ marginTop: "0" }}>
              Account
            </Title>
          </Flex>
        </Row>
      </Header>
      <Content className="content">Content</Content>
      <Footer className="footer">
        <Row justify="space-between" align="middle">
          <Col span={3}>
            <Title level={4} style={{ marginBottom: 10 }}>
              TourNest
            </Title>
            <Text>Less stress more feelings. Be free with us</Text>
          </Col>
          <Col span={3} style={{ paddingBottom: "1vh" }}>
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
    </Layout>
  );
}

export default App;
