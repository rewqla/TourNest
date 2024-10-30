import { Layout } from "antd";
import CustomFooter from "./components/CustomFooter";
import CustomHeader from "./components/CustomHeader";
import { Router } from "./routes/Routes";
const { Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <CustomHeader />
      <Content className="content">
        <Router />
      </Content>
      <CustomFooter />
    </Layout>
  );
}

export default App;
