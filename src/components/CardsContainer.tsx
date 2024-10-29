import { Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import squirrel from "../assets/squirrel.jpg";
import oniFreshFish from "../assets/oni-fresh-fish.jpg";
import cityLights from "../assets/3-s2.0-B9780081012703000163-f16-01-9780081012703.jpg";
import culinaryDelights from "../assets/thumb_IMG_6433_1024.jpg";
import cityRhythms from "../assets/pexels-picjumbo-com-55570-196652.jpg";
import cityscapes from "../assets/The-Cyberpunk-City-Neon-Streets-AI-Artwork-3-1024x574.jpg";

const cardData = [
  {
    id: 1,
    image: squirrel,
    title: "City Exploration",
    description:
      "Discover the hidden gems and iconic landmarks across the city. Experience the vibrant culture and rich history that make each neighborhood unique.",
  },
  {
    id: 2,
    image: oniFreshFish,
    title: "Local Artist Showcase: Urban Visions",
    description:
      "Experience the city through the eyes of its vibrant artist community. Engage with local creators and explore their masterpieces that reflect the spirit of the city.",
  },
  {
    id: 3,
    image: cityLights,
    title: "City Lights: Nighttime Revelations",
    description:
      "See the city come alive under the twinkling city lights. Enjoy the nightlife with live music, street performances, and bustling night markets.",
  },
  {
    id: 4,
    image: culinaryDelights,
    title: "Culinary Delights: Flavors of the City",
    description:
      "Taste diverse flavors from the city's renowned culinary scene. From street food to fine dining, savor every bite of local and international cuisines.",
  },
  {
    id: 5,
    image: cityRhythms,
    title: "City Rhythms: Musical Fusion",
    description:
      "Catch the beat of the city's eclectic music and nightlife. Join us for unforgettable live performances and discover the sounds that define the city.",
  },
  {
    id: 6,
    image: cityscapes,
    title: "Cityscapes: Urban Beauty",
    description:
      "Admire stunning architectural wonders and city panoramas. Explore breathtaking views from rooftops and enjoy the beauty of urban design and creativity.",
  },
];

const CardsContainer = () => {
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
