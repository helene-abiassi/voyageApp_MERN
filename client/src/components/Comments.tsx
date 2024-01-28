import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { ExperiencesContext } from "../context/ExperiencesContext";
import { AuthContext } from "../context/AuthContext";
import { CommentsType } from "../types/customTypes";
import { formatDate } from "./Functions";
import Modal from "./Modal";
import { IoIosSend } from "react-icons/io";
import "../styles/Comments.css";

type CommentsProps = {
  comments: CommentsType[];
  _id: string;
};

function Comments({ comments, _id }: CommentsProps) {
  const { user } = useContext(AuthContext);
  const { experiences, fetchExperiences } = useContext(ExperiencesContext);
  const experienceID = _id;

  const [newComment, setNewComment] = useState({
    _id: "",
    author: {
      _id: "",
      email: "",
      username: "",
      user_image: "",
    },
    date: new Date(),
    message: "",
    experienceID: experienceID,
  });
  const [commments, setUpdatedComments] = useState<CommentsType[] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleNewCommentInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
    setNewComment({
      ...newComment,
      [e.target.name]: e.target.value,
    });
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5005/api/comments/experience/${_id}`
      );
      if (response.ok) {
        const data = await response.json();

        setUpdatedComments(data.comments);
        fetchExperiences();
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
    }

    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const urlencoded = new URLSearchParams();
      urlencoded.append("_id", user!._id);
      urlencoded.append("email", user!.email);
      urlencoded.append("username", user!.username);
      urlencoded.append("user_image", user!.user_image);
      urlencoded.append("message", newComment.message);
      urlencoded.append("experience", experienceID);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };
      try {
        const response = await fetch(
          `http://localhost:5005/api/experiences/experiences/${_id}/comments`,
          requestOptions
        );

        if (response.ok) {
          const data = await response.json();
          const newComment: CommentsType = data.comment;
          fetchExperiences();
        } else {
          const data = await response.json();
          console.error("Error posting comment:", data.message);
        }
      } catch (error) {
        console.log("error :>> ", error);
      }
    }
    setTextInput("");
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not found");
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      if (window.confirm("Are you SURE you want to delete your comment?")) {
        const response = await fetch(
          `http://localhost:5005/api/experiences/deletecomment/${commentId}`,
          requestOptions
        );
        if (response.ok) {
          fetchExperiences();
        } else {
          console.log("error with response when deleting comment");
        }
      }
    } catch (error) {
      console.log("error when deleting comment:>> ", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [user, experienceID, comments]);

  return (
    <div className="commentsSection">
      <br />
      {/* TITLE SECTION */}
      <h2>comments:</h2>
      <div className="inputContainer">
        <form onSubmit={handleSubmitComment}>
          {/* NEW COMMENT */}
          <div className="newComment">
            <input
              name="message"
              type="text"
              className="commentInput"
              placeholder={
                user
                  ? "Leave a comment..."
                  : "You need to log in to leave a comment..."
              }
              onChange={handleNewCommentInput}
              value={textInput}
              disabled={!user}
            />
            <button className="nakdButton " type="submit">
              <IoIosSend />
              submit{" "}
            </button>
          </div>
        </form>
      </div>
      <br />
      {/* ALL COMMENTS */}

      {comments.length === 0 ? (
        <p>Be the first one to leave a comment!</p>
      ) : null}

      {experiences && experiences.length > 0
        ? experiences.map((experience) => {
            return (
              <div key={experience._id}>
                {experience._id === experienceID &&
                  experience.comments
                    ?.slice()
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((comment) => {
                      return (
                        <div className="singleComment" key={comment._id}>
                          {/* COMMENT HEADER */}
                          <div className="singleCommentHeader">
                            {comment.author && (
                              <div className="commentHeader">
                                <img
                                  className="userImage"
                                  src={comment.author.user_image}
                                  alt={comment.author.username}
                                />
                                <p>{comment.author.username}</p>
                              </div>
                            )}
                            <p>{formatDate(comment.date)}</p>
                          </div>
                          <div className="commentBody">
                            <p className="commentMsg">{comment.message}</p>
                            {user && user.email === comment.author?.email && (
                              <button
                                className="deleteIcon"
                                onClick={() => {
                                  handleDeleteComment(comment._id);
                                }}
                              >
                                <i
                                  style={{ color: "black" }}
                                  className="fa fa-trash"
                                ></i>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
              </div>
            );
          })
        : null}
      <hr />

      {showLoginModal && (
        <Modal
          message="You need to log in first!"
          onClose={handleCloseLoginModal}
        />
      )}
    </div>
  );
}

export default Comments;
