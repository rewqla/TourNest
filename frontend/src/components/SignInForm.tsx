import { Form, Input, Checkbox, Button, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuthContext } from "../context/useAuth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

declare interface LoginInputs {
  userName: string;
  password: string;
}

const SignInForm = () => {
  const { t } = useTranslation();
  const { loginUser } = useAuthContext();
  const navigate = useNavigate();

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
            message: t("login.usernameRequired"),
          },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder={t("login.usernamePlaceholder")}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: t("login.passwordRequired"),
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder={t("login.passwordPlaceholder")}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: "0px" }}>
        <Button block type="primary" htmlType="submit">
          {t("login.button")}
        </Button>
        <div style={{ marginTop: "20px" }}>
          <Text>{t("login.noAccount")}</Text>{" "}
          <Text
            onClick={() => navigate("/sign-up")}
            style={{ cursor: "pointer", color: "#1677ff" }}
          >
            {t("login.signUpNow")}
          </Text>
        </div>
      </Form.Item>
    </Form>
  );
};

export default SignInForm;
