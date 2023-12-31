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
    Details: {
      type: Object,
      required: false,
    },
    MedicalDetails: {
      Height: {
        type: String,
        default: ""
      },
      Weight: {
        type: String,
        default: ""
      },
      BloodType: {
        type: String,
        default: ""
      },
      Files: {
        type: Array,
        default: []
      },
    },
    DentalDetails: {
      Files: {
        type: Array,
        default: []
      },
    },
    SDPCDetails: {
      Files: {
        type: Array,
        default: []
      },
    },
    Role: {
      type: String,
      enum: ["Student","Lay Collaborator","Management", "Admin", "Administrator"],
      required: true,
    },
    Department: {
      type: String,
      enum: ["Dental","Medical", "SDPC", "Administrator", null, ""],
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("accounts", userSchema);
