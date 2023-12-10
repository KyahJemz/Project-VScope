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
    Responses: {
      type: Array,
      required: false,
    },
    Details: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("dental-appointment", postSchema);
