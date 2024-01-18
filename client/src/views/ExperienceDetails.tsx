import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "../styles/DetailsPage.css";
import Comments from "../components/Comments";
import BackButton from "../components/BackButton";
import { formatDate } from "../components/Functions";
import { AuthContext } from "../context/AuthContext";
import { Experience } from "../types/customTypes";
import { ExperiencesContext } from "../context/ExperiencesContext";
import { FiMapPin } from "react-icons/fi";
import { SlMap } from "react-icons/sl";
import { FaHiking } from "react-icons/fa";

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
    // experiences,
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
    await bookmarkExperience(experienceID);
    fetchExperiences();
  };

  const handleremoveBookmark = async (experienceID: string) => {
    await removeBookmark(experienceID);
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

  useEffect(() => {}, [fetchExperiences, experience, experience.comments]);

  return (
    <div className="expContainer">
      <div className="detailsPage">
        {/* BACK BUTTON */}

        <BackButton />

        <div className="expDetails">
          {/* AUTHOR BIO */}

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
          {/* EXPERIENCE CARD */}
          <div className="detailsSection">
            <img
              style={{ width: "50%", height: "50%" }}
              src={experience.photo}
              alt=""
            />
            <div className="textBox">
              <h2 className="expTitle">{experience.title}</h2>
              <div className="bookmarkSet">
                <button
                  className="bookIcon"
                  onClick={() => {
                    handleBookmarkClick(_id);
                  }}
                  style={{
                    fontSize: "18px",
                    color: isBookmarked ? "white" : "black",
                  }}
                >
                  {isBookmarked ? (
                    <i className="fa fa-bookmark"></i>
                  ) : (
                    <i className="fa fa-bookmark-o"></i>
                  )}
                </button>
              </div>
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
                <FiMapPin /> {experience.location.city},
                {experience.location.country}
              </p>
              <p>
                {" "}
                <FaHiking />
                {experience.experienceType}
              </p>
              <p>
                <Link to={"/map"}>
                  <SlMap />
                </Link>
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
      {/* COMMENTS */}
      <Comments comments={experience.comments} _id={experience._id} />
      <br />
      <br />
      <br />
    </div>
  );
}

export default ExperienceDetails;
