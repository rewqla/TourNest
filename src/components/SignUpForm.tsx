import { Form, Input, Checkbox, Button, Typography } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import { useDataContext } from "../context/useAuth";
const { Text, Title } = Typography;

declare interface RegisterInputs {
  email: string;
  userName: string;
  fullName: string;
  password: string;
}

const SignUpForm = () => {
  const { registerUser } = useDataContext();

  const onFinish = (values: RegisterInputs) => {
    const [firstName, ...remaining] = values.fullName.trim().split(" ");
    const lastName = remaining.join(" ");

    registerUser(
      firstName,
      lastName,
      values.email,
      values.userName,
      values.password
    );
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
        name="fullName"
        rules={[
          {
            required: true,
            message: "Please input your Full Name!",
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Full Name" />
      </Form.Item>
      <Form.Item
        name="userName"
        rules={[
          {
            required: true,
            message: "Please input your Username!",
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
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
      <Form.Item
        name="confirmPassword"
        rules={[
          {
            required: true,
            message: "Please confirm your Password!",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Confirm Password"
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: "0px" }}>
        <Button block="true" type="primary" htmlType="submit">
          Sign Up
        </Button>
        <div style={{ marginTop: "20px" }}>
          <Text>Already have an account?</Text>{" "}
          <Link href="/sign-in">Sign in now</Link>
        </div>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
