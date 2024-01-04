import mongoose from "mongoose";

const { Schema } = mongoose;

const calendarSchema = new Schema(
  {
    Department: {
      type: String,
      enum: ["Medical","Dental","SDPC"],
      required: true,
    },
    Date: {
      type: String,
      required: true,
    },
    Time: {
      type: String,
      default: "wholeday",
    },
    "8am10am": {
      type: Array,
      default: [],
    },
    "10am12pm": {
      type: Array,
      default: [],
    },
    "1pm3pm": {
      type: Array,
      default: [],
    },
    "3pm5pm": {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("calendar", calendarSchema);
