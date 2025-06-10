import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import CustomFooter from "./components/CustomFooter";
import CustomHeader from "./components/CustomHeader";
import UserProvider from "./context/useAuth";
import "./i18n";
const { Content } = Layout;

function App() {
  return (
    <UserProvider>
      <Layout className="layout">
        <CustomHeader />
        <Content className="content">
          <Outlet />
        </Content>
        <CustomFooter />
      </Layout>
    </UserProvider>
  );
}

export default App;
