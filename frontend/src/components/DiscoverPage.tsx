import { Typography, Timeline, Card } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const DiscoverPage = () => {
  const { t } = useTranslation();

  const updates = [
    {
      date: "2025-04-29",
      title: t("discover.update1.title"),
      content: t("discover.update1.content"),
    },
    {
      date: "2025-04-20",
      title: t("discover.update2.title"),
      content: t("discover.update2.content"),
    },
    {
      date: "2025-04-10",
      title: t("discover.update3.title"),
      content: t("discover.update3.content"),
    },
  ];

  return (
    <>
      <Title level={2}>{t("discover.title")}</Title>
      <Paragraph>{t("discover.description")}</Paragraph>

      <Timeline
        mode="left"
        style={{ paddingLeft: 0, marginLeft: 0 }}
        items={updates.map((update) => ({
          label: update.date,
          children: (
            <Card
              title={update.title}
              bordered={false}
              style={{ marginLeft: 0 }}
            >
              <Text>{update.content}</Text>
            </Card>
          ),
        }))}
      />
    </>
  );
};

export default DiscoverPage;
