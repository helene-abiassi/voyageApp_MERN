import "../styles/Home.css";
import { Link } from "react-router-dom";
// import Carousel from "../components/Carousel";
import { useContext, useEffect } from "react";
import { ExperiencesContext } from "../context/ExperiencesContext";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { experiences } = useContext(ExperiencesContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <h1>explore. discover. share.</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="beigeBox">
          <h2>Welcome {user?.username}!</h2>
          <h3>{experiences?.length} experiences for you to discover</h3>
          <p>
            Discovers voyage! A public travel blog, where people share some of
            the unique experiences and activities they came up with while on
            vacation. Whether you went on an alchemy walk in Prague, listened to
            live Faro music at a miradouro in Portugal, or discovered a hiddne
            gem during your travels, share your story with us.
          </p>
          <figcaption>
            exclusive access only for responsible tourists.
          </figcaption>
          <br />
          <Link
            style={{ color: "black" }}
            className="nakdButton"
            to={"/experiences"}
          >
            start exploring
          </Link>
        </div>
      </div>
      <br />
      <div className="top5Carousel">{/* <Carousel /> */}</div>
    </div>
  );
}

export default Home;
