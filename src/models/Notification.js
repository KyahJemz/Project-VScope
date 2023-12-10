import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    Department: {
      type: String,
      enum: ["Medical","Dental","SDPC"],
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Target: {
      type: String,
      enum: ["All","Students","Lay Collaborators"],
      required: true,
    },
    Descriptions: {
      type: String,
      required: true,
    },
    StartingDate: {
      type: String,
      required: true,
    },
    EndingDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("blogs", postSchema);
