import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Experience, ExperienceImage } from "../types/customTypes";
import "../styles/Home.css";
import "../styles/Experiences.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

function SubmitExperience() {
  const [displayPhoto, setDisplayPhoto] = useState<File | string>("");
  const [photoAlbum, setPhotoAlbum] = useState<File[] | string[]>([]);

  const { user, isLoggedIn } = useContext(AuthContext);

  const [newExperience, setNewExperience] = useState<Experience>({
    _id: "",
    author: {
      a_id: "",
      username: "",
      email: "",
      bio: "",
      member_since: Date(),
      user_image: "",
    },
    title: "",
    caption: "",
    publication_date: new Date(),
    photo: "",
    location: {
      country: "",
      city: "",
      longitude: "",
      latitude: "",
    },
    experienceType: "",
    text_body: "",
    photo_body: [""],
    comments: [],
    bookmarked_by: [],
  });

  const navigateTo = useNavigate();

  const handleFormInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
  };

  const handleLocationInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExperience({
      ...newExperience,
      location: {
        ...newExperience.location,
        [name]: value,
      },
    });
  };

  const handleTypeInput = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewExperience({ ...newExperience, experienceType: e.target.value });
  };

  const handlePhotoInput = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayPhoto(e.target.files?.[0] || "");
  };

  const handleDisplayPhotoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("photo", displayPhoto);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    try {
      const response = await fetch(
        "http://localhost:5005/api/experiences/mainphotoupload",
        requestOptions
      );
      const result = (await response.json()) as ExperienceImage;

      setNewExperience({ ...newExperience, photo: result.photo });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handlePhotoAlbumInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const photoArray: File[] = [];
      for (let i = 0; i < files.length; i++) {
        photoArray.push(files[i]);
      }
      setPhotoAlbum(photoArray);
    }
  };

  const handlePhotoAlbumSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    for (let i = 0; i < photoAlbum.length; i++) {
      formdata.append("photo_body", photoAlbum[i]);
    }
    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    try {
      const response = await fetch(
        "http://localhost:5005/api/experiences/photoalbumupload",
        requestOptions
      );

      const result = await response.json();
      setNewExperience({ ...newExperience, photo_body: result.photo_urls });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleSubmitExperience = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      console.error("You need to log in first");
      alert("You need to log in first");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const photoBodyJSON = JSON.stringify(newExperience.photo_body);

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", user!.email);
    urlencoded.append("title", newExperience.title);
    urlencoded.append("caption", newExperience.caption);
    urlencoded.append("photo", newExperience.photo);
    urlencoded.append("country", newExperience.location.country);
    urlencoded.append("city", newExperience.location.city);
    urlencoded.append("longitude", newExperience.location.latitude);
    urlencoded.append("latitude", newExperience.location.longitude);
    urlencoded.append("experienceType", newExperience.experienceType);
    urlencoded.append("text_body", newExperience.text_body);
    urlencoded.append("photo_body", photoBodyJSON);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:5005/api/experiences/experiencesubmission",
        requestOptions
      );
      const results = await response.json();
    } catch (error) {
      console.log("error :>> ", error);
    }
    alert("experience posted!!");
    navigateTo("/experiences");
  };

  useEffect(() => {
    setNewExperience(newExperience);
  }, [isLoggedIn]);

  return (
    <div>
      <div className="inputColorBox">
        <form onSubmit={handleDisplayPhotoSubmit}>
          <div className="formColumn">
            <div className="formRow">
              <span style={{ marginRight: "1rem" }}>photo*</span>
              <input onChange={handlePhotoInput} name="photo" type="file" />
            </div>
            <button className="nakdButton" type="submit">
              upload
            </button>
          </div>
        </form>
        <form onSubmit={handlePhotoAlbumSubmit}>
          <div className="formColumn">
            <div className="formRow">
              <span style={{ marginRight: "1rem" }}>photo album (up to 4)</span>
              <input
                onChange={handlePhotoAlbumInput}
                multiple
                name="photo_body"
                type="file"
              />
            </div>
            <button className="nakdButton" type="submit">
              upload
            </button>
          </div>
        </form>
        <form onSubmit={handleSubmitExperience}>
          <div className="formColumn">
            <div className="formRow">
              <label style={{ marginRight: "1rem" }} htmlFor="title">
                title*
              </label>
              <input
                onChange={handleFormInput}
                name="title"
                type="text"
                required
              />
            </div>
            <div className="formRow">
              <label style={{ marginRight: "1rem" }} htmlFor="caption">
                caption*
              </label>
              <input
                onChange={handleFormInput}
                name="caption"
                type="text"
                required
              />
            </div>
          </div>
          <div className="formColumn">
            <div className="formRow">
              <label style={{ marginRight: "1rem" }} htmlFor="country">
                country*
              </label>
              <input
                onChange={handleLocationInput}
                name="country"
                type="text"
                required
              />
            </div>
            <div className="formRow">
              <label style={{ marginRight: "1rem" }} htmlFor="city">
                city*
              </label>
              <input
                onChange={handleLocationInput}
                name="city"
                type="text"
                required
              />
            </div>
          </div>
          <div className="formColumn">
            <div className="formRow">
              <label style={{ marginRight: "1rem" }} htmlFor="longitude">
                longitude*
              </label>
              <input
                onChange={handleLocationInput}
                name="longitude"
                type="text"
                required
              />
            </div>
            <div className="formRow">
              <label style={{ marginRight: "1rem" }} htmlFor="latitude">
                latitude*
              </label>
              <input
                onChange={handleLocationInput}
                name="latitude"
                type="text"
                required
              />
            </div>
          </div>
          <div className="formColumn">
            <div className="formRow">
              <label style={{ marginRight: "1rem" }} htmlFor="story">
                story*
              </label>
              <input
                style={{
                  marginRight: "1rem",
                  minHeight: "10rem",
                }}
                name="text_body"
                onChange={handleFormInput}
                id="textInput"
                type="text"
                placeholder="Tell us your experience here..."
                required
              />
            </div>
            <div className="formRow">
              <label style={{ marginRight: "1rem" }} htmlFor="experienceType">
                experience type*
              </label>
              <select
                onChange={handleTypeInput}
                id="experienceType"
                name="experienceType"
                value={newExperience.experienceType}
                required
              >
                <option value="search">Search</option>
                <option value="hiking">hiking</option>
                <option value="faunaflora">fauna & flora</option>
                <option value="wildlife">wildlife</option>
                <option value="citywalk">citywalk</option>
              </select>
            </div>
          </div>
          <br />
          <button className="formButton" type="submit">
            submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitExperience;

{
  /* <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
{/* //RAULNOTE - poor attempt of creating markers dynamically */
}
{
  /* experiences.map((experience) => {
  return (
    <Marker position={[experience.location.latitude, experience.location.longitude]}></Marker>
  )
}) */
}
{
  /* <Marker position={location}> */
}
{
  /* Map through marker to show pins of all locations  */
}
// <Popup>
// A pretty CSS3 popup. <br /> Easily customizable.
// </Popup>
// </Marker>
// </MapContainer> */}
