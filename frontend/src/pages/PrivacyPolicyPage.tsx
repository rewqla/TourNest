import { Divider, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Title level={2}>{t("privacy.title")}</Title>
      <Divider />

      <Paragraph>{t("privacy.intro")}</Paragraph>

      <Title level={4}>{t("privacy.section1.title")}</Title>
      <Paragraph>
        <ul>
          <li>{t("privacy.section1.items.0")}</li>
          <li>{t("privacy.section1.items.1")}</li>
          <li>{t("privacy.section1.items.2")}</li>
        </ul>
      </Paragraph>

      <Title level={4}>{t("privacy.section2.title")}</Title>
      <Paragraph>
        <ul>
          <li>{t("privacy.section2.items.0")}</li>
          <li>{t("privacy.section2.items.1")}</li>
          <li>{t("privacy.section2.items.2")}</li>
        </ul>
      </Paragraph>

      <Title level={4}>{t("privacy.section3.title")}</Title>
      <Paragraph>{t("privacy.section3.content")}</Paragraph>

      <Title level={4}>{t("privacy.section4.title")}</Title>
      <Paragraph>{t("privacy.section4.content")}</Paragraph>

      <Title level={4}>{t("privacy.section5.title")}</Title>
      <Paragraph>
        <ul>
          <li>{t("privacy.section5.items.0")}</li>
          <li>{t("privacy.section5.items.1")}</li>
        </ul>
      </Paragraph>

      <Title level={4}>{t("privacy.section6.title")}</Title>
      <Paragraph>{t("privacy.section6.content")}</Paragraph>

      <Title level={4}>{t("privacy.section7.title")}</Title>
      <Paragraph>
        {t("privacy.section7.content")}
        <br />
        <strong>support@tournest.com</strong>
      </Paragraph>
    </>
  );
};

export default PrivacyPolicyPage;
