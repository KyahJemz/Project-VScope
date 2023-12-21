import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    GoogleEmail: {
      type: String,
      required: true,
    },
    GoogleImage: {
      type: String,
      required: false,
    },
    Department: {
      type: String,
      enum: ["Medical","Dental","SDPC"],
      required: true,
    },
    Status: {
      type: String,
      required: false,
    },
    ClearanceStatus: {
      type: String,
      required: true,
      default: "In Progress"
    },
    Type: {
      type: String,
      enum: ["Appointment","WalkIn"],
      required: true,
    },
    Category: {
      type: String,
      enum: ["Student","Lay Collaborator"],
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
    Prescriptions: {
      type: Array,
      required: false,
    },
    Diagnosis: {
      type: Array,
      required: false,
    },
    Notes: {
      type: Array,
      required: false,
    },
    AppointmentDate: {
      type: String,
      required: true,
    },
    AppointmentTime: {
      type: String,
      required: true,
    },
    DateApproved: {
      type: String,
      required: false,
    },
    DateCleared: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("medical-appointment", postSchema);
