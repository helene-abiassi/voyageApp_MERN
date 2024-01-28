import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  useEffect(() => {}, [isLoggedIn, isLoading]);

  return (
    <>
      <nav>
        <div className="navLeft">
          <NavLink to="/">
            <img
              style={{ cursor: "pointer" }}
              className="mainLogo"
              src="https://res.cloudinary.com/dfm1r4ikr/image/upload/v1699830493/voyageApp/logo-variations-01_atukuy.png"
              alt="voyage-logo"
            />
          </NavLink>
        </div>
        <div style={{ cursor: "pointer" }} className="navMiddle">
          <NavLink to="/experiences">experiences</NavLink>
          <span> | </span>
          <NavLink to="/map">map</NavLink>
          <span> | </span>
          <NavLink to="/about">about</NavLink>
        </div>

        <div style={{ cursor: "pointer" }} className="navRight">
          {isLoading ? (
            <div style={{ opacity: 0 }}>
              {" "}
              <>
                <span>profile|</span>
              </>
            </div>
          ) : (
            <>
              {isLoggedIn ? (
                <NavLink to="/profile">profile</NavLink>
              ) : (
                <>
                  <NavLink to="/login">login</NavLink>
                  <span> | </span>
                  <NavLink to="/signup">sign up</NavLink>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
