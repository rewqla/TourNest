import { Divider, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Title level={2}>Privacy Policy</Title>
      <Divider />

      <Paragraph>
        Welcome to TOURNEST. Your privacy is important to us. This Privacy
        Policy explains how we collect, use, and protect your personal data when
        you use our services.
      </Paragraph>

      <Title level={4}>1. Information We Collect</Title>
      <Paragraph>
        We collect the following types of information:
        <ul>
          <li>Personal data (such as name, email, and contact details).</li>
          <li>Location data to improve mapping and route services.</li>
          <li>
            Usage data (such as preferences and interactions with the app).
          </li>
        </ul>
      </Paragraph>

      <Title level={4}>2. How We Use Your Information</Title>
      <Paragraph>
        We use your data to:
        <ul>
          <li>Provide navigation and discovery services.</li>
          <li>Improve user experience and personalization.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </Paragraph>

      <Title level={4}>3. Data Security</Title>
      <Paragraph>
        We implement industry-standard security measures to protect your
        personal data. However, no method of data transmission is 100% secure,
        and we encourage users to take precautions when sharing personal
        information online.
      </Paragraph>

      <Title level={4}>4. Third-Party Services</Title>
      <Paragraph>
        We may share data with third-party services for analytics. These
        services adhere to strict privacy standards.
      </Paragraph>

      <Title level={4}>5. Your Rights</Title>
      <Paragraph>
        You have the right to:
        <ul>
          <li>Access, update, or delete your personal information.</li>
          <li>Opt out of marketing communications.</li>
        </ul>
      </Paragraph>

      <Title level={4}>6. Changes to This Policy</Title>
      <Paragraph>
        We may update our Privacy Policy periodically. Any significant changes
        will be communicated to users.
      </Paragraph>

      <Title level={4}>7. Contact Us</Title>
      <Paragraph>
        If you have any questions about this Privacy Policy, please contact us
        at:
        <br />
        <strong>support@tournest.com</strong>
      </Paragraph>
    </>
  );
};

export default PrivacyPolicyPage;
