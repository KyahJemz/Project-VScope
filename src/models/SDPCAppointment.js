import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Id: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Consern: {
      type: String,
      required: true,
    },
    Department: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    Account_Id: {
      type: String,
      required: true,
    },
    GoogleEmail: {
      type: String,
      required: true,
    },
    GoogleImage: {
      type: String,
      required: true,
    },
    Responses: {
      type: Array,
      required: false,
    },
    Details: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("sdpc-appointment", postSchema);
