import { v2 as cloudinary } from "cloudinary";

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
    secure: true,
  });
};

export default cloudinaryConfig;
