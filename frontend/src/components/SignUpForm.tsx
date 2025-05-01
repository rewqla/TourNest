import { Form, Input, Button, Typography } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthContext } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

declare interface RegisterInputs {
  email: string;
  userName: string;
  fullName: string;
  password: string;
}

const SignUpForm = () => {
  const { registerUser } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      name="signup_form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
      requiredMark="optional"
    >
      <Form.Item
        name="fullName"
        rules={[{ required: true, message: t("signup.errors.fullName") }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder={t("signup.fields.fullName")}
        />
      </Form.Item>

      <Form.Item
        name="userName"
        rules={[{ required: true, message: t("signup.errors.userName") }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder={t("signup.fields.userName")}
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { type: "email", required: true, message: t("signup.errors.email") },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder={t("signup.fields.email")}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: t("signup.errors.password") }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder={t("signup.fields.password")}
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        rules={[
          { required: true, message: t("signup.errors.confirmPassword") },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder={t("signup.fields.confirmPassword")}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: "0px" }}>
        <Button block type="primary" htmlType="submit">
          {t("signup.actions.submit")}
        </Button>
        <div style={{ marginTop: "20px" }}>
          <Text>{t("signup.switch.text")}</Text>{" "}
          <Text
            onClick={() => navigate("/sign-in")}
            style={{ cursor: "pointer", color: "#1677ff" }}
          >
            {t("signup.switch.link")}
          </Text>
        </div>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
