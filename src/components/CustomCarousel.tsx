import { Carousel, Typography } from "antd";
const { Text, Title } = Typography;

import publicGarden from "../assets/Boston-Public-Garden.webp";
import cityBuilding from "../assets/city-buildings.jpg";
import japanese from "../assets/japancitiesmain2023.jpg";
import futurism from "../assets/futurism.jpg";

const CustomCarousel = () => {
  return (
    <>
      <div className="carousel-container">
        <div className="carousel-text">
          <Title italic level={1} style={{ color: "#ffe600" }}>
            Discover the city with us
          </Title>
          <Text italic strong style={{ fontSize: "1.5rem", color: "#4a4a4a" }}>
            Explore city's hidden gems!
          </Text>
        </div>
        <Carousel draggable arrows infinite={false}>
          <div>
            <div
              className="carousel-slide"
              style={{
                backgroundImage: `url(${publicGarden})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          <div>
            <div
              className="carousel-slide"
              style={{
                backgroundImage: `url(${cityBuilding})`,
              }}
            />
          </div>
          <div>
            <div
              className="carousel-slide"
              style={{
                backgroundImage: `url(${japanese})`,
              }}
            />
          </div>
          <div>
            <div
              className="carousel-slide"
              style={{
                backgroundImage: `url(${futurism})`,
              }}
            />
          </div>
        </Carousel>
      </div>
    </>
  );
};

export default CustomCarousel;
