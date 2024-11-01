import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import CustomFooter from "./components/CustomFooter";
import CustomHeader from "./components/CustomHeader";
const { Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <CustomHeader />
      <Content className="content">
        <Outlet />
      </Content>
      <CustomFooter />
    </Layout>
  );
}

export default App;
