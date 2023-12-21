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
      required: true,
    },
    "8am10am": {
      type: Array,
      required: false,
    },
    "10am12am": {
      type: Array,
      required: false,
    },
    "1pm3pm": {
      type: Array,
      required: false,
    },
    "3pm5pm": {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("calendar", calendarSchema);
