import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    aName: {
      type: String,
      required: true,
    },
    aId: {
      type: String,
      required: true,
    },
    aCategory: {
      type: String,
      required: true,
    },
    aConsern: {
      type: String,
      required: true,
    },
    aDepartment: {
      type: String,
      required: true,
    },
    aStatus: {
      type: String,
      required: true,
    },
    aAccount_Id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("medical-appointment", postSchema);
