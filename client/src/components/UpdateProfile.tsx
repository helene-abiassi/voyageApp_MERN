import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, UserImage } from "../types/customTypes";
import { serverURL } from "../utilities/serverUrl";

function UpdateProfile() {
  const { user, getProfile } = useContext(AuthContext);

  const url = serverURL;

  const [updatedUser, setUpdatedUser] = useState<User>(user!);
  const [updatedPhoto, setUpdatedPhoto] = useState<File | string>(
    user!.user_image
  );

  const navigateTo = useNavigate();

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("_id", user!._id);
    urlencoded.append("email", `${updatedUser.email}` || `${user?.email}`);
    urlencoded.append(
      "username",
      `${updatedUser.username}` || `${user?.username}`
    );
    urlencoded.append("bio", `${updatedUser.bio}` || `${user?.bio}`);
    urlencoded.append(
      "user_image",
      `${updatedUser.user_image}` || `${user?.user_image}`
    );

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(`${url}users/updateuser`, requestOptions);

      if (response.ok) {
        const results = await response.json();

        setUpdatedUser(results.data);
        getProfile();
      }
    } catch (error) {}
    alert("Profile updated successfully!");

    navigateTo("/profile");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  const handlePhotoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedPhoto(e.target.files?.[0] || "");
  };

  const handleUpdatedPhotoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("user_image", updatedPhoto);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    try {
      const response = await fetch(`${url}users/imageUpload`, requestOptions);
      const result = (await response.json()) as UserImage;

      setUpdatedUser((prevUser) => {
        return { ...prevUser, user_image: result.user_image };
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <div className="profileColorBox">
      <form onSubmit={handleUpdatedPhotoSubmit}>
        <div className="formColumnLogup">
          <img
            className="profileUpdatePhoto"
            src={updatedUser.user_image || user?.user_image}
            alt=""
          />{" "}
          <br />
          <div className="profileInputContainer">
            <label htmlFor="photo">photo:</label>
            <input onChange={handlePhotoInputChange} name="photo" type="file" />
            <button className="nakdButton" type="submit">
              upload
            </button>
          </div>
        </div>
      </form>
      <form onSubmit={handleUpdateProfile}>
        <div className="formColumnLogup">
          <div className="profileInputContainer">
            <label htmlFor="username">username:</label>
            <input
              onChange={handleInputChange}
              value={updatedUser.username || user?.username || ""}
              name="username"
              type="text"
            />
          </div>
          <div className="profileInputContainer">
            <label htmlFor="email">email:</label>
            <input
              onChange={handleInputChange}
              value={updatedUser.email || user?.email || ""}
              name="email"
              type="text"
            />
          </div>
        </div>
        <div className="profileInputContainer">
          <label htmlFor="bio">bio:</label>
          <input
            style={{
              minHeight: "10rem",
              minWidth: "18rem",
            }}
            onChange={handleInputChange}
            value={updatedUser.bio || user?.bio || ""}
            name="bio"
            type="text"
          />
        </div>
        <button
          onClick={() => {
            navigateTo(-1);
          }}
          className="formButton"
          type="button"
        >
          cancel
        </button>
        <button className="formButton" type="submit">
          submit
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
