import express from "express";
import {
  getAllComments,
  getCommentsByExperienceId,
  getCommentsByUserId,
} from "../controller/commentController.js";

const router = express.Router();

//GET routes
router.get("/all", getAllComments);
router.get("/user/:author", getCommentsByUserId);
router.get("/experience/:experience", getCommentsByExperienceId);

export default router;
