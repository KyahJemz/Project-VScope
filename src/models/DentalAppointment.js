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
    ServiceOffered: {
      type: String,
      required: false,
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
      required: false,
    },
    AppointmentTime: {
      type: String,
      required: false,
    },
    DateApproved: {
      type: String,
      required: false,
    },
    DateCleared: {
      type: String,
      required: false,
    },
    ReScheduled: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model("dental-appointment", postSchema);
