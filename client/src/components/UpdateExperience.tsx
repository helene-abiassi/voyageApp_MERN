import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Experience, ExperienceImage } from "../types/customTypes";

function UpdateExperience() {
  const { experienceId } = useParams();
  console.log("experienceId :>> ", experienceId);

  const [existingExperience, setExistingExperience] = useState<Experience>();
  const [updatedExperience, setUpdatedExperience] = useState<Experience>({
    _id: experienceId!,
    author: {
      a_id: existingExperience!.author.a_id,
      username: existingExperience!.author.username,
      email: existingExperience!.author.email,
      bio: existingExperience!.author.bio,
      member_since: existingExperience!.author.member_since,
      user_image: existingExperience!.author.user_image,
    },
    title: existingExperience!.title,
    caption: existingExperience!.caption,
    publication_date: new Date(),
    photo: existingExperience!.photo,
    location: {
      country: existingExperience!.location.country,
      city: existingExperience!.location.city,
      longitude: existingExperience!.location.longitude,
      latitude: existingExperience!.location.latitude,
    },
    experienceType: existingExperience!.experienceType,
    text_body: existingExperience!.text_body,
    photo_body: existingExperience!.photo_body,
    comments: existingExperience!.comments,
    bookmarked_by: [],
  });
  const [updatedPhoto, setUpdatedPhoto] = useState<File | string>(
    existingExperience!.photo
  );

  const navigateTo = useNavigate();

  const handleUpdateExperience = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("updatedExperience :>> ", updatedExperience);

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("no token found!");
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append(
      "title",
      `${updatedExperience.title}` || `${existingExperience?.title}`
    );
    urlencoded.append(
      "caption",
      `${updatedExperience.caption}` || `${existingExperience?.caption}`
    );
    urlencoded.append(
      "country",
      `${updatedExperience?.location.country}` ||
        `${existingExperience?.location.country}`
    );
    urlencoded.append(
      "city",
      `${updatedExperience?.location.city}` ||
        `${existingExperience?.location.city}`
    );
    urlencoded.append(
      "longitude",
      `${updatedExperience?.location.longitude}` ||
        `${existingExperience?.location.longitude}`
    );
    urlencoded.append(
      "latitude",
      `${updatedExperience?.location.latitude}` ||
        `${existingExperience?.location.latitude}`
    );
    urlencoded.append(
      "experienceType",
      `${updatedExperience?.experienceType}` ||
        `${existingExperience?.experienceType}`
    );
    urlencoded.append(
      "text_body",
      `${updatedExperience?.text_body}` || `${existingExperience?.text_body}`
    );
    urlencoded.append(
      "photo",
      `${updatedExperience?.photo}` || `${existingExperience?.photo}`
    );

    urlencoded.append("_id", `${experienceId}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:5005/api/experiences/updateexperience",
        requestOptions
      );

      if (response.ok) {
        const results = await response.json();
        console.log("results for my Updated Experience :>> ", results);
        setUpdatedExperience(results.data);
      }
      fetchExistingData();
    } catch (error) {
      console.log("error when trying to update your experience :>> ", error);
    }
    alert("Experience updated successfully!");
    console.log("updatedExperience :>> ", updatedExperience);
    navigateTo("/experiences");
  };

  const fetchExistingData = async () => {
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        `http://localhost:5005/api/experiences/id/${experienceId}`,
        requestOptions
      );

      if (response.ok) {
        const results = await response.json();
        console.log("results on Update :>> ", results);
        setExistingExperience(results.data);
        console.log("existingExperience :>> ", existingExperience);
      }
    } catch (error) {
      console.log("error in your update comp:>> ", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("value, name :>> ", value, name);
    setUpdatedExperience((prevExperience) => ({
      ...prevExperience,
      [name]: value,
    }));
  };

  const handleTypeInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    setUpdatedExperience({
      ...updatedExperience,
      experienceType: e.target.value,
    });
  };

  const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedExperience((prevExperience) => ({
      ...prevExperience,
      location: {
        ...prevExperience.location,
        [name]: value,
      },
    }));
  };

  const handlePhotoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e :>> ", e);
    setUpdatedPhoto(e.target.files?.[0] || "");
  };

  const handleUpdatedPhotoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("photo", updatedPhoto);

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

      setUpdatedExperience((prevExperience) => {
        return { ...prevExperience, photo: result.photo };
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    fetchExistingData();
  }, []);

  useEffect(() => {
    if (existingExperience) {
      setUpdatedExperience(existingExperience);
    }
  }, [existingExperience]);

  return (
    <div className="inputColorBox">
      <form onSubmit={handleUpdatedPhotoSubmit}>
        <label htmlFor="photo">photo</label>
        <input onChange={handlePhotoInputChange} name="photo" type="file" />
        <button type="submit">upload</button>
      </form>

      <form onSubmit={handleUpdateExperience}>
        <br />
        <label htmlFor="title">title:</label>
        <input
          onChange={handleInputChange}
          value={updatedExperience.title || existingExperience?.title || ""}
          name="title"
          type="text"
        />
        <br />
        <br />
        <label htmlFor="caption">caption:</label>
        <input
          onChange={handleInputChange}
          value={updatedExperience.caption || existingExperience?.caption || ""}
          name="caption"
          type="text"
        />
        <br />
        <br />
        <label htmlFor="city">city:</label>
        <input
          onChange={handleLocationInputChange}
          value={
            updatedExperience.location.city ||
            existingExperience?.location.city ||
            ""
          }
          name="city"
          type="text"
        />
        <br />
        <br />
        <label htmlFor="country">country:</label>
        <input
          onChange={handleLocationInputChange}
          value={
            updatedExperience.location.country ||
            existingExperience?.location.country ||
            ""
          }
          name="country"
          type="text"
        />
        <br />
        <br />
        <label htmlFor="experienceType">experience type:</label>
        <select
          onChange={handleTypeInputChange}
          id="experienceType"
          name="experienceType"
          value={
            updatedExperience.experienceType ||
            existingExperience?.experienceType ||
            ""
          }
        >
          <option value="search">Search</option>
          <option value="hiking">hiking</option>
          <option value="faunaflora">fauna & flora</option>
          <option value="wildlife">wildlife</option>
          <option value="citywalk">citywalk</option>
        </select>
        <br />
        <br />
        <label htmlFor="story">story:</label>
        <input
          name="text_body"
          onChange={handleInputChange}
          value={
            updatedExperience.text_body || existingExperience?.text_body || ""
          }
          id="textInput"
          type="text"
        />
        <br />
        <button className="formButton" type="submit">
          submit
        </button>
      </form>
    </div>
  );
}

export default UpdateExperience;
