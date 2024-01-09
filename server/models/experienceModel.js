import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    // required: true,
  },
  caption: {
    type: String,
  },
  publication_date: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/dfm1r4ikr/image/upload/v1697311768/voyageApp/expphoto_treptowerPark_hrlyk7.png",
  },
  location: {
    country: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    longitude: {
      type: String,
      // required: true,
    },
    latitude: {
      type: String,
      // required: true,
    },
  },
  experienceType: {
    type: String,
    // required: true,
  },

  text_body: {
    type: String,
    // required: true,
  },
  photo_body: [
    {
      type: String,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  bookmarked_by: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const experienceModel = mongoose.model("experience", experienceSchema);

export { experienceModel };
