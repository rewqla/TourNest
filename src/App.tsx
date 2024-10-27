import { Layout, Typography } from "antd";
import CustomFooter from "./components/CustomFooter";
import CustomHeader from "./components/CustomHeader";
const { Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <CustomHeader />
      <Content className="content">Content</Content>
      <CustomFooter />
    </Layout>
  );
}

export default App;
