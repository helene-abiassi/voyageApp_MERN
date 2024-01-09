import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Experience } from "../types/customTypes";

// fields to update in a state
// all fields to update in object, take
// when submit form, you call the function
// pass arguments that you need to update

// pass all the values, and if there's no update, keep and only call the update function for the values that changed

function UpdateExperience() {
  const [updatedExperience, setUpdatedExperience] = useState<Experience>({
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
  });
  const [updatedPhoto, setUpdatedPhoto] = useState<File | string>("");
  const [elementName, setElementName] = useState(); //Tie these to values in input fields
  const [elementValue, setElementValue] = useState();

  const { experienceId } = useParams();
  console.log("experienceId :>> ", experienceId);

  const { isLoggedIn } = useContext(AuthContext);

  const navigateTo = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedExperience({ ...updatedExperience, [name]: value }); //!
  };

  const handleTypeInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    setUpdatedExperience({
      ...updatedExperience,
      experienceType: e.target.value, //!
    });
  };

  const handlePhotoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedPhoto(e.target.files?.[0] || "");
  };

  const handleUpdatedPhotoSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //! DO i need this or do i just do it as part of my updateFetch
  };

  const handleUpdateExperience = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("no token found!");
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("elementName", `${elementName}`);
    urlencoded.append("elementValue", `${elementValue}`); //!
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
        setUpdatedExperience(results);
      }
    } catch (error) {
      console.log("error when trying to update your experience :>> ", error);
    }
    alert("Experience updated successfully!");
    console.log("updatedExperience :>> ", updatedExperience);
    navigateTo("/experiences");
  };

  useEffect(() => {
    setUpdatedExperience(updatedExperience);
  }, [isLoggedIn]);

  return (
    <div className="inputColorBox">
      <form onSubmit={handleUpdatedPhotoSubmit}>
        photo
        <input onChange={handlePhotoInputChange} name="photo" type="file" />
        <button type="submit">upload</button>
      </form>

      <form onSubmit={handleUpdateExperience}>
        <br />
        <label htmlFor="title">title:</label>
        <input
          onChange={handleInputChange}
          value={updatedExperience.title}
          name="title"
          type="text"
        />
        <br />
        <br />
        <label htmlFor="caption">caption:</label>
        <input
          onChange={handleInputChange}
          value={updatedExperience.caption}
          name="caption"
          type="text"
        />
        <br />
        <br />
        <label htmlFor="country">country:</label>
        <input
          onChange={handleInputChange}
          value={updatedExperience.location.country}
          name="country"
          type="text"
        />
        <br />
        <br />
        <label htmlFor="city">city:</label>
        <input
          onChange={handleInputChange}
          value={updatedExperience.location.city}
          name="city"
          type="text"
        />
        <br />
        <br />
        <label htmlFor="experienceType">experience type:</label>
        <select
          onChange={handleTypeInputChange}
          id="experienceType"
          name="experienceType"
          value={updatedExperience.experienceType}
        >
          <option value="search">Search</option>
          <option value="hiking">hiking</option>
          <option value="faunaflora">fauna & flora</option>
          <option value="wildlife">wildlife</option>
        </select>
        <br />
        <br />
        <label htmlFor="story">story:</label>
        <input
          name="text_body"
          onChange={handleInputChange}
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



UpdateExperience function 

const handleUpdateExperience = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Create an object to store the fields that need to be updated
  const updatedFields: { [key: string]: any } = {};

  // Check which fields are filled and add them to the updatedFields object
  if (elementName && elementValue) {
    updatedFields[elementName] = elementValue;
  }

  // Update only if there are fields to update
  if (Object.keys(updatedFields).length === 0) {
    alert("No fields to update!");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    console.log("no token found!");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      _id: experienceId,
      ...updatedFields,
    }),
  };

  try {
    const response = await fetch(
      "http://localhost:5005/api/experiences/updateexperience",
      requestOptions
    );

    if (response.ok) {
      const result = await response.json();
      console.log("Result for updated experience: ", result);
      setUpdatedExperience(result.updatedExperience);
      alert("Experience updated successfully!");
      navigateTo("/experiences");
    } else {
      console.log("Failed to update experience");
    }
  } catch (error) {
    console.log("Error when trying to update your experience: ", error);
  }
  alert("experience successfully updated!");
  navigateTo(-1);
};




  //   const handleUpdateExperience = async (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();

  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       console.log("no token found!");
  //     }
  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  //     myHeaders.append("Authorization", `Bearer ${token}`);

  //     const urlencoded = new URLSearchParams();
  //     urlencoded.append("elementName", `${elementName}`);
  //     urlencoded.append("elementValue", `${elementValue}`); //!
  //     urlencoded.append("_id", `${experienceId}`);

  //     const requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: urlencoded,
  //     };
  //     try {
  //       const response = await fetch(
  //         "http://localhost:5005/api/experiences/updateexperience",
  //         requestOptions
  //       );

  //       if (response.ok) {
  //         const results = await response.json();
  //         console.log("results for my Updated Experience :>> ", results);
  //         setUpdatedExperience(results);
  //       }
  //     } catch (error) {
  //       console.log("error when trying to update your experience :>> ", error);
  //     }
  //     alert("Experience updated successfully!");
  //     console.log("updatedExperience :>> ", updatedExperience);
  //     navigateTo("/experiences");
  //   };




const deleteExperience = async (req, res) => {
  const experienceId = req.params._id;

  try {
    if (!experienceId) {
      return res.status(400).json({
        msg: 'experienceId is required in the URL parameter',
      });
    }

    // Delete experience and capture the deleted experience
    const deletedExperience = await experienceModel.findByIdAndDelete(experienceId);

    if (!deletedExperience) {
      return res.status(404).json({
        msg: 'Experience not found',
      });
    }

    // Delete comments related to the deleted experience
    await commentModel.deleteMany({ experience: experienceId });

    // Remove the experience from user bookmarks and submissions
    const users = await userModel.find({
      $or: [{ bookmarks: experienceId }, { submissions: experienceId }],
    });

    users.forEach(async (user) => {
      // Remove the experience from bookmarks and submissions
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark.toString() !== experienceId
      );
      user.submissions = user.submissions.filter(
        (submission) => submission.toString() !== experienceId
      );
      await user.save();
    });

    res.status(200).json({
      msg: 'Experience deleted successfully',
      experience: deletedExperience,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Something went wrong',
      error: error,
    });
  }
};

export { deleteExperience };




<div className="main-container">
<span className="general-map-card">
  {encounters && encounters.length ? (
    <p>
      {" "}
      There are currently {encounters.length} encounters across the world.
    </p>
  ) : (
    <p></p>
  )}
  <MapContainer
    center={[25, 10]}
    zoom={2}
    scrollWheelZoom={false}
    //   style={{ height: "61vh" }}
    id="map-container"
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />
    {encounters &&
      encounters.map((encounter, index) => (
        <Marker
          key={index}
          position={[encounter.latitude, encounter.longitude]}
          icon={
            new Icon({
              iconUrl: LocationMarker,
              iconSize: [30, 35],
              iconAnchor: [12, 31],
            })
          }
        >
          <Popup className="general-map-popup">
            <Link to={"/" + encounter._id}>
              <p id="popup-text">{encounter.species}</p>
            </Link>
            <br />
            <img
              src={encounter.image}
              alt="Encounter"
              id="popup-image"
            />{" "}
          </Popup>
        </Marker>
      ))}
  </MapContainer>
</span>
</div>