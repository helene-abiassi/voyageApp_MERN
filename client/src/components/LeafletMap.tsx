import { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ExperiencesContext } from "../context/ExperiencesContext";
import LocationMarker from "../assets/marker.png";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import { Icon } from "leaflet";
import "../styles/Map.css";
import "leaflet/dist/leaflet.css";

function LeafletMap() {
  const { experiences, fetchExperiences } = useContext(ExperiencesContext);

  const [location, setLocation] = useState([0, 0]);
  const [showMapModal, setShowMapModal] = useState(false);

  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  const geoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      setShowMapModal(true);
    }
  };

  const showPosition = (position: GeolocationPosition) => {
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
  }, [experiences, fetchExperiences]);

  return (
    <div className="main-container">
      <div className="beigeBox">
        {experiences && experiences.length ? (
          <h3 style={{ color: "black" }}>
            {" "}
            There are currently {experiences.length} experiences across the
            world.
          </h3>
        ) : (
          <h3></h3>
        )}
      </div>
      <span className="general-map-card">
        <MapContainer
          center={[52.52, 13.405]}
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
                  experience.location.latitude as number,
                  experience.location.longitude as number,
                ]}
              >
                <Link
                  to={`/experiences/id/${experience._id}`}
                  state={{ experience: experience }}
                >
                  <Popup>
                    <p id="popup-text">{experience.title}</p>
                    <img
                      src={experience.photo}
                      alt="Encounter"
                      id="popup-image"
                    />{" "}
                    {experience.location.city}, {experience.location.country}
                  </Popup>
                </Link>
              </Marker>
            ))}
        </MapContainer>
      </span>
      {showMapModal && (
        <Modal
          message="Cannot display location"
          onClose={handleCloseMapModal}
        />
      )}
    </div>
  );
}

export default LeafletMap;
