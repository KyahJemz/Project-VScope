import mongoose from "mongoose";

const { Schema } = mongoose;

const calendarSchema = new Schema(
  {
    Date: {
      type: String,
      required: true,
    },
    GoogleEmail: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("calendar", calendarSchema);
