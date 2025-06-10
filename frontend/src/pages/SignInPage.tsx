import { Typography } from "antd";
import SignInForm from "../components/SignInForm";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const SignInPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Title level={2}>{t("signin.title")}</Title>
        <Text>{t("signin.subtitle")}</Text>
      </div>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
