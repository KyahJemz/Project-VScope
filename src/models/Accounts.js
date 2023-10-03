import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    GoogleId: {
      type: String,
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
    GoogleFirstname: {
      type: String,
      required: true,
    },
    GoogleLastname: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      enum: ["Client","Management", "Admin"],
      required: true,
    },
    Department: {
      type: String,
      enum: ["Dental","Medical", "SDPC", null],
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("accounts", userSchema);
