import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    Name: {
      type: String,
      unique: true,
      required: true,
    },
    Count: {
      type: Number,
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

export default mongoose.model("inventory", userSchema);
