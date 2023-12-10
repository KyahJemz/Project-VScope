import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    Title: {
      type: String,
      unique: true,
      required: true,
    },
    Content: {
      type: String,
      required: true,
    },
    Department: {
      type: String,
      enum: ["Medical","Dental","SDPC"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("faq", userSchema);
