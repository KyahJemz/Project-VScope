import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    nTitle: {
      type: String,
      required: true,
    },
    nDepartment: {
      type: String,
      required: true,
    },
    nImage: {
      type: String,
      required: true,
    },
    nContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("blogs", postSchema);
