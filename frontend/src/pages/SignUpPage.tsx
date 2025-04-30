import { Typography } from "antd";
import SignUpForm from "../components/SignUpForm";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const SignUpPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Title level={2}>{t("signup.title")}</Title>
        <Text>{t("signup.subtitle")}</Text>
      </div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
