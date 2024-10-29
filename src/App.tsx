import { Layout, Row } from "antd";
import CardsContainer from "./components/CardsContainer";
import CustomCarousel from "./components/CustomCarousel";
import CustomFooter from "./components/CustomFooter";
import CustomHeader from "./components/CustomHeader";
const { Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <CustomHeader />
      <Content className="content">
        <Row
          justify="center"
          style={{
            padding: "24px",
          }}
        >
          <CustomCarousel />
          <CardsContainer />
        </Row>
      </Content>
      <CustomFooter />
    </Layout>
  );
}

export default App;
