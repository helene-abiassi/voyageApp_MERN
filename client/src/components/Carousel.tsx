import "../styles/Home.css";
import CarouselCard from "./CarouselCard";

function Carousel() {
  return (
    <div>
      <h2>our most popular experiences:</h2>
      <div className="carouselGrid">
        <CarouselCard />
        <CarouselCard />
        <CarouselCard />
      </div>
    </div>
  );
}

export default Carousel;
