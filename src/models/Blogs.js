import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    Title: {
      type: String,
      unique: true,
      required: true,
    },
    Department: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      required: false,
    },
    Content: {
      type: String,
      required: true,
    },
    Ratings: [{
      Id: String,
      Rating: Number,
    }],
  },
  { timestamps: true }
);

export default mongoose.model("blogs", postSchema);
