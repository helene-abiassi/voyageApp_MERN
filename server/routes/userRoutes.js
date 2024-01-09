import express from "express";
import {
  deleteUser,
  getAllUsers,
  getProfile,
  getUserById,
  logIn,
  signUp,
  updateUser,
  uploadImage,
  getUserByEmail,
} from "../controller/userController.js";
import { multerUpload } from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const router = express.Router();

//GET Routes
router.get("/all", getAllUsers);
router.get("/id/:_id", getUserById);
router.get("/email/:email", getUserByEmail);

router.get("/profile", jwtAuth, getProfile);

//POST Routes
router.post("/imageUpload", multerUpload.single("user_image"), uploadImage);
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/updateuser", jwtAuth, updateUser);

//DELETE Routes
router.delete("/deleteuser/:_id", jwtAuth, deleteUser);

export default router;
