import { Carousel, Typography } from "antd";
const { Title } = Typography;

import cityBuilding from "../assets/city-buildings.jpg";
import kyev from "../assets/10-Best-Cities-to-Visit-in-Ukraine-ETIC-Hotels.jpg";
import amsterdam from "../assets/Netherlands_Amsterdam_SunRise.jpg";

const CustomCarousel = () => {
  return (
    <>
      <div className="carousel-container">
        <div className="carousel-text">
          <Title italic level={1} style={{ color: "#ffe600" }}>
            Discover with us
          </Title>
        </div>
        <Carousel autoplay={true} autoplaySpeed={5000} arrows infinite>
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
                backgroundImage: `url(${kyev})`,
              }}
            />
          </div>
          <div>
            <div
              className="carousel-slide"
              style={{
                backgroundImage: `url(${amsterdam})`,
              }}
            />
          </div>
        </Carousel>
      </div>
    </>
  );
};

export default CustomCarousel;
