import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Details.css";
import { useContext, useEffect, useState } from "react";
import "../styles/DetailsPage.css";
import Comments from "../components/Comments";
import BackButton from "../components/BackButton";
import { formatDate } from "../components/Functions";
import { AuthContext } from "../context/AuthContext";
import { Experience } from "../types/customTypes";
import { ExperiencesContext } from "../context/ExperiencesContext";

function ExperienceDetails() {
  const location = useLocation();
  const { experience } = location.state;

  const { _id, bookmarked_by } = experience as Experience;

  const { user } = useContext(AuthContext);
  const {
    deleteExperience,
    bookmarkExperience,
    fetchExperiences,
    removeBookmark,
    experiences,
  } = useContext(ExperiencesContext);

  const isBookmarkedInitially =
    user && user.bookmarks.some((bookmark) => bookmark._id === _id);
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitially);

  const navigateTo = useNavigate();

  const handleDeleteExperience = async (experienceID: string) => {
    deleteExperience(experienceID);
    navigateTo("/experiences");
  };

  const handleBookmarkExperience = async (experienceID: string) => {
    bookmarkExperience(experienceID);
    console.log("after bookmark/ before fetvh :>> ");
    fetchExperiences();
    console.log("after fetch:>> ");
  };

  const handleremoveBookmark = async (experienceID: string) => {
    removeBookmark(experienceID);
    fetchExperiences();
  };

  const handleBookmarkClick = (experienceID: string) => {
    if (!user) {
      alert("You need to log in first!");
      return;
    }
    if (isBookmarked) {
      handleremoveBookmark(experienceID);
      alert("Removed from bookmarks!");
    } else {
      handleBookmarkExperience(experienceID);
      alert("Added to bookmarks!");
    }
    fetchExperiences();
    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {}, [
    bookmarked_by,
    fetchExperiences,
    experiences,
    experience.comments,
  ]);

  return (
    <div className="expContainer">
      <div className="detailsPage">
        <div className="expDetails">
          <div className="header">
            <BackButton />
            <h2 className="expTitle">{experience.title}</h2>
            <div className="expAuthorCard">
              <h2>story by</h2>
              <img
                style={{
                  width: "36%",
                  marginLeft: "70px",
                  borderRadius: "50%",
                }}
                src={experience.author.user_image}
                alt={experience.author.username}
              />
              <h4>{experience.author.username}</h4>
              <p>{experience.author.bio}</p>
              <p>member since: {formatDate(experience.author.member_since)}</p>
            </div>
            <br />
            <br />
          </div>
          <div className="detailsSection">
            <img
              style={{ width: "50%", height: "50%" }}
              src={experience.photo}
              alt=""
            />
            <div className="textBox">
              <button
                onClick={() => {
                  handleBookmarkClick(_id);
                }}
                style={{
                  fontSize: "16px",
                  backgroundColor: isBookmarked ? "black" : "white",
                  color: isBookmarked ? "white" : "black",
                }}
              >
                {isBookmarked ? (
                  <i className="fa fa-bookmark"></i>
                ) : (
                  <i className="fa fa-bookmark-o"></i>
                )}
              </button>
              <p>{bookmarked_by.length}</p>
              {user?.email === experience.author.email && (
                <button
                  className="deleteIcon"
                  onClick={() => {
                    handleDeleteExperience(experience._id);
                  }}
                >
                  <i
                    className="fa fa-trash"
                    style={{ fontSize: "24px", color: "black" }}
                  ></i>
                </button>
              )}{" "}
              {user?.email === experience.author.email && (
                <Link
                  style={{ backgroundColor: "black" }}
                  to={`/updateexperience/${_id}`}
                  className="deleteIcon"
                >
                  <i
                    className="fa fa-pencil"
                    style={{ fontSize: "24px", color: "black" }}
                  ></i>
                </Link>
              )}{" "}
              <p>{experience.caption}</p>
              <p>{formatDate(experience.publication_date)}</p>
              <hr />
              <p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 22C12 22 19.5 16 19.5 9.5C19.5 5.35785 16.1421 2 12 2C7.85785 2 4.5 5.35785 4.5 9.5C4.5 16 12 22 12 22Z"
                    stroke="black"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 12.5C13.6568 12.5 15 11.1568 15 9.5C15 7.84315 13.6568 6.5 12 6.5C10.3432 6.5 9 7.84315 9 9.5C9 11.1568 10.3432 12.5 12 12.5Z"
                    stroke="black"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
                {experience.location.city},{experience.location.country}
              </p>
              <p>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M17.47 8.67H19V23H17.47V12.6C16.67 12.44 15.92 12.14 15.21 11.71C14.5 11.28 13.9 10.78 13.39 10.2L12.77 13.27L15 15.47V23H13V17L10.76 14.8L8.89001 23H6.73001C6.73001 23 9.86001 7.22 9.89001 7.09C10 6.61 10.22 6.24 10.59 6C10.96 5.73 11.33 5.6 11.71 5.6C12.1 5.6 12.46 5.69 12.79 5.87C13.13 6.04 13.39 6.29 13.58 6.61L14.64 8.24C14.93 8.78 15.32 9.25 15.81 9.63C16.3 10.01 16.86 10.3 17.47 10.5V8.67ZM8.55001 5.89L7.40001 5.65C6.83001 5.5 6.31001 5.62 5.84001 5.94C5.38001 6.26 5.10001 6.7 5.00001 7.28L4.19001 11.26C4.16001 11.55 4.22001 11.81 4.38001 12.05C4.54001 12.29 4.75001 12.42 5.00001 12.46L7.21001 12.89L8.55001 5.89ZM13 1C11.9 1 11 1.9 11 3C11 4.1 11.9 5 13 5C14.1 5 15 4.11 15 3C15 1.89 14.11 1 13 1Z"
                    fill="black"
                  />
                </svg>
                {experience.experienceType}
              </p>
              <p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M8.5 6L2 3V18L8.5 21L15.5 18L22 21V6L15.5 3L8.5 6Z"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.5 3V18"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.5 6V21"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.25 4.5L8.5 6L15.5 3L18.75 4.5"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.25 19.5L8.5 21L15.5 18L18.75 19.5"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </p>
              <hr />
              <p>{experience.text_body}</p>
              {experience.photo_body.map((photo: string, idPhoto: number) => {
                return (
                  <div key={idPhoto}>
                    <div className="photoAlbum">
                      <img style={{ width: "20%" }} src={photo} alt="" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Comments comments={experience.comments} _id={experience._id} />
    </div>
  );
}

export default ExperienceDetails;
