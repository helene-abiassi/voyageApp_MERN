import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ExperiencesContext } from "../context/ExperiencesContext";
import { AuthContext } from "../context/AuthContext";
import { Experience } from "../types/customTypes";
import { formatDate } from "../utilities/Functions";
import Comments from "../components/Comments";
import BackButton from "../components/BackButton";
import Modal from "../components/Modal";
import {
  FaHiking,
  FaTrashAlt,
  FaPen,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { SlMap } from "react-icons/sl";
import "../styles/DetailsPage.css";

function ExperienceDetails() {
  const location = useLocation();
  const { experience } = location.state;

  const { _id } = experience as Experience;

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
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);
  const [showRemoveBookmarkModal, setShowRemoveBookmarkModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigateTo = useNavigate();

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

  useEffect(() => {
    fetchExperiences();
  }, [, experience, experience.comments, user]);

  return (
    <div className="pageBody">
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
              {experience && (
                <img
                  style={{ width: "36%", borderRadius: "50%" }}
                  src={
                    experience.author?.user_image ||
                    "https://res.cloudinary.com/dfm1r4ikr/image/upload/v1697397728/voyageApp/userPhoto.png"
                  }
                  alt="authorCardUserPhoto"
                />
              )}

              <h4>{experience.author?.username || ""}</h4>
            </div>
            <div style={{ marginLeft: "1rem" }}>
              {experience && (
                <div>
                  <p>{experience.author?.bio}</p>
                  <p>
                    member since: {formatDate(experience.author.member_since)}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* EXPERIENCE CARD */}
          <div className="detailsSection">
            <div className="detailsPhoto">
              <img src={experience.photo} alt={experience.title} />
              <p>posted on {formatDate(experience.publication_date)}</p>
            </div>

            <div className="textBox">
              {user && user.email === experience.author.email && (
                <>
                  <button
                    className="reactIcons"
                    onClick={() => {
                      handleDeleteExperience(experience._id);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                  <Link to={`/updateexperience/${_id}`} className="reactIcons">
                    <FaPen />
                  </Link>
                </>
              )}
              <div className="row">
                <p>{experience.caption}</p>

                <div className="bookmarkSet">
                  <button
                    className="bookIcon"
                    onClick={() => {
                      handleBookmarkClick(_id);
                    }}
                    style={{
                      color: isBookmarked ? "white" : "black",
                    }}
                  >
                    {isBookmarked ? (
                      <i className="fa fa-bookmark">
                        <FaBookmark />
                      </i>
                    ) : (
                      <i className="fa fa-bookmark-o">
                        <FaRegBookmark />
                      </i>
                      // not bookmarked
                    )}
                  </button>
                </div>
              </div>{" "}
              <hr />
              <div className="row">
                <p id="expDetailsLocation">
                  <Link to={"/map"}>
                    <SlMap /> {experience.location.city},
                    {experience.location.country}
                  </Link>
                </p>
                <p>
                  {" "}
                  <FaHiking /> {experience.experienceType}
                </p>
              </div>
              <hr />
              <p>{experience.text_body}</p>
              <div className="photoRow slideshow-container">
                {experience.photo_body.map((photo: string, idPhoto: number) => {
                  return (
                    <div key={idPhoto + 1} className={`mySlides fade`}>
                      <img src={photo} alt={`${idPhoto}`} />
                    </div>
                  );
                })}

                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      {/* COMMENTS */}
      <Comments comments={experience.comments} _id={experience._id} />
      {/* MODALS */}
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
