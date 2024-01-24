import express from "express";
import {
  addBookmark,
  deleteComment,
  deleteExperience,
  getAllExperiences,
  getExperiencesByCity,
  getExperiencesByCountry,
  getExperiencesById,
  getExperiencesByType,
  removeBookmark,
  submitComment,
  submitExperience,
  updateExperience,
  uploadMultiplePhotos,
  uploadPhoto,
} from "../controller/experienceController.js";
import { multerUpload } from "../middlewares/multer.js";

import jwtAuth from "../middlewares/jwtAuth.js";

const router = express.Router();

//GET Routes
router.get("/all", getAllExperiences);
router.get("/id/:_id", getExperiencesById);
router.get("/type/:experienceType", getExperiencesByType);
router.get("/country/:country", getExperiencesByCountry);
router.get("/city/:city", getExperiencesByCity);

//POST Routes
router.post("/experiencesubmission", submitExperience);
router.post("/experiences/:_id/comments", jwtAuth, submitComment);

router.post("/mainphotoupload", multerUpload.single("photo"), uploadPhoto);
router.post(
  "/photoalbumupload",
  multerUpload.array("photo_body", 4),
  uploadMultiplePhotos
);
router.post("/updateexperience", jwtAuth, updateExperience);
router.post("/bookmarkexperience/:_id", jwtAuth, addBookmark);

//DELETE Routes
router.delete("/deletecomment/:_id", jwtAuth, deleteComment);
router.delete("/deleteexperience/:_id", jwtAuth, deleteExperience);
router.delete("/removebookmark/:_id", jwtAuth, removeBookmark);

export default router;
