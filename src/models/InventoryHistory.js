import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    GoogleEmail: {
      type: String,
      required: true,
    },
    ItemName: {
      type: String,
      required: true,
    },
    Count: {
      type: Number,
      required: true,
    },
    Notes: {
      type: String,
      default: "",
      required: false,
    },
    Department: {
      type: String,
      enum: ["Medical","Dental","SDPC"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("inventory-history", userSchema);
