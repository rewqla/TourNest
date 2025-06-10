import { Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslation } from "react-i18next";

import squirrel from "../assets/squirrel.jpg";
import oniFreshFish from "../assets/oni-fresh-fish.jpg";
import cityLights from "../assets/3-s2.0-B9780081012703000163-f16-01-9780081012703.jpg";
import culinaryDelights from "../assets/thumb_IMG_6433_1024.jpg";
import cityRhythms from "../assets/pexels-picjumbo-com-55570-196652.jpg";
import cityscapes from "../assets/The-Cyberpunk-City-Neon-Streets-AI-Artwork-3-1024x574.jpg";

const CardsContainer = () => {
  const { t } = useTranslation();

  const cardData = [
    {
      id: 1,
      image: squirrel,
      title: t("cards.cityExploration.title"),
      description: t("cards.cityExploration.description"),
    },
    {
      id: 2,
      image: oniFreshFish,
      title: t("cards.urbanVisions.title"),
      description: t("cards.urbanVisions.description"),
    },
    {
      id: 3,
      image: cityLights,
      title: t("cards.cityLights.title"),
      description: t("cards.cityLights.description"),
    },
    {
      id: 4,
      image: culinaryDelights,
      title: t("cards.culinaryDelights.title"),
      description: t("cards.culinaryDelights.description"),
    },
    {
      id: 5,
      image: cityRhythms,
      title: t("cards.cityRhythms.title"),
      description: t("cards.cityRhythms.description"),
    },
    {
      id: 6,
      image: cityscapes,
      title: t("cards.cityscapes.title"),
      description: t("cards.cityscapes.description"),
    },
  ];

  return (
    <Row
      gutter={[10, 10]}
      style={{ marginTop: "5rem", display: "flex", alignItems: "stretch" }}
      justify="space-evenly"
    >
      {cardData.map((card) => (
        <Col key={card.id} span={8}>
          <Card
            style={{ padding: 15, background: "#ebe3e3", height: "100%" }}
            cover={<img alt={`card-${card.id}`} src={card.image} />}
          >
            <Meta title={card.title} description={card.description} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardsContainer;
