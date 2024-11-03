import { Form, Input, Checkbox, Button, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import { useAuthContext } from "../context/useAuth";
const { Text } = Typography;

declare interface LoginInputs {
  userName: string;
  password: string;
}

const SignInForm = () => {
  const { loginUser } = useAuthContext();

  const onFinish = (values: LoginInputs) => {
    loginUser(values.userName, values.password);
  };

  return (
    <Form
      name="normal_login"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      layout="vertical"
      requiredMark="optional"
    >
      <Form.Item
        name="userName"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <a href="">Forgot your password?</a>
      </Form.Item>
      <Form.Item style={{ marginBottom: "0px" }}>
        <Button block="true" type="primary" htmlType="submit">
          Log in
        </Button>
        <div style={{ marginTop: "20px" }}>
          <Text>Don't have an account?</Text>{" "}
          <Link href="/sign-up">Sign up now</Link>
        </div>
      </Form.Item>
    </Form>
  );
};

export default SignInForm;
