import { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ExperiencesContext } from "../context/ExperiencesContext";
import "../styles/Map.css";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "../assets/marker.png";
import { Link } from "react-router-dom";

function LeafletMap() {
  const { experiences } = useContext(ExperiencesContext);
  const [location, setLocation] = useState([0, 0]);
  const positions = [52.52, 13.405];

  const geoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Cannot display location");
    }
  };

  const showPosition = (position) => {
    const { longitude, latitude } = position.coords;
    const positionArray = [latitude, longitude];
    setLocation(positionArray);
  };

  const customIcon = new Icon({
    iconUrl: LocationMarker,
    iconSize: [30, 35],
    iconAnchor: [12, 31],
    popupAnchor: [-3, -76],
  });

  useEffect(() => {
    geoLocation();
    // REVIEW referential equiality : experiences is an array of objects, so this useEffect is supposed to run everytime the array of experiences is sent to this component, even if they are the same ones.
  }, [experiences]);

  return (
    <div className="main-container">
      <span className="general-map-card">
        <div>
          {experiences && experiences.length ? (
            <p style={{ color: "black" }}>
              {" "}
              There are currently {experiences.length} experiences across the
              world.
            </p>
          ) : (
            <p></p>
          )}
        </div>
        {/* //REVIEW TS is complaining about the attributtes . Try installing leaflet types  npm i -D @types/leaflet , and import the right one. https://react-leaflet.js.org/docs/start-installation/#typescript-support */}
        <MapContainer
          center={positions}
          zoom={2}
          scrollWheelZoom={false}
          id="map-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {experiences &&
            experiences.map((experience, index) => (
              <Marker
                icon={customIcon}
                key={index}
                position={[
                  experience.location.latitude,
                  experience.location.longitude,
                ]}
                // position={positions}
              >
                <div className="experiencePopUp">
                  <Popup>
                    <Link
                      to={`/experiences/title/${experience.title}`}
                      state={{ experience: experience }}
                    >
                      <p
                        style={{ color: "black", fontWeight: "500" }}
                        id="popup-text"
                      >
                        {experience.title}
                      </p>
                    </Link>
                    <img
                      src={experience.photo}
                      alt="Encounter"
                      id="popup-image"
                    />{" "}
                    {experience.location.city}, {experience.location.country}
                  </Popup>
                </div>
              </Marker>
            ))}
        </MapContainer>
      </span>
    </div>
  );
}

export default LeafletMap;
