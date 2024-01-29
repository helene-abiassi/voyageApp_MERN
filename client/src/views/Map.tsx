import { useContext, useEffect } from "react";
import LeafletMap from "../components/LeafletMap";
import BackButton from "../components/BackButton";
import { ExperiencesContext } from "../context/ExperiencesContext";

function Map() {
  const { experiences } = useContext(ExperiencesContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <div className="detailsHeader">
        <BackButton />
        <h1>map</h1>
      </div>

      <LeafletMap />
      <br />
      <br />
    </div>
  );
}

export default Map;
