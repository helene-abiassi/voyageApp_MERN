import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ExperiencesContext } from "../context/ExperiencesContext";
import { Experience, ExperienceImage } from "../types/customTypes";
import "../styles/Experiences.css";
import "../styles/Home.css";
import { serverURL } from "../utilities/serverUrl";

function SubmitExperience() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const { fetchExperiences } = useContext(ExperiencesContext);

  const url = serverURL;

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
    photo:
      "https://res.cloudinary.com/dfm1r4ikr/image/upload/v1699830493/voyageApp/logo-variations-01_atukuy.png",
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
  const [photoAlbum, setPhotoAlbum] = useState<File[] | string[]>([]);
  const [displayPhoto, setDisplayPhoto] = useState<File | string>("");

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
        `${url}experiences/mainphotoupload`,
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
        `${url}experiences/photoalbumupload`,
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
    urlencoded.append("longitude", newExperience.location.latitude as string);
    urlencoded.append("latitude", newExperience.location.longitude as string);
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
        `${url}experiences/experiencesubmission`,
        requestOptions
      );
      const results = await response.json();
      console.log("results from submitExperience :>> ", results);
    } catch (error) {
      console.log("error :>> ", error);
    }
    alert("experience posted!!");
    await fetchExperiences();
    navigateTo("/experiences");
  };

  useEffect(() => {
    setNewExperience(newExperience);
  }, [isLoggedIn]);

  return (
    <div>
      <div className="inputColorBox">
        <div className="formRow">
          <img src={newExperience.photo} alt="" />
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
        </div>

        <div className="formRow">
          <form onSubmit={handlePhotoAlbumSubmit}>
            <div className="formColumn">
              <div className="formRow">
                <label>photo album (up to 4)</label>
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
        </div>
        <form onSubmit={handleSubmitExperience}>
          <div className="formColumn">
            <div className="formRow">
              <label htmlFor="title">title*</label>
              <input
                onChange={handleFormInput}
                name="title"
                type="text"
                required
              />
            </div>
            <div className="formRow">
              <label htmlFor="caption">caption*</label>
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
              <label htmlFor="country">country*</label>
              <input
                onChange={handleLocationInput}
                name="country"
                type="text"
                required
              />
            </div>
            <div className="formRow">
              <label htmlFor="city">city*</label>
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
              <label htmlFor="latitude">latitude*</label>
              <input
                onChange={handleLocationInput}
                name="latitude"
                type="text"
                required
              />
            </div>
            <div className="formRow">
              <label htmlFor="longitude">longitude*</label>
              <input
                onChange={handleLocationInput}
                name="longitude"
                type="text"
                required
              />
            </div>
          </div>
          <div className="formColumn">
            <div className="formRow">
              <label htmlFor="story">story*</label>
              <input
                style={{
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
                <option value="roadtrips">roadtrips</option>
                <option value="scenery">scenery</option>
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
