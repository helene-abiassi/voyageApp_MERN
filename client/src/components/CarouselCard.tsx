import "../styles/Home.css";

function CarouselCard() {
  return (
    <div>
      <div className="card">
        <img
          className="carouselPhoto"
          src="https://res.cloudinary.com/dfm1r4ikr/image/upload/v1697317643/voyageApp/logo-variations-02_uffxcy.png"
          alt=""
        />{" "}
        <div className="container">
          <p>title</p>
          <p>caption of the story</p>
        </div>
      </div>
    </div>
  );
}

export default CarouselCard;
