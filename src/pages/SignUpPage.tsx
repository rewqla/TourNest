import { Typography } from "antd";
import SignUpForm from "../components/SignUpForm";
const { Text, Title } = Typography;

const SignUpPage = () => {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Title level={2}>Sign Up</Title>
        <Text>
          Please fill in the form below to sign up and create an account.
        </Text>
      </div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
