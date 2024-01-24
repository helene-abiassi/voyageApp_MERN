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
  // console.log("user in PROFILE :>> ", user);

  const redirectToExperience = (experienceTitle: string) => {
    // REVIEW as explaind later, since you are not sending any state when you navigate here, but in ExperienceDetails.tsx you use location.state, when it is null, it breaks the code.
    navigateTo(`/experiences/profile/${experienceTitle}`);
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
      <div
        style={{ justifyContent: "space-evenly" }}
        className="profileColumns"
      >
        <div className="profileColumnLeft">
          <div className="userProfile">
            <img
              style={{ width: "20%", borderRadius: "50%" }}
              src={user?.user_image}
              alt=""
            />{" "}
            <div className="profileColumn">
              <p className="inputContainer">username: {user?.username}</p>
              <p className="inputContainer">email: {user?.email}</p>
              <p className="inputContainer">
                member since: {user && formatDate(user.member_since)}
              </p>
              <p className="inputContainer">bio: {user?.bio}</p>
            </div>
          </div>
          <br />
          <br />
          <div>
            <button className="nakdButton" onClick={handleLogOut}>
              log out
            </button>
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
          <hr />
          {/* BOOKMARKS */}
          <h2>Bookmarks:</h2>
          <div style={{ justifyContent: "center" }} className="profileSection">
            {user?.bookmarks && user?.bookmarks.length === 0 ? (
              <div className="profileCards">
                <p>You don't have any bookmarks yet.</p>
              </div>
            ) : null}
            {user?.bookmarks &&
              user.bookmarks.map((bookmark, bookInd) => {
                return (
                  <div key={bookInd}>
                    <div
                      // REVIEW a clickable div to go to another URL...did you heard about Links??? you are gonna need some extra 1on1 sessions ... (not good for accesibility. The problem with the error page after the redirect stays the same, because the component  needs the experience state). Either you send that state, or you fecht a single experience by the tile in the ExperienceDetails component
                      onClick={() => {
                        redirectToExperience(bookmark.title);
                      }}
                      className="profileCards"
                    >
                      <img
                        style={{ width: "100%", borderRadius: "10px" }}
                        src={bookmark.photo}
                        alt={bookmark.title}
                      />
                      <p style={{ fontWeight: "600" }}>{bookmark.title}</p>
                      {/* //REVIEW this link below is doing what the DIV with the onClik  */}
                      <Link to={`/experiences/profile/${bookmark.title}}`}>
                        <p>by {bookmark.author.username}</p>
                      </Link>
                      <p>{formatDate(bookmark.publication_date)}</p>
                      <p>
                        <FiMapPin />
                        <span> </span>
                        {bookmark.location.country}, {bookmark.location.city}
                      </p>
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
            {/* //REVIEW not quite sure about this types of checks. user?.submissions?.length=== 0 feels like enough, since it is what you are actually looking for here. And with an && the ternary "null" wouldn't be needed */}
            {user?.submissions && user?.submissions.length === 0 ? (
              <div className="profileCards">
                <p>You don't have any submissions yet.</p>
              </div>
            ) : null}
            {user?.submissions &&
              user.submissions.map((submission, submInd) => {
                return (
                  <div
                    onClick={() => {
                      redirectToExperience(submission.title);
                    }}
                    className="profileCards"
                    key={submInd}
                  >
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
    </div>
  );
}

export default ProfileCard;
