import { Layout, Image, Row, Col, Flex, Typography } from "antd";
import logo from "./assets/point-vector.png";
const { Content, Footer, Header } = Layout;
const { Title } = Typography;

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
      <Footer className="footer">Footer</Footer>
    </Layout>
  );
}

export default App;
