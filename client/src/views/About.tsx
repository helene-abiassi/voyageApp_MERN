import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function About() {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="pageBody">
      <h1>voyage</h1>
      <div className="pageAlignment">
        <div className="beigeBox">
          <p>
            Discovers voyage, <br />a public travel blog, where people share
            some of the unique experiences and activities they came up with
            while on vacation. <br />
            <br />
            Whether you went on an alchemy walk in Prague, listened to live Faro
            music at a miradouro in Lisbon, or other, share your story with us.
          </p>
          {user ? (
            <Link className="nakdButton" to={"/experiences"}>
              view experiences
            </Link>
          ) : (
            <Link className="nakdButton" to={"/signup"}>
              join our community
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default About;
