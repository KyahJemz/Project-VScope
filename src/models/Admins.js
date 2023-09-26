import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    GoogleId: {
      type: String,
      unique: true,
      required: true,
    },
    GoogleEmail: {
      type: String,
      unique: true,
      required: true,
    },
    GoogleImage: {
      type: String,
      required: true,
    },
    GoogleName: {
      type: String,
      required: true,
    },
    Department: {
        type: String,
        required: true,
      },
  },
  { timestamps: true }
);

export default mongoose.model("admins", userSchema);
