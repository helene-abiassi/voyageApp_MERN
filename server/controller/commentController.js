import { commentModel } from "../models/commentModel.js";
import { experienceModel } from "../models/experienceModel.js";
import userModel from "../models/userModel.js";

const getAllComments = async (req, res) => {
  const allComments = await commentModel.find().populate([
    { path: "author", select: ["email", "username", "user_image"] },
    { path: "experience", select: ["_id"] },
  ]);

  res.json({
    number: allComments.length,
    data: allComments,
  });
};

const getCommentsByUserId = async (req, res) => {
  const { author } = req.params;

  if (!author) {
    res.status(500).json({
      errorMessage: "No parameter value found in your request!",
    });
  }

  try {
    const commentsByUserId = await commentModel.find({
      author: author,
    });
    // console.log("commentsByUserId :>> ", commentsByUserId);

    if (commentsByUserId.length > 0) {
      res.status(200).json({
        number: commentsByUserId.length,
        data: commentsByUserId,
      });
    } else {
      res.status(200).json({
        number: commentsByUserId.length,
        errorMessage: "OH NO! No comments by this user exist",
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "something went wrong in the request",
      error,
    });
  }
};

const getCommentsByExperienceId = async (req, res) => {
  const { experience } = req.params;

  if (!experience) {
    res.status(500).json({
      errorMessage: "No parameter value found in your request!",
    });
  }

  try {
    const commentsByExperienceId = await commentModel.find({
      experience: experience,
    });
    // console.log("commentsByExperienceId :>> ", commentsByExperienceId);

    if (commentsByExperienceId.length > 0) {
      res.status(200).json({
        number: commentsByExperienceId.length,
        data: commentsByExperienceId,
      });
    } else {
      res.status(200).json({
        number: commentsByExperienceId.length,
        errorMessage: "OH NO! No comments for this experience exist",
      });
    }
  } catch (error) {
    console.log("expType error :>> ", error);
    res.status(500).json({
      errorMessage: "something went wrong in the request",
      error,
    });
  }
};

export { getAllComments, getCommentsByUserId, getCommentsByExperienceId };
