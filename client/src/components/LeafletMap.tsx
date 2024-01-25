import { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ExperiencesContext } from "../context/ExperiencesContext";
import "../styles/Map.css";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "../assets/marker.png";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";

function LeafletMap() {
  const { experiences } = useContext(ExperiencesContext);
  const [location, setLocation] = useState([0, 0]);
  const positions = [52.52, 13.405];

  const navigateTo = useNavigate();

  const [showMapModal, setShowMapModal] = useState(false);

  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  const redirectToLink = (experienceID: string) => {
    navigateTo(`/experiences/id/${experienceID}`);
  };

  const geoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      setShowMapModal(true);
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
                  <Link
                    to={`/experiences/id/${experience._id}`}
                    state={{ experience: experience }}
                  >
                    experience
                    <Popup>
                      <p
                        style={{
                          color: "black",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        id="popup-text"
                      >
                        {experience.title}
                      </p>
                      <img
                        style={{ cursor: "pointer" }}
                        src={experience.photo}
                        alt="Encounter"
                        id="popup-image"
                      />{" "}
                      {experience.location.city}, {experience.location.country}
                    </Popup>
                  </Link>
                </div>
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
