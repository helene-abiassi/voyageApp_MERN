import { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ExperiencesContext } from "../context/ExperiencesContext";
import "../styles/Map.css";
import LocationMarker from "../assets/marker.png";

function LeafletMap() {
  const { experiences } = useContext(ExperiencesContext);
  const [location, setLocation] = useState([0, 0]);

  useEffect(() => {
    geoLocation();
  }, []);

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

  const customIcon = new L.Icon({
    iconUrl: LocationMarker,
    iconSize: [30, 35],
    iconAnchor: [12, 31],
  });

  return (
    <div className="main-container">
      <div className="general-map-card">
        <MapContainer
          center={[51.1657, 10.4515]}
          zoom={4}
          scrollWheelZoom={false}
          // style={{ height: "500px", width: "100%" }}
          maxBounds={[
            [35.0, -25.0],
            [72.0, 40.0],
          ]}
          maxBoundsViscosity={1.0}
          id="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {experiences &&
            experiences?.map((experience, index) => (
              <Marker
                key={index}
                position={[
                  experience.location.latitude,
                  experience.location.longitude,
                ]}
                icon={customIcon}
              >
                <div className="general-map-popup">
                  <Popup>
                    <p>{experience.title}</p>
                  </Popup>
                </div>
              </Marker>
            ))}
          <Marker position={location}>
            <Popup>Your current location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default LeafletMap;
