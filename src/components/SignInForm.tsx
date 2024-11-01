import { Form, Input, Checkbox, Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const SignInForm = () => {
  const onFinish = (values: any) => {
    console.log(values);
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
        name="email"
        rules={[
          {
            type: "email",
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
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
          <Text>Don't have an account?</Text> <Link href="">Sign up now</Link>
        </div>
      </Form.Item>
    </Form>
  );
};

export default SignInForm;
