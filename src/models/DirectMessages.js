import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    GoogleEmail: {
      type: String,
      required: true,
    },
    FullName: {
        type: String,
        required: true,
    },
    Department: {
        type: String,
        required: true,
    },
    GoogleImage: {
        type: String,
        required: true,
    },
    Responses: {
        type: Array,
        required: false,
        default: []
    },
  },
  { timestamps: true }
);

export default mongoose.model("direct-messages", userSchema);
