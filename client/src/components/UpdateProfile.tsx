import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { User, UserImage } from "../types/customTypes";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const { user, getProfile } = useContext(AuthContext);
  const [updatedUser, setUpdatedUser] = useState<User>(user!);
  const [updatedPhoto, setUpdatedPhoto] = useState<File | string>(
    user!.user_image
  );

  const navigateTo = useNavigate();

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("updatedUser :>> ", updatedUser);

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("no token available");
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
      const response = await fetch(
        "http://localhost:5005/api/users/updateuser",
        requestOptions
      );

      console.log("response :>> ", response);

      if (response.ok) {
        const results = await response.json();

        console.log("results for updated User :>> ", results);
        setUpdatedUser(results.data);
        getProfile();
      }
    } catch (error) {
      console.log("error when trying to update profile :>> ", error);
    }
    alert("Profile updated successfully!");
    console.log("updatedUser :>> ", updatedUser);
    navigateTo("/profile");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("value, name :>> ", value, name);
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
    console.log("e :>> ", e);
    setUpdatedPhoto(e.target.files?.[0] || "");
  };

  const handleUpdatedPhotoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("user_image", updatedPhoto);

    console.log("formdata :>> ", formdata);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    try {
      const response = await fetch(
        "http://localhost:5005/api/users/imageUpload",
        requestOptions
      );
      const result = (await response.json()) as UserImage;
      console.log("result single photo:>> ", result);

      setUpdatedUser((prevUser) => {
        return { ...prevUser, user_image: result.user_image };
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <div className="inputColorBox">
      <div className="inputContainer">
        <img
          style={{
            width: "16%",
            height: "16%",
            marginLeft: "70px",
            borderRadius: "50%",
          }}
          src={updatedUser.user_image || user?.user_image}
          alt=""
        />
        <form onSubmit={handleUpdatedPhotoSubmit}>
          <label style={{ marginRight: "1rem" }} htmlFor="photo">
            photo:
          </label>
          <input onChange={handlePhotoInputChange} name="photo" type="file" />
          <button type="submit">upload</button>
        </form>
      </div>
      <form onSubmit={handleUpdateProfile}>
        <div className="formColumnLogup">
          <div className="inputContainer">
            <label style={{ marginRight: "1rem" }} htmlFor="username">
              username:
            </label>
            <input
              onChange={handleInputChange}
              value={updatedUser.username || user?.username || ""}
              name="username"
              type="text"
            />
          </div>
          <div className="inputContainer">
            <label style={{ marginRight: "1rem" }} htmlFor="email">
              email:
            </label>
            <input
              onChange={handleInputChange}
              value={updatedUser.email || user?.email || ""}
              name="email"
              type="text"
            />
          </div>
        </div>
        <div className="inputContainer">
          <label style={{ marginRight: "1rem" }} htmlFor="bio">
            bio:
          </label>
          <input
            style={{
              marginRight: "1rem",
              minHeight: "10rem",
              minWidth: "18rem",
            }}
            onChange={handleInputChange}
            value={updatedUser.bio || user?.bio || ""}
            name="bio"
            type="text"
          />
        </div>

        <button className="formButton" type="submit">
          submit
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
