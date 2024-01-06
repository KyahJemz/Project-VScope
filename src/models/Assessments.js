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
        required: true,
    },
    Department: {
        type: String,
        enum: ["Medical","Dental","SDPC"],
        required: true,
    },
    Type: {
        type: String,
        required: true,
    },
    Set: {
        type: String,
        required: true,
    },
    Ranking: [{
        SubCategory:{
            type: String,
            required: true,
        },
        MainCategory:{
            type: String,
            required: true,
        },
        Result:{
            type: String,
            required: true,
        },
    }],
    Questions: {
        type: Array,
        required: true,
    },
    Answers: {
        type: Array,
        required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("assessments", postSchema);
