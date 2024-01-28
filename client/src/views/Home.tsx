import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExperiencesContext } from "../context/ExperiencesContext";
import { AuthContext } from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
  const { experiences } = useContext(ExperiencesContext);
  const { user } = useContext(AuthContext);

  const navigateTo = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <h1>explore. discover. share.</h1>
      <div className="pageAlignment">
        <div className="beigeBox">
          {user ? (
            <>
              <h2>Welcome {user?.username}!</h2>
            </>
          ) : (
            <>
              <h2>Welcome!</h2>
            </>
          )}
          <p>
            Discover voyage, <br />a public travel blog, where people share some
            of the unique experiences and activities they came up with while on
            vacation. <br />
            <br />
            Whether you went on an alchemy walk in Prague, listened to live Faro
            music at a miradouro in Lisbon, or other, share your story with us.
          </p>
          <Link
            style={{ color: "black" }}
            className="nakdButton"
            to={"/experiences"}
          >
            start exploring
          </Link>
          <figcaption>
            exclusive access only for responsible tourists.
          </figcaption>
          <br />

          <div
            onClick={() => {
              navigateTo("/experiences");
            }}
            className="circleBox"
          >
            {experiences && (
              <>
                {" "}
                <span className="dot">
                  <p>
                    {experiences?.length} <br /> experiences
                    <br />
                    to discover!
                  </p>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Home;
