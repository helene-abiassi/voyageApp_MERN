import { v2 as cloudinary } from "cloudinary";
import { commentModel } from "../models/commentModel.js";
import { experienceModel } from "../models/experienceModel.js";
import userModel from "../models/userModel.js";

const getAllExperiences = async (req, res) => {
  const { comments } = req.query;

  const allExperiences = await experienceModel
    .find()
    .populate([
      {
        path: "bookmarked_by",
        select: ["username", "bio", "member_since", "user_image"],
      },
      {
        path: "comments",
        populate: {
          path: "author",
          select: ["email", "username", "user_image", "date"],
        },
      },
      {
        path: "author",
        select: ["username", "email", "bio", "member_since", "user_image"],
      },
    ])
    .sort({ "comments.date": -1 }); //this works on experience // sort on front-end with comments array

  res.json({
    number: allExperiences.length,
    data: allExperiences,
  });
};

const getExperiencesById = async (req, res) => {
  const id = req.params._id;

  try {
    const experienceByID = await experienceModel.findById(id).populate([
      {
        path: "bookmarked_by",
        select: ["username", "bio", "member_since", "user_image"],
      },
      { path: "comments" },
      {
        path: "author",
        select: ["username", "email", "bio", "member_since", "user_image"],
      },
    ]);

    console.log("experienceByID :>> ", experienceByID);

    if (experienceByID) {
      res.status(200).json({
        number: 1,
        data: experienceByID,
      });
    } else {
      res.status(404).json({
        number: 0,
        errorMessage: "OH NO! No such id exists",
      });
    }
  } catch (error) {
    console.log("expType error :>> ", error);
    res.status(500).json({
      errorMessage: "Something went wrong in the request",
      error: error.message,
    });
  }
};

const getExperiencesByType = async (req, res) => {
  const { experienceType } = req.params;

  try {
    const experiences = await experienceModel.find({
      experienceType: experienceType,
    });

    if (experiences.length > 0) {
      res.status(200).json({
        number: experiences.length,
        data: experiences,
      });
    } else {
      res.status(200).json({
        number: experiences.length,
        errorMessage: "OH NO! No such type exists",
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

const getExperiencesByCountry = async (req, res) => {
  const { country } = req.params;

  try {
    const experienceByCountry = await experienceModel.find({
      "location.country": country,
    });

    if (experienceByCountry.length > 0) {
      res.status(200).json({
        number: experienceByCountry.length,
        data: experienceByCountry,
      });
    } else {
      res.status(404).json({
        number: 0,
        errorMessage: "No experiences found for the specified country",
      });
    }
  } catch (error) {
    console.error("Error in getExperiencesByCountry:", error);
    res.status(500).json({
      errorMessage: "Internal server error",
      error: error.message, // Include the error message for debugging
    });
  }
};

const getExperiencesByCity = async (req, res) => {
  const { city } = req.params;
  console.log("city :>> ", city);

  try {
    // const experienceByCity = await experienceModel.find({
    //   "location.city": city,
    //   "location.country": country,
    // });

    const agg = [
      {
        $search: {
          autocomplete: {
            query: city,
            path: "location.city",
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      { $limit: 5 },

      {
        $project: {
          _id: 0,
          city: 1,
          title: 1,
          photo: 1,
          country: 1,
        },
      },
    ];

    const experienceByCity = await experienceModel.aggregate(agg);

    if (experienceByCity.length > 0) {
      res.status(200).json({
        number: experienceByCity.length,
        data: experienceByCity,
      });
    } else {
      res.status(200).json({
        number: experienceByCity.length,
        errorMessage: "OH NO! No such city exists",
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

const submitExperience = async (req, res) => {
  const photosArray = JSON.parse(req.body.photo_body);
  console.log("req.body :>> ", req.body);

  try {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (existingUser) {
      try {
        const newSubmission = new experienceModel({
          author: existingUser._id,
          title: req.body.title,
          caption: req.body.caption,
          photo: req.body.photo,
          location: {
            country: req.body.country,
            city: req.body.city,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
          },
          experienceType: req.body.experienceType,
          text_body: req.body.text_body,
          photo_body: photosArray,
        });

        const savedSubmission = await newSubmission.save();

        existingUser.submissions.push(savedSubmission._id);
        await existingUser.save();

        res.status(201).json({
          message: "Experience posted successfully",
          submission: savedSubmission,
        });
      } catch (error) {
        console.log("error when trying to submit an experience: ", error);
        res.status(500).json({
          message: "Something went wrong when trying to post an experience",
        });
      }
    } else {
      res.status(401).json({
        message: "You need to be logged in to submit an experience",
      });
    }
  } catch (error) {
    console.log("Catch error: ", error);
    res.status(500).json({
      message: "Oh no! Something went wrong!",
    });
  }
};
const uploadPhoto = async (req, res) => {
  console.log(req.file);

  if (req.file) {
    try {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "voyageApp/experienceMainPhotos",
      });
      console.log("uploadedImage", uploadedImage);
      res.status(200).json({
        message: "Image uploaded successfully",
        photo: uploadedImage.secure_url,
      });
    } catch (error) {
      console.error("error", error);
    }
  } else {
    res.status(500).json({
      error: "File type not supported",
    });
  }
};

const uploadMultiplePhotos = async (req, res) => {
  const photos = req.files;
  console.log("photos :>> ", photos);

  if (!photos || photos.length === 0) {
    res.status(400).json({ error: "No files were uploaded." });
  }

  try {
    const uploadedImages = await Promise.all(
      photos.map(async (photo) => {
        const uploadedImage = await cloudinary.uploader.upload(photo.path, {
          folder: "voyageApp/experiencePhotoAlbum",
        });
        return uploadedImage.secure_url;
      })
    );
    console.log("uploadedImages :>> ", uploadedImages);
    res.status(200).json({
      message: "Images uploaded successfully",
      photo_urls: uploadedImages,
    });
  } catch (error) {
    console.error("Error uploading images", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const submitComment = async (req, res) => {
  const experienceID = req.params._id;
  console.log("experienceID :>> ", experienceID);
  console.log("req.user :>> ", req.user);
  console.log("req.body :>> ", req.body);

  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    console.log("existingUser :>> ", existingUser);
    if (existingUser) {
      try {
        const newComment = new commentModel({
          author: existingUser._id,
          message: req.body.message,
          experience: experienceID,
        });
        const savedComment = await newComment.save();

        const experience = await experienceModel.findOneAndUpdate(
          { _id: experienceID },
          {
            $push: {
              comments: {
                $each: [savedComment],
                $sort: { createdAt: -1 },
              },
            },
          },
          { new: true }
        );

        res.status(201).json({
          message: "Comment posted successfully",
          comment: savedComment,
        });
      } catch (error) {
        console.error("error leaving comment:", error);
        res.status(500).json({
          message: "Something went wrong when trying to leave a comment",
        });
      }
    } else {
      res.status(401).json({
        message: "You need to be logged in to leave a comment",
      });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({
      message: "Oh no! Something went wrong!",
    });
  }
};

const deleteExperience = async (req, res) => {
  const experienceId = req.params._id;

  try {
    if (!experienceId) {
      return res.status(400).json({
        msg: "experienceId is required in the URL parameter",
      });
    }

    const deletedExperience = await experienceModel.findByIdAndDelete(
      experienceId
    );

    if (!deletedExperience) {
      return res.status(404).json({
        msg: "Experience not found",
      });
    }

    await commentModel.deleteMany({ experience: experienceId });

    const users = await userModel.find();

    users.forEach(async (user) => {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark.toString() !== experienceId
      );
      user.submissions = user.submissions.filter(
        (submission) => submission.toString() !== experienceId
      );
      await user.save();
    });

    res.status(200).json({
      msg: "Experience deleted successfully",
      experience: deletedExperience,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
      error: error,
    });
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params._id;

  try {
    if (!commentId) {
      return res.status(400).json({
        msg: "CommentId is required in the URL parameter",
      });
    }

    const deletedComment = await commentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({
        msg: "Comment not found in the comments collection",
      });
    }

    const experienceId = deletedComment.experience;

    const experience = await experienceModel.findByIdAndUpdate(
      experienceId,
      { $pull: { comments: commentId } },
      { new: true }
    );

    if (!experience) {
      return res.status(404).json({
        msg: "Experience not found",
      });
    }

    res.status(200).json({
      msg: "Comment deleted successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
      error: error,
    });
  }
};

const updateExperience = async (req, res) => {
  const filter = { _id: req.body._id };

  const update = {
    title: req.body.title,
    caption: req.body.caption,
    photo: req.body.photo,
    location: {
      country: req.body.country,
      city: req.body.city,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
    },
    experienceType: req.body.experienceType,
    text_body: req.body.text_body,
  };

  try {
    const updatedExperience = await experienceModel.findByIdAndUpdate(
      filter,
      update,
      {
        new: true,
      }
    );

    res.status(200).json({
      msg: "Experience updated successfully",
      updatedExperience,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong when trying to update your experience",
      error: error,
    });
  }
};

const addBookmark = async (req, res) => {
  const experienceId = req.params._id;

  console.log("experienceId :>> ", experienceId);

  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    //replace req.user
    if (!existingUser) {
      return res.status(401).json({
        message: "User not found or not authenticated",
      });
    }

    if (existingUser.bookmarks.includes(experienceId)) {
      return res.status(400).json({
        message: "Experience already bookmarked",
      });
    }

    existingUser.bookmarks.push(experienceId);
    await existingUser.save();

    const experience = await experienceModel.findById(experienceId);
    experience.bookmarked_by.push(existingUser._id);
    await experience.save();

    console.log("experience :>> ", experience);

    res.status(200).json({
      message: "Experience bookmarked successfully",
      user: existingUser,
    });
  } catch (error) {
    console.log("Catch error: ", error);
    res.status(500).json({
      message: "Oh no! Something went wrong!",
    });
  }
};

const removeBookmark = async (req, res) => {
  const experienceId = req.params._id;
  const userEmail = req.body.email;

  try {
    const existingUser = await userModel.findOne({ email: userEmail });

    if (!existingUser) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!existingUser.bookmarks.includes(experienceId)) {
      return res.status(400).json({
        message: "Experience not found in bookmarks",
      });
    }

    existingUser.bookmarks.pull(experienceId);
    await existingUser.save();

    const experience = await experienceModel.findById(experienceId);
    experience.bookmarked_by.pull(existingUser._id);
    await experience.save();

    res.status(200).json({
      message: "Experience removed from bookmarks successfully",
      user: existingUser,
    });
  } catch (error) {
    console.log("Catch error: ", error);
    res.status(500).json({
      message: "Oh no! Something went wrong!",
    });
  }
};

export {
  getAllExperiences,
  getExperiencesByType,
  getExperiencesById,
  getExperiencesByCountry,
  getExperiencesByCity,
  submitExperience,
  uploadPhoto,
  uploadMultiplePhotos,
  submitComment,
  deleteComment,
  deleteExperience,
  updateExperience,
  addBookmark,
  removeBookmark,
};
