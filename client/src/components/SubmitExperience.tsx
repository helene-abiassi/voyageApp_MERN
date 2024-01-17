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
  console.log("user on my Submit page :>> ", user);

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
    console.log("e.target.value :>> ", e.target.value);
    setNewExperience({ ...newExperience, experienceType: e.target.value });
  };

  const handlePhotoInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e :>> ", e);
    setDisplayPhoto(e.target.files?.[0] || "");
  };

  const handleDisplayPhotoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("photo", displayPhoto);
    console.log("formdata :>> ", formdata);

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
      console.log("result single photo:>> ", result);

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
      console.log("photoArray :>> ", photoArray);
      setPhotoAlbum(photoArray);
    }
  };

  const handlePhotoAlbumSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    for (let i = 0; i < photoAlbum.length; i++) {
      formdata.append("photo_body", photoAlbum[i]);
    }

    console.log("formdata :>> ", formdata);
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
      console.log("result album photo:>> ", result);
      console.log("result.photo_urls :>> ", result.photo_urls);
      setNewExperience({ ...newExperience, photo_body: result.photo_urls });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleSubmitExperience = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      console.error("You need to log in first");
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
      console.log("results :>> ", results);
    } catch (error) {
      console.log("error :>> ", error);
    }
    alert("experience posted!!");
    navigateTo("/experiences");
    console.log("newExperience :>> ", newExperience);
  };

  useEffect(() => {
    setNewExperience(newExperience);
  }, [isLoggedIn]);

  return (
    <div>
      <div className="inputColorBox">
        <form onSubmit={handleDisplayPhotoSubmit}>
          photo*
          <input onChange={handlePhotoInput} name="photo" type="file" />
          <button className="nakdButton" type="submit">
            upload
          </button>
        </form>
        <br />
        <form onSubmit={handlePhotoAlbumSubmit}>
          photo album
          <input
            onChange={handlePhotoAlbumInput}
            multiple
            name="photo_body"
            type="file"
          />
          <button className="nakdButton" type="submit">
            upload
          </button>
          <p>{"{you can upload up to 4 photos}"}</p>
        </form>
        <br />
        <form onSubmit={handleSubmitExperience}>
          <br />
          <label htmlFor="title">title*</label>
          <input onChange={handleFormInput} name="title" type="text" required />
          <br />
          <br />
          <label htmlFor="caption">caption*</label>
          <input
            onChange={handleFormInput}
            name="caption"
            type="text"
            required
          />
          <br />
          <br />
          <label htmlFor="country">country*</label>
          <input
            onChange={handleLocationInput}
            name="country"
            type="text"
            required
          />
          <br />
          <br />
          <label htmlFor="city">city*</label>
          <input
            onChange={handleLocationInput}
            name="city"
            type="text"
            required
          />
          <br />
          <br />
          <label htmlFor="longitude">longitude*</label>
          <input
            onChange={handleLocationInput}
            name="longitude"
            type="text"
            required
          />
          <br />
          <br />
          <label htmlFor="latitude">latitude*</label>
          <input
            onChange={handleLocationInput}
            name="latitude"
            type="text"
            required
          />
          <br />
          <br />
          <label htmlFor="experienceType">experience type*</label>
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
          <br />
          <br />
          <label htmlFor="story">story*</label>
          <input
            name="text_body"
            onChange={handleFormInput}
            id="textInput"
            type="text"
            placeholder="Tell us your experience here..."
            required
          />
          <br />
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
