import { Link, useNavigate } from "react-router-dom";
import { Experience } from "../types/customTypes";
import { useContext, useEffect, useState } from "react";
import { formatDate } from "./Functions";
import { AuthContext } from "../context/AuthContext";
import { ExperiencesContext } from "../context/ExperiencesContext";

export interface ExperienceCardProp {
  experience: Experience | Experience[];
}

function ExpCards({ experience }: ExperienceCardProp) {
  const {
    _id,
    author,
    title,
    caption,
    publication_date,
    photo,
    bookmarked_by,
    experienceType,
  } = experience as Experience;

  const { user } = useContext(AuthContext);
  const {
    deleteExperience,
    bookmarkExperience,
    fetchExperiences,
    removeBookmark,
  } = useContext(ExperiencesContext);

  const isBookmarkedInitially =
    user && user.bookmarks.some((bookmark) => bookmark._id === _id);
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitially);
  console.log("isBookmarked :>> ", isBookmarked);

  const navigateTo = useNavigate();

  const handleDeleteExperience = async (experienceID: string) => {
    deleteExperience(experienceID);
    navigateTo("/experiences");
  };

  const handleBookmarkExperience = async (experienceID: string) => {
    bookmarkExperience(experienceID);
    fetchExperiences();
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

  useEffect(() => {}, [user, experience, isBookmarked]);

  return (
    <div>
      <div>
        <div className="storyCardSingle">
          <h2 className="storyCardTitle">{title}</h2>
          <div className="iconSet">
            {user?.email === experience.author.email && (
              <button
                className="deleteIcon"
                onClick={() => {
                  handleDeleteExperience(_id);
                }}
              >
                <i
                  className="fa fa-trash"
                  style={{ fontSize: "24px", color: "black" }}
                ></i>
              </button>
            )}{" "}
            {user?.email === experience.author.email && (
              <Link className="deleteIcon" to={`/updateexperience/${_id}`}>
                <i
                  className="fa fa-pencil"
                  style={{ fontSize: "24px", color: "black" }}
                ></i>
              </Link>
            )}{" "}
          </div>
          <div>
            <div className="bookmarkSet">
              <button
                className="bookIcon"
                onClick={() => {
                  handleBookmarkClick(_id);
                }}
                style={{
                  fontSize: "34px",
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
              <p className="bookmarkLgth">{bookmarked_by.length}</p>
            </div>

            <img className="gridPhoto" src={photo} />

            <p>
              by {author?.username}, on {formatDate(publication_date)}
            </p>
          </div>
          <p className="storyCardCaption">{caption}</p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="22"
              viewBox="0 0 15 22"
              fill="none"
            >
              <path
                d="M13.47 7.67H15V22H13.47V11.6C12.67 11.44 11.92 11.14 11.21 10.71C10.5 10.28 9.90001 9.78 9.39001 9.2L8.77001 12.27L11 14.47V22H9.00001V16L6.76001 13.8L4.89001 22H2.73001C2.73001 22 5.86001 6.22 5.89001 6.09C6.00001 5.61 6.22001 5.24 6.59001 5C6.96001 4.73 7.33001 4.6 7.71001 4.6C8.10001 4.6 8.46001 4.69 8.79001 4.87C9.13001 5.04 9.39001 5.29 9.58001 5.61L10.64 7.24C10.93 7.78 11.32 8.25 11.81 8.63C12.3 9.01 12.86 9.3 13.47 9.5V7.67ZM4.55001 4.89L3.40001 4.65C2.83001 4.5 2.31001 4.62 1.84001 4.94C1.38001 5.26 1.10001 5.7 1.00001 6.28L0.19001 10.26C0.16001 10.55 0.220011 10.81 0.380011 11.05C0.540011 11.29 0.75001 11.42 1.00001 11.46L3.21001 11.89L4.55001 4.89ZM9.00001 0C7.90001 0 7.00001 0.9 7.00001 2C7.00001 3.1 7.90001 4 9.00001 4C10.1 4 11 3.11 11 2C11 0.89 10.11 0 9.00001 0Z"
                fill="black"
              />
            </svg>{" "}
            {experienceType}
          </p>
          <Link
            className="nakdButton"
            to={`${title}`}
            state={{
              experience: experience,
            }}
          >
            read more
          </Link>
        </div>
        <br />
      </div>
    </div>
  );
}

export default ExpCards;
