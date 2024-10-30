import { Row } from "antd";
import CardsContainer from "../components/CardsContainer";
import CustomCarousel from "../components/CustomCarousel";

const HomePage = () => {
  return (
    <Row
      justify="center"
      style={{
        padding: "24px",
      }}
    >
      <CustomCarousel />
      <CardsContainer />
    </Row>
  );
};

export default HomePage;
