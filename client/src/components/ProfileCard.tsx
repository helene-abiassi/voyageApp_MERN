import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { formatDate } from "./Functions";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87L20.71 7.04ZM3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"
                fill="black"
              />
            </svg>
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
                member since:{formatDate(user?.member_since)}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                      >
                        <path
                          d="M9.5 17.4167C9.5 17.4167 15.4375 12.6667 15.4375 7.52084C15.4375 4.24164 12.7792 1.58334 9.5 1.58334C6.2208 1.58334 3.5625 4.24164 3.5625 7.52084C3.5625 12.6667 9.5 17.4167 9.5 17.4167Z"
                          stroke="black"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9.5 9.89584C10.8117 9.89584 11.875 8.83252 11.875 7.52084C11.875 6.20917 10.8117 5.14584 9.5 5.14584C8.18833 5.14584 7.125 6.20917 7.125 7.52084C7.125 8.83252 8.18833 9.89584 9.5 9.89584Z"
                          stroke="black"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                      </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                    >
                      <path
                        d="M9.5 17.4167C9.5 17.4167 15.4375 12.6667 15.4375 7.52084C15.4375 4.24164 12.7792 1.58334 9.5 1.58334C6.2208 1.58334 3.5625 4.24164 3.5625 7.52084C3.5625 12.6667 9.5 17.4167 9.5 17.4167Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.5 9.89584C10.8117 9.89584 11.875 8.83252 11.875 7.52084C11.875 6.20917 10.8117 5.14584 9.5 5.14584C8.18833 5.14584 7.125 6.20917 7.125 7.52084C7.125 8.83252 8.18833 9.89584 9.5 9.89584Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span> </span>
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
