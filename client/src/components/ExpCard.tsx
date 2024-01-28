import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ExperiencesContext } from "../context/ExperiencesContext";
import { Experience } from "../types/customTypes";
import { formatDate } from "./Functions";
import Modal from "./Modal";

export interface ExperienceCardProp {
  experience: Experience;
}

function ExpCards({ experience }: ExperienceCardProp) {
  const { _id, author, title, publication_date, photo, bookmarked_by } =
    experience as Experience;

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
    fetchExperiences();
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
  }, [user, experience, isBookmarked]);

  return (
    <>
      <div>
        <div className="storyCardSingle">
          {/* TITLE */}
          <h2 className="storyCardTitle">{title}</h2>

          {/* DELETE/ EDIT BUTTONS */}

          <div className="iconSet">
            {user?.email === experience.author.email && (
              <button
                className="deleteIcon"
                onClick={() => {
                  handleDeleteExperience(_id);
                }}
              >
                <i className="fa fa-trash"></i>
              </button>
            )}{" "}
            {user?.email === experience.author.email && (
              <Link className="deleteIcon" to={`/updateexperience/${_id}`}>
                <i style={{ color: "black" }} className="fa fa-pencil"></i>
              </Link>
            )}{" "}
          </div>

          <div className="photoCard">
            <p>{formatDate(publication_date)}</p>
            <img className="gridPhoto" src={photo} />
          </div>

          {/* BOOKMARK BUTTON */}
          <div className="subPhotoHeader">
            <p>posted by {author?.username}</p>
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
                  <i className="fa fa-bookmark">
                    <span className="bookmarkLgth">{bookmarked_by.length}</span>
                  </i>
                ) : (
                  <i className="fa fa-bookmark-o">
                    <span className="bookmarkLgth">{bookmarked_by.length}</span>
                  </i>
                )}
              </button>
            </div>
          </div>

          {/* REDIRECTION BUTTON */}
          <Link
            className="nakdButton"
            to={`id/${_id}`}
            state={{
              experience: experience,
            }}
          >
            read more
          </Link>
        </div>
        <br />
      </div>
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
    </>
  );
}

export default ExpCards;
