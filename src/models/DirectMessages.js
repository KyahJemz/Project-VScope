import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    GoogleEmail: {
      type: String,
      required: true,
    },
    Department: {
      type: String,
      required: true,
    },
    Responses: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    Timestamp: {
      type: String,
      required: true,
    },
    ViewedByClient: {
      type: Boolean,
      required: true,
      default: false
    },
    ViewedByDepartment: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model("direct-messages", postSchema);
