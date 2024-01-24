import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import "../styles/logUp.css";
import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types/customTypes";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";

export interface LogInCredentials {
  _id: string;
  email: string;
  password: string;
}

export interface LogInResponse {
  user: User;
  message: string;
  token: string;
}

function Login() {
  const {
    loginCredentials,
    setLoginCredentials,
    logIn,
    isLoggedIn,
    setIsLoggedIn,
    user,
  } = useContext(AuthContext);

  const [passwordType, setPasswordType] = useState("password");
  const [showOrHide, setShowOrHide] = useState("show");
  const changePasswordType = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setShowOrHide("hide");

      return;
    }
    setPasswordType("password");
    setShowOrHide("show");
  };

  const navigateTo = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginInput = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginCredentials({
      ...(loginCredentials as LogInCredentials),
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = loginCredentials as LogInCredentials;

    if (!email.includes("@") && password.length < 6) {
      alert(
        "Your email seems to be invalid. Your password should be at least 6 characters"
      );
      return;
    } else if (password.length < 6) {
      alert("Your password should be at least 6 characters");
      return;
    } else if (!email.includes("@")) {
      alert("Your email seems to be invalid");
      return;
    } else {
      const requestOptions = {
        method: "GET",
      };

      try {
        const response = await fetch(
          `http://localhost:5005/api/users/email/${email}`,
          requestOptions
        );
        const result = await response.json();

        if (result?.data?.length > 0) {
          logIn();
          navigateTo("/profile", { replace: true });
        } else {
          await alert(
            "This email does not exist in the database. Sign up first"
          );
          navigateTo("/signup");
        }
      } catch (error) {
        console.error("Error checking email existence:", error);
      }
    }
  };

  useEffect(() => {}, [isLoggedIn, user]);

  return (
    <>
      <div className="LogUpColorBox">
        <img
          style={{
            width: "20%",
            height: "20%",
            marginLeft: "400px",
          }}
          src="https://res.cloudinary.com/dfm1r4ikr/image/upload/v1698010076/voyageApp/logo-variations-01_atukuy.png"
          alt=""
        />
        <br />
        <br />
        <form className="infoForm" onSubmit={handleSubmitLogin}>
          <div className="formColumnLogup">
            <div className="inputContainer">
              <label htmlFor="email">e-mail*</label>
              <input
                placeholder="enter e-mail..."
                onChange={handleLoginInput}
                name="email"
                type="text"
                required
              />
              <p>* required</p>
            </div>
            <div className="inputContainer">
              <label htmlFor="password">password*</label>
              <input
                onChange={handleLoginInput}
                name="password"
                placeholder="enter password..."
                type={passwordType}
                required
              />
            </div>
          </div>
          <button className="nakdButton" type="submit">
            log in
          </button>
        </form>
        <button
          onClick={changePasswordType}
          className="hide-passwordLogin formButton"
          style={{ cursor: "pointer" }}
        >
          {showOrHide}
        </button>
        <p>
          Don't have an account yet?
          <Link to={"/signup"} style={{ color: "black" }}>
            {" "}
            sign up.
          </Link>
        </p>
      </div>
      {showLoginModal && (
        <Modal
          message="Email does not exist! Please sign up first."
          onClose={handleCloseLoginModal}
        />
      )}
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Login;
