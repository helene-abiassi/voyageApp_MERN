import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, UserImage } from "../types/customTypes";
import "../styles/LogUp.css";
import "../styles/Home.css";
import { serverURL } from "../utilities/serverUrl";

function Signup() {
  const url = serverURL;

  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [newUser, setNewUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
    password: "",
    user_image:
      "https://res.cloudinary.com/dfm1r4ikr/image/upload/v1697397728/voyageApp/userPhoto.png",
    bio: "",
    member_since: new Date(),
    bookmarks: [
      {
        _id: "",
        author: {
          _id: "",
          username: "",
          user_image: "",
        },
        title: "",
        location: {
          city: "",
          country: "",
        },
        publication_date: Date(),
        photo: "",
      },
    ],
    submissions: [
      {
        _id: "",
        author: {
          _id: "",
          username: "",
          user_image: "",
        },
        title: "",
        publication_date: Date(),
        photo: "",
        location: {
          city: "",
          country: "",
        },
      },
    ],
  });
  const [passwordType, setPasswordType] = useState("password");
  const [showOrHide, setShowOrHide] = useState("show");

  const navigateTo = useNavigate();

  const changePasswordType = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setShowOrHide("hide");
      return;
    }
    setPasswordType("password");
    setShowOrHide("show");
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || "");
  };

  const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("user_image", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    try {
      const response = await fetch(`${url}users/imageUpload`, requestOptions);
      const result = (await response.json()) as UserImage;

      setNewUser({ ...newUser, user_image: result.user_image });
    } catch (error) {}
  };

  const handleRegisterInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password, username } = newUser;

    if (username.trim() === "") {
      alert("Username cannot be empty");
      return;
    } else if (!email.includes("@") && password.length < 6) {
      alert(
        "Your email seems to be invalid. \n Your password should be at least 6 characters"
      );
      return;
    } else if (password.length < 6) {
      alert("Your password should be at least 6 characters");
      return;
    } else if (!email.includes("@")) {
      alert("Your email seems to be invalid");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("_id", newUser._id);
    urlencoded.append("username", newUser.username);
    urlencoded.append("email", newUser.email);
    urlencoded.append("password", newUser.password);
    urlencoded.append("user_image", newUser.user_image);
    urlencoded.append("bio", newUser.bio);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(`${url}users/signup`, requestOptions);
      const result = await response.json();
      alert("Congrats!");
      navigateTo("/login");
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    setNewUser(newUser);
  }, []);

  return (
    <>
      <div className="LogUpColorBox">
        <div className="photoLine">
          <form onSubmit={handleFileSubmit}>
            <img src={newUser.user_image} alt="" />

            <input onChange={handleFileInput} name="user_image" type="file" />
            <button className="formButton uploadButton" type="submit">
              upload
            </button>
          </form>
        </div>
        <br />
        <form onSubmit={handleSubmitRegister}>
          <div className="formColumnLogup">
            <div className="inputContainer">
              <label htmlFor="email">e-mail*</label>
              <input
                placeholder="enter e-mail..."
                onChange={handleRegisterInput}
                name="email"
                type="email"
                required
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="password">password*</label>
              <input
                onChange={handleRegisterInput}
                name="password"
                placeholder="enter password..."
                type={passwordType}
                required
              />
            </div>
          </div>
          <br />
          <div className="formColumnLogup">
            <div className="inputContainer">
              <label htmlFor="username">username*</label>
              <input
                placeholder="choose username..."
                onChange={handleRegisterInput}
                name="username"
                type="text"
                style={{ maxWidth: "12.5rem" }}
                required
              />
              <p>* required</p>
            </div>
            <div className="inputContainer">
              <label htmlFor="bio">Tell us a little bit about yourself</label>
              <input
                onChange={handleRegisterInput}
                name="bio"
                type="text"
                placeholder="write a short bio..."
                maxLength={250}
                style={{
                  marginRight: "1rem",
                  minHeight: "10rem",
                  minWidth: "18rem",
                }}
              />
            </div>
          </div>

          <button className="nakdButton" type="submit">
            sign up
          </button>
        </form>
        <button
          onClick={changePasswordType}
          className="hide-passwordSignUp formButton"
          style={{ cursor: "pointer" }}
        >
          {showOrHide}
        </button>
        <Link to={"/login"} style={{ color: "black" }}>
          Already have an account? log in!
        </Link>
      </div>
    </>
  );
}

export default Signup;
