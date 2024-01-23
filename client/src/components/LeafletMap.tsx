import { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ExperiencesContext } from "../context/ExperiencesContext";
import "../styles/Map.css";
import LocationMarker from "../assets/marker.png";
import { Link } from "react-router-dom";

function LeafletMap() {
  const { experiences } = useContext(ExperiencesContext);
  const [position, setPosition] = useState([]);
  const positions = [52.52, 13.405];

  const customIcon = new L.Icon({
    iconUrl: LocationMarker,
    iconSize: [30, 35],
    iconAnchor: [12, 31],
  });

  return (
    <div className="main-container">
      <span className="general-map-card">
        {experiences && experiences.length === 0 ? (
          <p>
            {" "}
            There are currently {experiences.length} experiences across the
            world.
          </p>
        ) : (
          <p></p>
        )}
        <MapContainer
          center={positions}
          zoom={8}
          scrollWheelZoom={false}
          //   style={{ height: "61vh" }}
          id="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {experiences &&
            experiences.map((experience, index) => (
              <Marker
                icon={customIcon}
                key={index}
                // position={[
                //   experience.location.latitude,
                //   experience.location.longitude,
                // ]}
                position={positions}
                // icon={
                //   new Icon({
                //     iconUrl: LocationMarker,
                //     iconSize: [30, 35],
                //     iconAnchor: [12, 31],
                //   })
                // }
              >
                {/* className="general-map-popup" */}
                <Popup>
                  <Link to={"/" + experience._id}>
                    <p id="popup-text">{experience.title}</p>
                  </Link>
                  <br />
                  <img
                    src={experience.photo}
                    alt="Encounter"
                    id="popup-image"
                  />{" "}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </span>
    </div>
  );
}

export default LeafletMap;
