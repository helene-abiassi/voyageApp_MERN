import express from "express";
import multer from "multer";
import cors from "cors";
import colors from "colors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import experienceRoutes from "./routes/experienceRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cloudinaryConfig from "./config/cloudinaryConfig.js";
import passportConfig from "./config/passportConfig.js";
import passport from "passport";

dotenv.config();

const app = express();

const addMiddlewares = () => {
  app.use(express.json());
  app.use(cors());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  cloudinaryConfig();
  passport.initialize();
  passportConfig(passport);
};

const startServer = () => {
  const port = process.env.PORT || 5005;

  app.listen(port, () => {
    console.log("Server is running on: ".bgGreen, port);
  });
};

const addRoutes = () => {
  app.use("/api/experiences", experienceRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/test", commentRoutes);
};

//CRUD Create Read Update Delete

const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("connection to MongoDB :>>".bgCyan);
  } catch (error) {
    console.log("error in connection to MongoDB".bgMagenta, error);
  }
};

(async function controller() {
  await DBConnection();
  addMiddlewares();
  addRoutes();
  startServer();
})();
