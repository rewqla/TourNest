import { Typography } from "antd";
import SignInForm from "../components/SignInForm";
const { Text, Title } = Typography;

const SignInPage = () => {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Title level={2}>Welcome Back</Title>
        <Text>Please sign in to your account to continue.</Text>
      </div>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
