import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  // do we accept the file the user is uploading or not, type of file
  console.log("req>>>", req);
  console.log("file :>> ", file);

  const extension = path.extname(file.originalname);
  if (extension !== ".png" && extension !== ".jpg" && extension !== ".jpeg") {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const multerUpload = multer({ storage, fileFilter });

export { multerUpload };
