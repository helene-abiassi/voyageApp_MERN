import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { formatDate } from "../utilities/Functions";
import { FiMapPin } from "react-icons/fi";
import "../styles/ProfilePage.css";

function ProfileCard() {
  const { user, getProfile, logOut, deleteProfile } = useContext(AuthContext);

  const navigateTo = useNavigate();

  const handleDeleteProfileButton = (userID: string) => {
    if (window.confirm("Are you SURE you want to delete your profile?")) {
      deleteProfile(userID);
      navigateTo("/");
    }
    return;
  };

  const handleLogOutButton = () => {
    if (window.confirm("Are you SURE you want to log out?")) {
      logOut();
      navigateTo("/");
    } else {
      return;
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="profileBody">
      <div className="titleEditIcon">
        {/* USER INFO */}
        <Link to={`/updateprofile/${user!._id}`}>
          <i style={{ color: "black" }} className="fa fa-pencil"></i>
        </Link>{" "}
      </div>
      <div className="profileColumns">
        <div className="profileColumnLeft">
          <div className="userProfile">
            <img
              id="userProfilePhoto"
              src={
                user?.user_image ||
                "https://res.cloudinary.com/dfm1r4ikr/image/upload/v1697397728/voyageApp/userPhoto.png"
              }
              alt=""
            />{" "}
            <div className="userInfoColumn">
              <span>username:</span>
              <p className="inputContainer"> {user?.username}</p>
              email:
              <p className="inputContainer"> {user?.email}</p>
              <span>member since:</span>
              <p className="inputContainer">
                {user && formatDate(user.member_since)}
              </p>
              <span>bio:</span>
              <p
                style={{ maxWidth: "25rem", textAlign: "left" }}
                className="inputContainer"
              >
                {user?.bio}
              </p>
            </div>
          </div>
          <br />
          <br />
          <div>
            <button className="nakdButton" onClick={handleLogOutButton}>
              log out
            </button>
            <button
              className="nakdButton"
              onClick={() => {
                handleDeleteProfileButton(user!._id);
              }}
            >
              delete
            </button>
          </div>
          <br />
          <hr />
          {/* BOOKMARKS */}
          <h2>Bookmarks:</h2>
          <div style={{ justifyContent: "center" }} className="profileSection">
            {user?.bookmarks?.length === 0 && (
              <div className="profileCards">
                <p>You don't have any bookmarks yet.</p>
              </div>
            )}
            {user?.bookmarks &&
              user.bookmarks.map((bookmark, bookInd) => {
                return (
                  <div key={bookInd}>
                    <div className="profileCards">
                      <Link
                        to={`/experiences/id/${bookmark._id}`}
                        state={{ experience: bookmark }}
                      >
                        <img
                          style={{ width: "100%", borderRadius: "0.625rem" }}
                          src={bookmark.photo}
                          alt={bookmark.title}
                        />
                        <p style={{ fontWeight: "600" }}>{bookmark.title}</p>
                        <p>by {bookmark.author.username}</p>
                        <p>{formatDate(bookmark.publication_date)}</p>
                        <p>
                          <span>
                            {" "}
                            <FiMapPin />{" "}
                          </span>
                          {bookmark.location.city}, {bookmark.location.country}
                        </p>
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
          <br />
          <hr />
          {/* SUBMISSIONS */}
          <h2>Submissions:</h2>
          <div style={{ justifyContent: "center" }} className="profileSection">
            {user?.submissions?.length === 0 && (
              <div className="profileCards">
                <p>You don't have any submissions yet.</p>
              </div>
            )}
            {user?.submissions &&
              user.submissions.map((submission, submInd) => {
                return (
                  <div className="profileCards" key={submInd}>
                    <Link
                      to={`/experiences/id/${submission._id}`}
                      state={{ experience: submission }}
                    >
                      <img
                        style={{ width: "100%", borderRadius: "0.625rem" }}
                        src={submission.photo}
                        alt={submission.title}
                      />
                      <p style={{ fontWeight: "600" }}>{submission.title}</p>
                      <p>by you</p>
                      <p>{formatDate(submission.publication_date)}</p>
                      <p>
                        <span>
                          <FiMapPin />{" "}
                        </span>
                        {submission.location.city},{" "}
                        {submission.location.country}
                      </p>{" "}
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
