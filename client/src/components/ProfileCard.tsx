import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { formatDate } from "./Functions";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import { FiMapPin } from "react-icons/fi";

function ProfileCard() {
  const { user, getProfile, logOut, isLoggedIn, deleteProfile } =
    useContext(AuthContext);
  const navigateTo = useNavigate();

  const handleDeleteProfile = (userID: string) => {
    window.confirm("Are you SURE you want to delete your profile?");

    deleteProfile(userID);
    navigateTo("/");
  };

  const handleLogOut = () => {
    window.confirm("Are you SURE you want to log out?");

    logOut();
    navigateTo("/");
  };
  console.log("user in PROFILE :>> ", user);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="profileBody">
      <div className="profileColumns">
        <div className="titleEditIcon editIcon">
          <Link to={`/updateprofile/${user!._id}`}>
            <i className="fa fa-pencil"></i>
          </Link>{" "}
        </div>

        <div className="profileColumnLeft">
          <div className="userProfile">
            <img
              style={{ width: "20%", borderRadius: "50%" }}
              src={user?.user_image}
              alt=""
            />{" "}
            <div className="profileColumn">
              <p className="inputKeys">username:{user?.username}</p>
              <p className="inputKeys">email:{user?.email}</p>
              <p className="inputKeys">
                member since:{user && formatDate(user.member_since)}
              </p>
              <p className="inputKeys">bio:{user?.bio}</p>
            </div>
          </div>
          <br />
          <div style={{ alignItems: "left" }}>
            <button className="nakdButton" onClick={handleLogOut}>
              log out
            </button>
            <span> </span>
            <button
              className="nakdButton"
              onClick={() => {
                handleDeleteProfile(user!._id);
              }}
            >
              delete
            </button>
          </div>
          <br />
          <br />
          <hr />
          <h2>Bookmarks:</h2>
          {user?.bookmarks &&
            user.bookmarks.map((bookmark, bookInd) => {
              return (
                <div key={bookInd}>
                  <div className="profileCards">
                    <img
                      style={{ width: "100%", borderRadius: "10px" }}
                      src={bookmark.photo}
                      alt={bookmark.title}
                    />
                    <p style={{ fontWeight: "600" }}>{bookmark.title}</p>
                    <p>
                      by {bookmark.author.username}, on{" "}
                      {formatDate(bookmark.publication_date)}
                    </p>
                    <p>
                      <FiMapPin />
                      <span> </span>
                      {bookmark.location.country}, {bookmark.location.city}
                    </p>
                  </div>
                </div>
              );
            })}
          <hr />
          <h2>Submissions:</h2>
          {user?.submissions &&
            user.submissions.map((submission, submInd) => {
              return (
                <div className="profileCards" key={submInd}>
                  <img
                    style={{ width: "100%", borderRadius: "10px" }}
                    src={submission.photo}
                    alt={submission.title}
                  />
                  <p style={{ fontWeight: "600" }}>{submission.title}</p>
                  <p>by you, on {formatDate(submission.publication_date)}</p>
                  <p>
                    <span>
                      <FiMapPin />{" "}
                    </span>
                    {submission.location.country}, {submission.location.city}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
