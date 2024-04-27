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
    GoogleImage: {
      type: String,
      required: false,
    },
    Medicines: {
      type: Array,
      required: true,
    },
    Counts: {
      type: Array,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    Concern: {
      type: String,
      default: "",
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

export default mongoose.model("medicine-requests", userSchema);
