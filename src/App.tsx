import { Layout } from "antd";
import CustomCarousel from "./components/CustomCarousel";
import CustomFooter from "./components/CustomFooter";
import CustomHeader from "./components/CustomHeader";
const { Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <CustomHeader />
      <Content className="content">
        <CustomCarousel />
      </Content>
      <CustomFooter />
    </Layout>
  );
}

export default App;
