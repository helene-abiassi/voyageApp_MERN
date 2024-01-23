import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "../styles/DetailsPage.css";
import Comments from "../components/Comments";
import BackButton from "../components/BackButton";
import { formatDate } from "../components/Functions";
import { AuthContext } from "../context/AuthContext";
import { Experience } from "../types/customTypes";
import { ExperiencesContext } from "../context/ExperiencesContext";
import { SlMap } from "react-icons/sl";
import { FaHiking } from "react-icons/fa";
import Modal from "../components/Modal";

function ExperienceDetails() {
  const location = useLocation();
  const { experience } = location.state;

  const { _id, bookmarked_by, photo_body } = experience as Experience;

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

  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);
  const [showRemoveBookmarkModal, setShowRemoveBookmarkModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddBookmarkCloseModal = () => {
    setShowAddBookmarkModal(false);
  };
  const handleRemoveBookmarkCloseModal = () => {
    setShowRemoveBookmarkModal(false);
  };
  const handleLoginModal = () => {
    setShowLoginModal(false);
  };

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
      setShowLoginModal(true);
      return;
    }
    if (isBookmarked) {
      handleremoveBookmark(experienceID);
      setShowRemoveBookmarkModal(true);
    } else {
      handleBookmarkExperience(experienceID);
      setShowAddBookmarkModal(true);
    }
    fetchExperiences();
    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {}, [fetchExperiences, experience, experience.comments]);

  return (
    <div>
      <br />
      <div className="detailsPage">
        {/* HEADER BUTTON */}
        <div className="detailsHeader">
          <BackButton />
          <h1>{experience.title}</h1>
        </div>
        <br />
        <div className="expDetails">
          {/* AUTHOR BIO */}

          <div className="expAuthorCard">
            <h2>story by</h2>
            <div className="photoRow">
              <img
                style={{
                  width: "36%",
                  borderRadius: "50%",
                }}
                src={experience.author.user_image}
                alt={experience.author.username}
              />
              <h4>{experience.author.username}</h4>
            </div>
            <div style={{ marginLeft: "1rem" }}>
              <p>{experience.author.bio}</p>
              <p>member since: {formatDate(experience.author.member_since)}</p>
            </div>
          </div>
          {/* EXPERIENCE CARD */}
          <div className="detailsSection">
            <div className="photoCard">
              <img
                style={{
                  width: "97.5%",
                  borderRadius: "10px",
                  border: "10px solid #d7c6ac",
                }}
                src={experience.photo}
                alt=""
              />
              <p style={{ borderRadius: "1px", fontSize: "13pt" }}>
                posted on {formatDate(experience.publication_date)}
              </p>
            </div>

            <div className="textBox">
              <div style={{ marginTop: "-20px" }}>
                {user?.email === experience.author.email && (
                  <button
                    className="deleteIcon"
                    onClick={() => {
                      handleDeleteExperience(experience._id);
                    }}
                  >
                    <i
                      className="fa fa-trash"
                      style={{ fontSize: "18px", color: "black" }}
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
                      style={{ fontSize: "18px", color: "black" }}
                    ></i>
                  </Link>
                )}
              </div>
              <div className="row">
                <p style={{ width: "80%" }}>{experience.caption}</p>

                <div className="bookmarkSet">
                  <button
                    className="bookIcon"
                    onClick={() => {
                      handleBookmarkClick(_id);
                    }}
                    style={{
                      fontSize: "24px",
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
              </div>{" "}
              <hr />
              <div className="row">
                <p>
                  <Link to={"/map"}>
                    <SlMap /> {experience.location.city},
                    {experience.location.country}
                  </Link>
                </p>
                <p>
                  {" "}
                  <FaHiking />
                  {experience.experienceType}
                </p>
              </div>
              <hr />
              <p>{experience.text_body}</p>
              <div className="photoRow slideshow-container">
                {experience.photo_body.map((photo: string, idPhoto: number) => {
                  return (
                    <>
                      <div className={`mySlides fade`}>
                        <img
                          key={idPhoto}
                          style={{ width: "100%", height: "100%" }}
                          src={photo}
                          alt=""
                        />
                      </div>
                    </>
                  );
                })}

                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      {/* COMMENTS */}
      <Comments comments={experience.comments} _id={experience._id} />
      <br />
      <br />
      <br />
      {showAddBookmarkModal && (
        <Modal
          message="Added to bookmarks!"
          onClose={handleAddBookmarkCloseModal}
        />
      )}
      {showRemoveBookmarkModal && (
        <Modal
          message="Removed from bookmarks!"
          onClose={handleRemoveBookmarkCloseModal}
        />
      )}
      {showLoginModal && (
        <Modal message="You need to log in first!" onClose={handleLoginModal} />
      )}
    </div>
  );
}

export default ExperienceDetails;
