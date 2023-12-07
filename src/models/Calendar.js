import mongoose from "mongoose";

const { Schema } = mongoose;

const calendarSchema = new Schema(
  {
    Department: {
      type: String,
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
  },
  { timestamps: true }
);

export default mongoose.model("calendar", calendarSchema);
