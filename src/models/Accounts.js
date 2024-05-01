import mongoose from "mongoose";

const { Schema } = mongoose;

const SicknessReportUpdates = new Schema({
  Symptoms: String,
  Date: String,
}, { timestamps: true });


const SicknessReportEntrySchema = new Schema({
  Diagnosis: [String],
  Updates: [SicknessReportUpdates],
  Department: String,
  GoogleEmail: String,
  GoogleImage: String,
  Name: String,
  Status: String,
  IsRequestCleared: {
      type: Boolean,
      default: false,
  },
  IsNew: {
      type: Boolean,
      default: true,
  }
}, { timestamps: true });

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
    SicknessReport: {
      Medical: [SicknessReportEntrySchema],
      Dental: [SicknessReportEntrySchema], 
      SDPC: [SicknessReportEntrySchema],
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
